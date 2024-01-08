import { Notice } from 'obsidian';

import NanoBotsHelpers from './helpers';

import CartridgesModal from './modals/cartridges';
import InputModal from './modals/input';

class NanoBotsDispatcher {
  static async run(params, plugin, editor, counter) {
    if (counter > 2) {
      new Notice('Nano Bots: Too many input requests: ' + counter);
      return;
    }

    if (params.action === 'stop') {
      NanoBotsHelpers.stop();
      return;
    }

    if (!params.cartridge) {
      await this.ask_for_cartridge(params, plugin, editor, counter);
      return;
    }

    if (!editor) {
      new Notice('Nano Bots: No open file. Open one to proceed.');
      return;
    }

    const selection = editor.getSelection();

    if (params.action === 'evaluate') {
      if (selection === '') {
        return;
      }

      NanoBotsHelpers.evaluate(
        plugin,
        editor,
        params.cartridge,
        params.state,
        selection,
        params.mode,
        params.prefix
      );
    } else if (params.action === 'prompt') {
      if (!params.input) {
        this.ask_for_input(params, plugin, editor, counter);
        return;
      }

      NanoBotsHelpers.evaluate(
        plugin,
        editor,
        params.cartridge,
        params.state,
        params.input,
        params.mode,
        params.prefix
      );
    } else if (params.action === 'apply') {
      if (selection === '') {
        return;
      }

      if (!params.input) {
        this.ask_for_input(params, plugin, editor, counter);
        return;
      }

      const text_input = params.format
        .replace('[prompt]', params.input)
        .replace('[input]', selection);

      NanoBotsHelpers.evaluate(
        plugin,
        editor,
        params.cartridge,
        params.state,
        text_input,
        params.mode,
        params.prefix
      );
    }
  }

  static async ask_for_cartridge(params, plugin, editor, counter) {
    const cartridges = await NanoBotsHelpers.cartridges_as_menu(plugin);

    new CartridgesModal(plugin.app, cartridges, (item) => {
      params.cartridge = item.cartridge.system.id;
      params.cartridgeName = item.title;
    
      NanoBotsDispatcher.run(params, plugin, editor, counter + 1);
    }).open();
  }

  static ask_for_input(params, plugin, editor, counter) {
    new InputModal(plugin.app, params.cartridgeName, (input) => {
      params.input = input;
      NanoBotsDispatcher.run(
        params, plugin, editor, counter + 1
      );
    }).open();
  }
}

export default NanoBotsDispatcher;
