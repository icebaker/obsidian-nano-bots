class NanoBotState {
  constructor() {
    this.state = { status: 'waiting' };
    this._instance = null;
  }

  setStatusBar(element) {
    this.statusBar = element;
  }

  static thread(length = 16) {
     const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static instance() {
    if (!this._instance) {
      this._instance = new NanoBotState();
    }
    return this._instance;
  }

  stop() {
    this.state.status = 'stopped';
    this.state.thread = null;
    this.statusBar.style.display = 'none'
  }

  update(cartridge, new_state = null) {
    if (new_state) {
      this.state = new_state;
    }

    if (this.state.status !== 'pending') {
      this.statusBar.style.display = 'none'
      return;
    }

    let text = '';

    if (!cartridge.meta.symbol) {
      text += '🤖';
    } else {
      text += cartridge.meta.symbol;
    }

    text += ' ' + cartridge.meta.name + '... ';

    let seconds = Math.floor((Date.now() - this.state.started_at) / 1000);

    text += `(${seconds}s)`;

    this.statusBar.setText(text);
    this.statusBar.style.display = '';

    if (this.state.status === 'pending') {
      setTimeout(() => this.update(cartridge), 500);
    }
  }
}

export default NanoBotState;
