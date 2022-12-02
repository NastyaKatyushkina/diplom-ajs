import themes from './themes';

export default class ThemesIterator {
	private readonly values: string[] = themes;
	private index: number;
	currentTheme: string;
	constructor(currentTheme: string) {
		this.currentTheme = currentTheme;
		this.index = this.values.indexOf(currentTheme);
	}
	next(): string {
		++this.index;
		if (this.index === this.values.length) {
			this.index = 0;
		}
		this.currentTheme = this.values[this.index];
		return this.currentTheme;
	}
}
