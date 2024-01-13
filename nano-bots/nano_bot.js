import { Notice } from 'obsidian';

import NanoBotState from './state';

class NanoBot {
  static stop() {
    NanoBotState.instance().stop();
  }

  static async perform(config, params, callback) {
    const cartridge = await this.cartridge(config, params.cartridge);

    this.stop();

    if (config.NANO_BOTS_STREAM) {
      this.stream_request(config, params, cartridge, callback);
    } else {
      this.non_stream_request(config, params, cartridge, callback);
    }
  }

  static async cartridges(config) {
    return await this.send_request(config, null, 'GET', '/cartridges', 1000);
  }

  static async cartridge(config, cartridge_id) {
    return await this.send_request(
      config,
      { id: cartridge_id },
      'POST',
      '/cartridges/source',
      1000
    );
  }

  static non_stream_request(config, params, cartridge, callback) {
    const thread = NanoBotState.thread();

    NanoBotState.instance().update(cartridge, {
      status: 'pending',
      started_at: Date.now(),
      thread: thread
    });

    this.send_request(config, params, 'POST', '/cartridges').then((response) => {
      if (
        NanoBotState.instance().state.status !== 'stopped' &&
        NanoBotState.instance().state.thread === thread
      ) {
        NanoBotState.instance().update(cartridge, { status: 'finished' });
        callback(response);
      }
    });
  }

  static stream_request(config, params, cartridge, callback) {
    const thread = NanoBotState.thread();

    NanoBotState.instance().update(cartridge, {
      status: 'pending',
      started_at: Date.now(),
      thread: thread
    });

    this.send_request(config, params, 'POST', '/cartridges/stream').then((response) => {
      let stream_id = response.id;
      if (!stream_id) {
        vscode.window.showErrorMessage('Nano Bots: No Stream ID received.');
        return;
      }

      let state = '';

      const streamChecker = () => {
        if (
          NanoBotState.instance().state.status === 'stopped' ||
          NanoBotState.instance().state.thread !== thread
        ) {
          return;
        }

        this.send_request(config, null, 'GET', '/cartridges/stream/' + stream_id).then(
          (response) => {
            let output = response.output;

            if (state !== output) {
              response.fragment = output.slice(state.length);
              state = output;
              callback(response);
            }

            if (response.state === 'finished') {
              NanoBotState.instance().update(cartridge, { status: 'finished' });
            } else {
              setTimeout(streamChecker, 0);
            }
          }
        );
      };

      setTimeout(streamChecker, 0);
    });
  }

  static async send_request(config, params, method, path, timeout = undefined, retries = 0) {
    const api_url = new URL(config.NANO_BOTS_API_ADDRESS + path);
    
    const headers = {
      'Content-Type': 'application/json',
      NANO_BOTS_END_USER: 'obsidian-' + config.NANO_BOTS_END_USER
    }

    if(config.NANO_BOTS_CARTRIDGES_PATH) {
      headers['NANO_BOTS_CARTRIDGES_PATH'] = config.NANO_BOTS_CARTRIDGES_PATH;
    }

    const requestOptions = {
      method: method,
      headers: new Headers(headers),
      body: params ? JSON.stringify(params) : null
    };

    try {
      const response = await this.fetchWithTimeout(api_url, requestOptions, timeout);
      const data = await response.json();

      if(!response.ok) {
        if(data && data.error && data.error.message) {
          throw new Error(data.error.message);
        } else {
          throw new Error(`Request returned status ${response.status}.`);
        }
      }

      return data;
    } catch (error) {
      if (retries < 2) {
        new Notice(`Nano Bots: ${error.message} (${retries + 1}), retrying...`);
        return await this.send_request(config, params, method, path, timeout, retries + 1);
      } else {
        new Notice(`Nano Bots: ${error.message} (3), cancelled.`);
        throw error;
      }
    }
  }

  static fetchWithTimeout(url, options, timeout) {
    return new Promise((resolve, reject) => {
      const timer = timeout ? setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout) : null;

      fetch(url, options).then(response => {
        if (timer) clearTimeout(timer);
        resolve(response);
      }).catch(error => {
        if (timer) clearTimeout(timer);
        reject(error);
      });
    });
  }
}

export default NanoBot;
