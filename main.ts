import { App, Modal, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface MiniTableSettings {
	rowHeaderFormat: string;
}

const DEFAULT_SETTINGS: MiniTableSettings = {
	rowHeaderFormat: '-'
}

export default class MiniTable extends Plugin {
	settings: MiniTableSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.findAll("code");

			for (let codeblock of codeblocks) {
				const text = codeblock.innerText.trim();

				// stuff
			}
		});
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

class SampleSettingTab extends PluginSettingTab {
	plugin: MiniTable;

	constructor(app: App, plugin: MiniTable) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Header format')
			.setDesc('If present, marks the first row as the header.')
			.addText(text => text
				.setPlaceholder('Format')
				.setValue(this.plugin.settings.rowHeaderFormat)
				.onChange(async (value) => {
					this.plugin.settings.rowHeaderFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}
