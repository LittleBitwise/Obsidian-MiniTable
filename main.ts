import {
	App,
	Plugin,
	PluginSettingTab,
	Setting,
	MarkdownPostProcessor,
	MarkdownPostProcessorContext
} from 'obsidian';

interface MiniTableSettings {
	codeblockPrefix: string;
	rowHeaderPrefix: string;
	rowFooterPrefix: string;
	rowSeparator: string;
}

const DEFAULT_SETTINGS: MiniTableSettings = {
	codeblockPrefix: 'minitable',
	rowHeaderPrefix: '*',
	rowFooterPrefix: '_',
	rowSeparator: '|',
}

export default class MiniTable extends Plugin {
	settings: MiniTableSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new MiniTableSettingsTab(this.app, this));

		console.log('hello world');
		this.registerMarkdownCodeBlockProcessor(this.settings.codeblockPrefix, (src, el, ctx) => {
			const table = el.createEl('table');
			const head = table.createEl('thead');
			const body = table.createEl('tbody');
			const foot = table.createEl('tfoot');

			const rows = src.split("\n");
			rows.pop();

			// Calculate the max width of the table before creating it.
			let tableWidth = 1;
			for (let i = 0; i < rows.length; ++i) {
				const cols = rows[i].split(this.settings.rowSeparator);
				if (cols.length > tableWidth) tableWidth = cols.length;
			}

			// Create elements for each row.
			for (let i = 0; i < rows.length; ++i) {
				const cols = rows[i].split(this.settings.rowSeparator);

				// console.log(rows[i]);
				// console.log(cols);

				// Init row/cell based on format found at the start (first cell) of the row.
				let row;
				let cell;
				if (cols[0].contains(this.settings.rowHeaderPrefix)) {
					cols[0] = cols[0].replace(this.settings.rowHeaderPrefix, ' ')
					row = head.createEl('tr');
					cell = 'th';
				} else if (cols[0].contains(this.settings.rowFooterPrefix)) {
					cols[0] = cols[0].replace(this.settings.rowFooterPrefix, ' ')
					row = foot.createEl('tr');
					cell = 'th';
				} else {
					row = body.createEl('tr');
					cell = 'td';
				}

				// Create individual cell elements for this row.
				let j = 0;
				for (; j < cols.length; ++j) {
					row.createEl(cell as keyof HTMLElementTagNameMap, { text: cols[j] });
				}

				// Fill missing cells based on the maximum width of the table.
				for (; j < tableWidth; ++j) {
					row.createEl(cell as keyof HTMLElementTagNameMap, { text: ' ' });
				}
			}
		});
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MiniTableSettingsTab extends PluginSettingTab {
	plugin: MiniTable;

	constructor(app: App, plugin: MiniTable) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Codeblock prefix')
			.setDesc('The plugin is enabled on codeblocks with this name on the first row.')
			.addText(text => text
				.setPlaceholder('minitable')
				.setValue(this.plugin.settings.codeblockPrefix)
				.onChange(async (value) => {
					this.plugin.settings.codeblockPrefix = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Row separator')
			.setDesc('Separates each column in the table.')
			.addText(text => text
				.setPlaceholder('|')
				.setValue(this.plugin.settings.rowSeparator)
				.onChange(async (value) => {
					this.plugin.settings.rowSeparator = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Header prefix')
			.setDesc('If present, marks the row as a header.')
			.addText(text => text
				.setPlaceholder('*')
				.setValue(this.plugin.settings.rowHeaderPrefix)
				.onChange(async (value) => {
					this.plugin.settings.rowHeaderPrefix = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Footer prefix')
			.setDesc('If present, marks the row as a footer.')
			.addText(text => text
				.setPlaceholder('_')
				.setValue(this.plugin.settings.rowFooterPrefix)
				.onChange(async (value) => {
					this.plugin.settings.rowFooterPrefix = value;
					await this.plugin.saveSettings();
				}));
	}
}
