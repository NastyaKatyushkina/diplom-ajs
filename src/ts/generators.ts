import Team from './Team';
import Character from './Character';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/ally/Bowman';
import Daemon from './characters/enemy/Daemon';

export function* characterGenerator(
	allowedTypes: Array<new (level: number) => Character>,
	maxLevel: number
) {
	while (true) {
		const level = Math.ceil(Math.random() * maxLevel);
		const index = Math.floor(Math.random() * allowedTypes.length);
		yield new allowedTypes[index](level);
	}
}

export function generateTeam(
	allowedTypes: Array<new (level: number) => Character>,
	maxLevel: number,
	characterCount: number
): Team {
	const generator = characterGenerator(allowedTypes, maxLevel);
	const characters: Array<Character> = [];
	for (let i = 0; i < characterCount; i++) {
		const character = generator.next().value!;
		characters.push(character);
	}
	return new Team(characters);
}

export function range(start: number, end: number, step: number = 1) {
	const ans = [];
	for (let i = start; i < end; i += step) {
		ans.push(i);
	}
	return ans;
}

export function randomPosition(availablePositions: Array<number>, countPositions: number) {
	const array = [];
	for (let i = 0; i < countPositions; i++) {
		const index = Math.floor(Math.random() * availablePositions.length);
		array.push(availablePositions.splice(index, 1));
	}
	return array.flat();
}

export function attackRadius(position: number, radius: number, size: number) {
	const arr = [];
	const possiblePositions = range(
		position - size * radius,
		position + size * radius + 1,
		size
	);
	const verticalPositions = possiblePositions.filter((value) => value >= 0 && value < size * size);
	const verticalPositionsIterator = verticalPositions.values();
	let positionIterator = verticalPositionsIterator.next().value;
	for (let i = 0; i < size; i++) {
		const indexes = range(size * i, size * (i + 1));
		if (indexes.includes(positionIterator)) {
			arr.push(indexes.filter((value) => value <= positionIterator + radius && value >= positionIterator - radius));
			positionIterator = verticalPositionsIterator.next().value;
		}
	}
	return arr.flat();
}

export function movementRadius(position: number, radius: number, size: number) {
	const arr = [];
	const possiblePositions = range(
		position - size * radius,
		position + size * radius + 1,
		size
	);
	const verticalPositions = possiblePositions.filter((value) => value >= 0 && value < size * size);
	const positionIndex = verticalPositions.indexOf(position);
	const topPositions = verticalPositions.slice(0, positionIndex).reverse();
	const bottomPositions = verticalPositions.slice(positionIndex); for (let i = 0; i < radius; i++) {
		for (let j = 0; j < size; j++) {
			const indexes = range(size * j, size * (j + 1));
			if (indexes.includes(topPositions[i])) {
				const a = range(topPositions[i] - (i + 1), topPositions[i] + (i + 2), i + 1);
				arr.push(a.filter((item) => indexes.includes(item)));
			}
			if (indexes.includes(bottomPositions[i + 1])) {
				const b = range(bottomPositions[i + 1] - (i + 1), bottomPositions[i + 1] + (i + 2), i + 1);
				arr.push(b.filter((item) => indexes.includes(item)));
			}
		}
	}
	for (let j = 0; j < size; j++) {
		const indexes = range(size * j, size * (j + 1));
		if (indexes.includes(bottomPositions[0])) {
			const c = range(bottomPositions[0] - radius, bottomPositions[0] + radius + 1);
			arr.push(c.filter((item) => indexes.includes(item)));
		}
	}
	return arr.flat();
}

export function generatePositionedEnemies(boardSize: number) {
	const enemy = [Daemon];
	const countEnemy = 3;
	const enemies = generateTeam(enemy, 4, countEnemy);
	const positionsEnemy = range(boardSize - 2, boardSize * boardSize - boardSize, 8)
		.concat(range(boardSize - 1, boardSize * boardSize - boardSize, 8));
	const randomPositionsEnemy = randomPosition(positionsEnemy, countEnemy);
	return enemies.characters.map(
		(item, idx) => new PositionedCharacter(item, randomPositionsEnemy[idx])
	);
}

export function generatePositionedAllies(boardSize: number) {
	const ally = [Bowman];
	const countAlly = 3;
	const allies = generateTeam(ally, 4, countAlly);
	const positionsAlly = range(0, boardSize * boardSize - boardSize, 8)
		.concat(range(1, boardSize * boardSize - boardSize + 1, 8));
	const randomPositionsAlly = randomPosition(positionsAlly, countAlly);
	return allies.characters.map(
		(item, idx) => new PositionedCharacter(item, randomPositionsAlly[idx])
	);
}
