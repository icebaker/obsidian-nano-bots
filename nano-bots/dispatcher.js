import { Notice, Modal, Setting, FuzzySuggestModal } from 'obsidian';

import NanoBotsHelpers from './helpers';

class CartridgesModal extends FuzzySuggestModal {
  constructor(app, state) {
    super(app);
    this.state = state;
  }

  getItems() {
    return this.state.cartridges;
  }

  getItemText(cartridge) {
    return cartridge.title;
  }

  onChooseItem(item, event) {
    this.state.params.cartridge = item.cartridge.system.id;

    NanoBotsDispatcher.run(
      this.state.params, this.state.plugin, this.state.editor, this.state.counter + 1
    );
  }
}

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
    const state = {
      params: params,
      plugin: plugin,
      editor: editor,
      counter: counter,
      cartridges: await NanoBotsHelpers.cartridges_as_menu(plugin)
    }

    new CartridgesModal(plugin.app, state).open();
  }

  static ask_for_input(params, plugin, editor, counter) {
    new Notice('Nano Bots: Not implemented.');
  }
}

export default NanoBotsDispatcher;
