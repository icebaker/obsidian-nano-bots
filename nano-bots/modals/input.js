import { Modal, Setting } from 'obsidian';

class InputModal extends Modal {
  constructor(app, title, onSubmit) {
    super(app);
    this.onSubmit = onSubmit;
    this.title = title;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h1', { text: this.title });

    new Setting(contentEl)
      .setName('Prompt')
      .addText((text) => {
        text.onChange((value) => {
          this.result = value
        });

        text.inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.close();
            this.onSubmit(this.result);
          }
        });
      })

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText('Run')
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.result);
          }));
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}

export default InputModal;
