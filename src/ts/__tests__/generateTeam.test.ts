import { expect, test } from '@jest/globals';
import { generateTeam } from '../generators';
import Bowman from '../characters/ally/Bowman';
import Magician from '../characters/ally/Magician';
import Swordsman from '../characters/ally/Swordsman';

test('testName', () => {
	const maxLevel = 3;
	const team = generateTeam([Bowman, Magician, Swordsman], maxLevel, 4);
	team.characters.forEach((character) => {
		const received = character.level <= maxLevel;
		expect(received).toBe(true);
	});
});

test('testName', () => {
	const count = 4;
	const team = generateTeam([Bowman, Magician, Swordsman], 3, count);
	const received = team.characters.length;
	expect(received).toBe(count);
});
