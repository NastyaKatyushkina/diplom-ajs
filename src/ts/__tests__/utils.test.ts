import { expect, test } from '@jest/globals';
import { calcTileType } from '../utils';

test('testName', () => {
	const received = 'top-left';
	const expected = calcTileType(0, 8);
	expect(received).toBe(expected);
});

test('testName', () => {
	const received = 'top-right';
	const expected = calcTileType(7, 8);
	expect(received).toBe(expected);
});

test('testName', () => {
	const received = 'bottom-left';
	const expected = calcTileType(56, 8);
	expect(received).toBe(expected);
});

test('testName', () => {
	const received = 'bottom-right';
	const expected = calcTileType(63, 8);
	expect(received).toBe(expected);
});

test('testName', () => {
	const received = 'top';
	const expected1 = calcTileType(1, 8);
	const expected2 = calcTileType(6, 8);
	expect(received).toBe(expected1);
	expect(received).toBe(expected2);
});

test('testName', () => {
	const received = 'bottom';
	const expected1 = calcTileType(57, 8);
	const expected2 = calcTileType(62, 8);
	expect(received).toBe(expected1);
	expect(received).toBe(expected2);
});

test('testName', () => {
	const received = 'left';
	const expected1 = calcTileType(8, 8);
	const expected2 = calcTileType(48, 8);
	expect(received).toBe(expected1);
	expect(received).toBe(expected2);
});

test('testName', () => {
	const received = 'right';
	const expected1 = calcTileType(15, 8);
	const expected2 = calcTileType(55, 8);
	expect(received).toBe(expected1);
	expect(received).toBe(expected2);
});
