import Character from './Character';

export default class PositionedCharacter {
	character: Character;
	position: number;
	constructor(character: Character, position: number) {
		this.character = character;
		this.position = position;
	}
}
