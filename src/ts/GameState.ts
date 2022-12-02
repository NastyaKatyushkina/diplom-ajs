import PositionedCharacter from './PositionedCharacter';
import Character from './Character';

export default class GameState {
	static from({ characters, theme, userTeam }: {
		theme: string,
		characters: PositionedCharacter[],
		userTeam: Character[]
	}) {
		return {
			theme,
			characters,
			userTeam
		};
	}
}
