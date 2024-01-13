import NanoBot from './nano_bot';
import ObsidianHelpers from './obsidian';

class NanoBotsHelpers {
  static config(plugin) {
    const result = {
      NANO_BOTS_API_ADDRESS: plugin.settings.apiAddress,
      NANO_BOTS_STREAM: plugin.settings.stream,
      NANO_BOTS_END_USER: plugin.settings.endUser
    }

    if(plugin.settings.sendCartridgesPath) {
      result['NANO_BOTS_CARTRIDGES_PATH'] = plugin.settings.cartridgesPath;
    }

    return result;
  }

  static stop() {
    NanoBot.stop();
  }

  static async cartridges_as_menu(plugin) {
    const cartridges = await this.cartridges(plugin);
    const items = [];

    for (const cartridge of cartridges) {
      if (cartridge.meta.symbol) {
        items.push({
          title: cartridge.meta.symbol + ' ' + cartridge.meta.name,
          cartridge: cartridge
        });
      } else {
        items.push({ title: cartridge.meta.name, cartridge: cartridge });
      }
    }

    return items;
  }

  static async cartridges(plugin) {
    return NanoBot.cartridges(this.config(plugin));
  }

  static cartridge(plugin, cartridge_id) {
    return NanoBot.cartridge(this.config(plugin), cartridge_id);
  }

  static async evaluate(plugin, editor, cartridge, state, input, mode, prefix) {
    const params = {
      cartridge,
      state,
      input,
      mode,
      prefix
    };

    const config = this.config(plugin);

    NanoBot.perform(config, params, (result) => {
      this.on_output(editor, { config, params }, result);
    });
  }

  static on_output(editor, environment, result) {
    const content = environment.config.NANO_BOTS_STREAM ? result.fragment : result.output;

    const selection = editor.getSelection()

    if (selection !== undefined) {
      ObsidianHelpers.insertText(
        editor,
        content,
        selection.region,
        environment.params.mode,
        environment.params.prefix
      );
    } else {
      ObsidianHelpers.insertText(
        editor,
        content, null, environment.params.mode, environment.params.prefix
      );
    }
  }
}

export default NanoBotsHelpers;
