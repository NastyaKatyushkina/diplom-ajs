import Character from './Character';

export default class Team {
	private readonly _characters: Array<Character>;
	constructor(characters: Array<Character>) {
		this._characters = characters;
	}
	get characters(): Array<Character> {
		return this._characters;
	}
	has(character: Character) {
		return this._characters.includes(character);
	}
}
