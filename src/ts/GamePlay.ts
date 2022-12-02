import { calcHealthLevel, calcTileType } from './utils';
import PositionedCharacter from './PositionedCharacter';

export default class GamePlay {
	[key: string]: any;
	public readonly boardSize: number = 8;
	private readonly container: Element;
	private boardEl?: HTMLElement;
	private readonly cells: HTMLElement[] = [];
	private cellClickListeners: any[] = [];
	private cellEnterListeners: any[] = [];
	private cellLeaveListeners: any[] = [];
	private newGameListeners: any[] = [];
	private saveGameListeners: any[] = [];
	private loadGameListeners: any[] = [];
	private newGameEl: any;
	private saveGameEl: any;
	private loadGameEl: any;
	public currentCharacter?: PositionedCharacter;
	constructor(container: HTMLElement) {
		this.container = container;
	}

	drawUi(theme: string) {
		this.container.innerHTML = `
			<div class="controls">
				<button data-id="action-restart" class="btn">New Game</button>
				<button data-id="action-save" class="btn">Save Game</button>
				<button data-id="action-load" class="btn">Load Game</button>
			</div>
			<div class="board-container">
				<div data-id="board" class="board"></div>
			</div>
		`;
		this.newGameEl = this.container.querySelector('[data-id=action-restart]');
		this.saveGameEl = this.container.querySelector('[data-id=action-save]');
		this.loadGameEl = this.container.querySelector('[data-id=action-load]');
		this.newGameEl.addEventListener('click', (event: Event) => this.onNewGameClick(event));
		this.saveGameEl.addEventListener('click', (event: Event) => this.onSaveGameClick(event));
		this.loadGameEl.addEventListener('click', (event: Event) => this.onLoadGameClick(event));
		const board = this.container.querySelector('[data-id=board]');
		this.boardEl = board as HTMLElement;
		this.boardEl.classList.add(theme);
		this.cells.length = 0;
		for (let i = 0; i < this.boardSize ** 2; i += 1) {
			const cellEl = document.createElement('div');
			cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
			cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
			cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
			cellEl.addEventListener('click', (event) => this.onCellClick(event));
			this.boardEl.appendChild(cellEl);
			this.cells.push(cellEl);
		}
	}

	redrawPositions(positions: Array<PositionedCharacter>) {
		for (const cell of this.cells) {
			cell.innerHTML = '';
		}
		for (const position of positions) {
			const cellEl = this.cells[position.position];
			const charEl = document.createElement('div');
			charEl.classList.add('character', position.character.type);
			const healthEl = document.createElement('div');
			healthEl.classList.add('health-level');
			const healthIndicatorEl = document.createElement('div');
			healthIndicatorEl.classList.add(
				'health-level-indicator',
				`health-level-indicator-${calcHealthLevel(position.character.health)}`
			);
			healthIndicatorEl.style.width = `${position.character.health}%`;
			healthEl.appendChild(healthIndicatorEl);
			charEl.appendChild(healthEl);
			cellEl.appendChild(charEl);
		}
	}
	addCellEnterListener(callback: (index: number) => void) {
		this.cellEnterListeners.push(callback);
	}
	addCellLeaveListener(callback: (index: number) => void) {
		this.cellLeaveListeners.push(callback);
	}
	addCellClickListener(callback: (index: number) => void) {
		this.cellClickListeners.push(callback);
	}
	addNewGameListener(callback: () => void) {
		this.newGameListeners.push(callback);
	}
	addSaveGameListener(callback: () => void) {
		this.saveGameListeners.push(callback);
	}
	addLoadGameListener(callback: () => void) {
		this.loadGameListeners.push(callback);
	}
	onCellEnter(event: Event) {
		event.preventDefault();
		const index = this.cells.indexOf(event.currentTarget as HTMLElement);
		this.cellEnterListeners.forEach((o) => o.call(null, index));
	}
	onCellLeave(event: Event) {
		event.preventDefault();
		const index = this.cells.indexOf(event.currentTarget as HTMLElement);
		this.cellLeaveListeners.forEach((o) => o.call(null, index));
	}
	onCellClick(event: Event) {
		const index = this.cells.indexOf(event.currentTarget as HTMLElement);
		this.cellClickListeners.forEach((o) => o.call(null, index));
	}
	onNewGameClick(event: Event) {
		event.preventDefault();
		this.newGameListeners.forEach((o) => o.call(null));
	}
	onSaveGameClick(event: Event) {
		event.preventDefault();
		this.saveGameListeners.forEach((o) => o.call(null));
	}
	onLoadGameClick(event: Event) {
		event.preventDefault();
		this.loadGameListeners.forEach((o) => o.call(null));
	}
	static showError(message: string) {
		alert(message);
	}
	static showMessage(message: string) {
		alert(message);
	}
	selectCell(index: number, color = 'yellow') {
		this.deselectCell(index);
		this.cells[index].classList.add('selected', `selected-${color}`);
	}
	deselectCell(index: number) {
		const cell = this.cells[index];
		cell.classList.remove(...Array.from(cell.classList)
			.filter((o: any) => o.startsWith('selected')));
	}
	showCellTooltip(message: string, index: number) {
		this.cells[index].title = message;
	}
	hideCellTooltip(index: number) {
		this.cells[index].title = '';
	}
	showDamage(index: number, damage: string) {
		return new Promise((resolve: any) => {
			const cell = this.cells[index];
			const damageEl = document.createElement('span');
			damageEl.textContent = damage;
			damageEl.classList.add('damage');
			cell.appendChild(damageEl);
			damageEl.addEventListener('animationend', () => {
				cell.removeChild(damageEl);
				resolve();
			});
		});
	}
	setCursor(cursor: string) {
		if (this.boardEl) {
			this.boardEl.style.cursor = cursor;
		}
	}
	clearEvents() {
		this.cells.forEach((cellEl: HTMLElement) => {
			const clone = cellEl.cloneNode(true);
			cellEl.replaceWith(clone);
		});
	}
}
