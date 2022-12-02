import { expect, test } from '@jest/globals';
import Bowman from '../characters/ally/Bowman';
import Daemon from '../characters/enemy/Daemon';
import Magician from '../characters/ally/Magician';
import Swordsman from '../characters/ally/Swordsman';
import Undead from '../characters/enemy/Undead';
import Vampire from '../characters/enemy/Vampire';

test('should match the specified properties', () => {
	const object = new Bowman(1);
	expect(object.type).toBe('bowman');
	expect(object.attack).toBe(25);
	expect(object.defence).toBe(25);
});

test('should match the specified properties', () => {
	const object = new Swordsman(1);
	expect(object.type).toBe('swordsman');
	expect(object.attack).toBe(40);
	expect(object.defence).toBe(10);
});

test('should match the specified properties', () => {
	const object = new Daemon(1);
	expect(object.type).toBe('daemon');
	expect(object.attack).toBe(10);
	expect(object.defence).toBe(10);
});

test('should match the specified properties', () => {
	const object = new Magician(1);
	expect(object.type).toBe('magician');
	expect(object.attack).toBe(10);
	expect(object.defence).toBe(40);
});

test('should match the specified properties', () => {
	const object = new Undead(1);
	expect(object.type).toBe('undead');
	expect(object.attack).toBe(40);
	expect(object.defence).toBe(10);
});

test('should match the specified properties', () => {
	const object = new Vampire(1);
	expect(object.type).toBe('vampire');
	expect(object.attack).toBe(25);
	expect(object.defence).toBe(25);
});

test('should compare strings', () => {
	const object = new Vampire(1);
	const expected = '\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50';
	expect(object.toString()).toBe(expected);
});
