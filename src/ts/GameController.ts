import GamePlay from './GamePlay';
import GameStateService from './GameStateService';
import {attackRadius, generatePositionedAllies, generatePositionedEnemies, movementRadius} from './generators';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import { EnemiesVSAlly } from './type/EnemiesVSAlly';
import { dealDamage, randomElementFromArray } from './utils';
import Character from './Character';
import ThemesIterator from './themes/ThemesIterator';
import GameState from './GameState';
import Team from './Team';

export default class GameController {
	private readonly gamePlay: GamePlay;
	private stateService: GameStateService;
	private positionedCharacters: PositionedCharacter[] = [];
	private themes: ThemesIterator = new ThemesIterator('prairie');
	private userTeam?: Team;
	private positionedAllies: PositionedCharacter[] = [];
	private positionedEnemies: PositionedCharacter[] = [];
	constructor(gamePlay: GamePlay, stateService: GameStateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
	}
	init() {
		this.gamePlay.drawUi(this.themes.currentTheme);
		const { boardSize } = this.gamePlay;
		this.positionedAllies = generatePositionedAllies(boardSize);
		this.positionedEnemies = generatePositionedEnemies(boardSize);
		this.positionedCharacters = this.positionedAllies.concat(this.positionedEnemies)
		this.userTeam = new Team(this.positionedAllies.map((positionedAlly) => positionedAlly.character));
		this.gamePlay.redrawPositions(this.positionedCharacters);
		this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
		this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
		this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
		this.gamePlay.addNewGameListener(() => this.init());
		this.gamePlay.addSaveGameListener(() => {
			const state = {
				userTeam: this.positionedAllies,
				enemyTeam: this.positionedEnemies,
				theme: this.themes.currentTheme
			};
			this.stateService.save(state);
		});
		this.gamePlay.addLoadGameListener(() => {
			const state = this.stateService.load();
			if (state) {
				const loadGame = GameState.from(state);
				this.themes = new ThemesIterator(loadGame.theme);
				this.gamePlay.drawUi(this.themes.currentTheme);
				this.positionedAllies = state.allyTeam;
				this.positionedEnemies = state.enemyTeam;
				this.positionedCharacters = loadGame.characters;
				this.userTeam = new Team(loadGame.userTeam);
				this.gamePlay.redrawPositions(this.positionedCharacters);
			}
		});
	}
	onCellClick(index: number) {
		const positionedCharacter = this.positionedCharacters.find(
			(character) => character.position === index
		);
		if (this.gamePlay.currentCharacter && !positionedCharacter && movementRadius(
			this.gamePlay.currentCharacter?.position,
			this.gamePlay.currentCharacter?.character.movementRange,
			this.gamePlay.boardSize
		).includes(index)) {
			this.gamePlay.deselectCell(index);
			this.gamePlay.deselectCell(this.gamePlay.currentCharacter.position);
			this.gamePlay.currentCharacter.position = index;
			this.gamePlay.redrawPositions(this.positionedCharacters);
			this.gamePlay.currentCharacter = undefined;
			this.gamePlay.setCursor(cursors.auto);
			this.attackEnemy();
		}
		if (!positionedCharacter) {
			return;
		}
		if (this.userTeam?.has(positionedCharacter.character)) {
			if (this.gamePlay.currentCharacter?.position) {
				this.gamePlay.deselectCell(this.gamePlay.currentCharacter.position);
			}
			this.gamePlay.currentCharacter = positionedCharacter;
			this.gamePlay.selectCell(index);
		} else if (this.gamePlay.currentCharacter) {
			if (attackRadius(
				this.gamePlay.currentCharacter?.position,
				this.gamePlay.currentCharacter?.character.attackRange,
				this.gamePlay.boardSize
			).includes(index)
				&& !this.userTeam?.has(positionedCharacter.character)
			) {
				this.gamePlay.deselectCell(this.gamePlay.currentCharacter.position);
				const damage = dealDamage(
					this.gamePlay.currentCharacter.character,
					positionedCharacter.character
				);
				positionedCharacter.character.health -= damage;
				this.gamePlay.showDamage(index, `${damage}`).then(() => {
					this.deathCharacter(positionedCharacter.character);
					this.gamePlay.redrawPositions(this.positionedCharacters);
					const enemies = this.enemies();
					this.gamePlay.currentCharacter = undefined;
					this.gamePlay.setCursor(cursors.auto);
					if (enemies && enemies.length) {
						this.attackEnemy();
					} else {
						const allies = this.allies();
						allies?.forEach((ally) => {
							ally.character.levelUP();
						});
						const { boardSize } = this.gamePlay;
						const positionedEnemies = generatePositionedEnemies(boardSize);
						this.positionedCharacters = this.positionedCharacters.concat(positionedEnemies);
						const nextTheme = this.themes.next();
						if (nextTheme !== 'prairie') {
							this.gamePlay.drawUi(nextTheme);
							this.gamePlay.redrawPositions(this.positionedCharacters);
						} else {
							this.gamePlay.clearEvents();
						}
					}
				});
			} else {
				GamePlay.showError('Недопустимое действие');
			}
		} else {
			GamePlay.showError('Выберите своего персонажа');
		}
	}
	onCellEnter(index: number) {
		const character = this.positionedCharacters.find(
			(positionedCharacter) => positionedCharacter.position === index
		)?.character;
		if (character) {
			this.gamePlay.showCellTooltip(character.toString(), index);
		}
		if (this.gamePlay.currentCharacter) {
			if (character) {
				if (this.userTeam?.has(character)) {
					this.gamePlay.setCursor(cursors.pointer);
				} else if (attackRadius(
					this.gamePlay.currentCharacter.position,
					this.gamePlay.currentCharacter.character.attackRange,
					this.gamePlay.boardSize
				).includes(index)) {
					this.gamePlay.setCursor(cursors.crosshair);
					this.gamePlay.selectCell(index, 'red');
				} else {
					this.gamePlay.setCursor(cursors.notallowed);
				}
			} else if (movementRadius(
				this.gamePlay.currentCharacter.position,
				this.gamePlay.currentCharacter.character.movementRange,
				this.gamePlay.boardSize
			).includes(index)) {
				this.gamePlay.setCursor(cursors.pointer);
				this.gamePlay.selectCell(index, 'green');
			} else {
				this.gamePlay.setCursor(cursors.notallowed);
			}
		}
	}
	onCellLeave(index: number) {
		this.gamePlay.hideCellTooltip(index);
		if (index !== this.gamePlay?.currentCharacter?.position) {
			this.gamePlay.deselectCell(index);
		}
	}
	attackEnemy() {
		const allies = this.allies();
		const enemies = this.enemies();
		const attackAlly = allies?.reduce((array, ally: PositionedCharacter) => {
			const enemiesAttackers = enemies?.filter((enemy) => {
				const attackPositionsEnemy = attackRadius(
					enemy.position,
					enemy.character.attackRange,
					this.gamePlay.boardSize
				);
				return attackPositionsEnemy.includes(ally.position);
			});
			if (enemiesAttackers?.length) {
				const item: EnemiesVSAlly = [ally, enemiesAttackers];
				array.push(item);
			}
			return array;
		}, <EnemiesVSAlly[]>[]);
		if (attackAlly?.length) {
			const randomAttackAlly = randomElementFromArray(attackAlly);
			const [attackedAlly, attackerEnemies] = randomAttackAlly;
			const attackerEnemy = randomElementFromArray(attackerEnemies);
			const damage = dealDamage(
				attackerEnemy.character,
				attackedAlly.character
			);
			attackedAlly.character.health -= damage;
			this.gamePlay.showDamage(attackedAlly.position, `${damage}`).then(() => {
				this.deathCharacter(attackedAlly.character);
				this.gamePlay.redrawPositions(this.positionedCharacters);
				if (!this.allies()?.length) {
					this.gamePlay.clearEvents();
				}
			});
		} else if (enemies) {
			const randomEnemy = randomElementFromArray(enemies);
			const possiblePositions = movementRadius(
				randomEnemy.position,
				randomEnemy.character.movementRange,
				this.gamePlay.boardSize
			);
			const positionsCharacters = this.positionedCharacters.map((character) => character.position);
			const positions = possiblePositions.filter((position) => !positionsCharacters.includes(position));
			randomEnemy.position = randomElementFromArray(positions);
		}
	}
	deathCharacter(character: Character) {
		if (character.health <= 0) {
			this.positionedCharacters = this.positionedCharacters.filter((positionedCharacter) => positionedCharacter.character !== character);
		}
	}
	allies() {
		return this.positionedCharacters.filter((value) => this.userTeam?.has(value.character));
	}
	enemies() {
		return this.positionedCharacters.filter((value) => !this.userTeam?.has(value.character));
	}
}
