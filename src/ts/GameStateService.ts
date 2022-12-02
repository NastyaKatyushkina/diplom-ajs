import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import { positionedCharacterToClassType } from './utils';
import Character from './Character';

export default class GameStateService {
	private storage: Storage;
	constructor(storage: Storage) {
		this.storage = storage;
	}
	save(state: Object) {
		this.storage.setItem('state', JSON.stringify(state));
	}
	load(): {
		theme: string,
		characters: PositionedCharacter[],
		userTeam: Character[],
		allyTeam: PositionedCharacter[],
		enemyTeam: PositionedCharacter[],
	} | undefined {
		try {
			const storageObject = JSON.parse(this.storage.getItem('state') ?? '');
			const positionedUser = storageObject.userTeam.map((item: PositionedCharacter) => positionedCharacterToClassType(item));
			const positionedEnemies = storageObject.enemyTeam.map((item: PositionedCharacter) => positionedCharacterToClassType(item));
			const characters: PositionedCharacter[] = positionedUser.concat(positionedEnemies);
			const userTeam: Character[] = positionedUser.map((item: PositionedCharacter) => item.character);
			return {
				theme: storageObject.theme,
				characters,
				userTeam,
				allyTeam: positionedUser,
				enemyTeam: positionedEnemies
			};
		} catch (e) {
			GamePlay.showError('У Вас нет сохранений');
			return undefined;
		}
	}
}
