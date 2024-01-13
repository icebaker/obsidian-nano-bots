import {
	App, Editor, MarkdownView, FileSystemAdapter, Modal, Notice, Plugin, PluginSettingTab, Setting
} from 'obsidian';

import NanoBotsController from './nano-bots/controller';
import NanoBotState from './nano-bots/state';

interface NanoBotsSettings {
	apiAddress: string;
	endUser: string;
	stream: boolean;
	sendCartridgesPath: boolean;
	cartridgesPath: string;
}

const DEFAULT_SETTINGS: NanoBotsSettings = {
	apiAddress: 'https://api.nbots.io',
	endUser: 'anonymous',
	stream: true,
	sendCartridgesPath: false,
	cartridgesPath: '',
}

export default class NanoBots extends Plugin {
	settings: NanoBotsSettings;

	async onload() {
		if (this.app.vault.adapter instanceof FileSystemAdapter) {
			const vaultPath = this.app.vault.adapter.getBasePath();

			if(navigator.platform.toLowerCase().includes('win')) {
				DEFAULT_SETTINGS.cartridgesPath = `${vaultPath}\\cartridges:${vaultPath}\\Cartridges`;
			} else {
				DEFAULT_SETTINGS.cartridgesPath = `${vaultPath}/cartridges:${vaultPath}/Cartridges`;
			}
		}

		await this.loadSettings();

		const statusBar = this.addStatusBarItem();
		statusBar.setText('🤖');

		statusBar.toggleClass('status-hidden', true);

		NanoBotState.instance().setStatusBar(statusBar);

		this.addCommand({
			id: 'apply',
			name: 'Apply',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				NanoBotsController.run({ action: 'apply' }, this, editor);
			}
		});

		this.addCommand({
			id: 'evaluate',
			name: 'Evaluate',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				NanoBotsController.run({ action: 'evaluate' }, this, editor);
			}
		});

		this.addCommand({
			id: 'prompt',
			name: 'Prompt',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				NanoBotsController.run({ action: 'prompt' }, this, editor);
			}
		});

		this.addCommand({
			id: 'stop',
			name: 'Stop',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				NanoBotsController.run({ action: 'stop' }, this, editor);
			}
		});

		this.addSettingTab(new NanoBotSettingsTab(this.app, this));
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class NanoBotSettingsTab extends PluginSettingTab {
	plugin: NanoBots;

	constructor(app: App, plugin: NanoBots) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('API Address')
			.setDesc('Set the address for the Nano Bots API.')
			.addText(text => text
				.setPlaceholder('https://api.nbots.io')
				.setValue(this.plugin.settings.apiAddress)
				.onChange(async (value) => {
					this.plugin.settings.apiAddress = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('End User')
			.setDesc('Your custom user identifier (user-name).')
			.addText(text => text
				.setPlaceholder('anonymous')
				.setValue(this.plugin.settings.endUser)
				.onChange(async (value) => {
					this.plugin.settings.endUser = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Stream?')
			.setDesc('Enable or disable streaming.')
			.addToggle(boolean => boolean
				.setValue(this.plugin.settings.stream)
				.onChange(async (value) => {
					this.plugin.settings.stream = value;
					await this.plugin.saveSettings();
				}));

	  new Setting(containerEl)
			.setName('Custom Cartridges?')
			.setDesc('Enable or disable custom cartridges.')
			.addToggle(boolean => boolean
				.setValue(this.plugin.settings.sendCartridgesPath)
				.onChange(async (value) => {
					this.plugin.settings.sendCartridgesPath = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Custom Cartridges Path')
			.setDesc('The path where the API should search for custom cartridges.')
			.addText(text => text
				.setPlaceholder('anonymous')
				.setValue(this.plugin.settings.cartridgesPath)
				.onChange(async (value) => {
					this.plugin.settings.cartridgesPath = value;
					await this.plugin.saveSettings();
				}));
	}
}
