import { FuzzySuggestModal } from 'obsidian';

class CartridgesModal extends FuzzySuggestModal {
  constructor(app, cartridges, onSubmit) {
    super(app);
    this.cartridges = cartridges;
    this.onSubmit = onSubmit;
  }

  getItems() {
    return this.cartridges;
  }

  getItemText(cartridge) {
    return cartridge.title;
  }

  onChooseItem(item, event) {
    this.onSubmit(item)
  }
}

export default CartridgesModal;
