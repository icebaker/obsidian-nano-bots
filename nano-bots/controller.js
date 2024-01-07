import NanoBotsDispatcher from './dispatcher';

class NanoBotsController {
  static run(obsidian_params, plugin, editor) {
    const params = Object.assign(
      {
        mode: 'replace',
        prefix: '',
        format: '[prompt]: [input]',
        state: '-',
        cartridge: null,
        input: null
      },
      obsidian_params
    );

    NanoBotsDispatcher.run(params, plugin, editor, 0);
  }
}

export default NanoBotsController;
