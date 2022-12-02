import { range } from './generators';
import Character from './Character';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/ally/Bowman';
import Magician from './characters/ally/Magician';
import Swordsman from './characters/ally/Swordsman';
import Daemon from './characters/enemy/Daemon';
import Undead from './characters/enemy/Undead';
import Vampire from './characters/enemy/Vampire';

export function calcTileType(index: number, boardSize: number): string {
	switch (true) {
		case index === 0:
			return 'top-left';
		case index === boardSize - 1:
			return 'top-right';
		case index === boardSize ** 2 - boardSize:
			return 'bottom-left';
		case index === boardSize ** 2 - 1:
			return 'bottom-right';
		case range(1, boardSize - 1).includes(index):
			return 'top';
		case range(boardSize ** 2 - boardSize + 1, boardSize ** 2 - 1).includes(index):
			return 'bottom';
		case range(boardSize, boardSize ** 2 - boardSize, boardSize).includes(index):
			return 'left';
		case range(boardSize * 2 - 1, boardSize ** 2 - 1, boardSize).includes(index):
			return 'right';
		default:
			return 'center';
	}
}

export function calcHealthLevel(health: number) {
	if (health < 15) {
		return 'critical';
	}
	if (health < 50) {
		return 'normal';
	}
	return 'high';
}

export function dealDamage(attacker: Character, target: Character) {
	return Math.max(attacker.attack - target.defence, attacker.attack * 0.1);
}

export function randomElementFromArray(array: any[]) {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

export function characterToClassType(value: Character) {
	const charactersClassesNames: Array<new (level: number) => Character> = [Bowman, Magician, Swordsman, Daemon, Undead, Vampire];
	const indexClassName = charactersClassesNames.findIndex((className) => className.name.toLowerCase() === value.type);
	const character = new charactersClassesNames[indexClassName](value.level);
	character.level = value.level;
	character.health = value.health;
	character.attack = value.attack;
	character.defence = value.defence;
	return character;
}

export function positionedCharacterToClassType(value: PositionedCharacter) {
	const character = characterToClassType(value.character);
	return new PositionedCharacter(character, value.position);
}
