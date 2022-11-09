<script lang="ts">
	import type { Block, Game, User } from 'src/types';
	export let game: Game | null;
	export let user: User | null;

	function getKeyClass(game: Game | null, key: string) {
		if (game) {
			for (let i = 0; i < game.grid.length; i++) {
				for (let j = 0; j < game.grid[i].length; j++) {
					if (game.grid[i][j].character === key) {
						if (game.grid[i][j].status === 'wrong') {
							return 'wrong';
						}
					}
				}
			}

			for (let i = 0; i < game.grid.length; i++) {
				for (let j = 0; j < game.grid[i].length; j++) {
					if (game.grid[i][j].character === key) {
						if (game.grid[i][j].status === 'right') {
							return 'right';
						}
					}
				}
			}

			for (let i = 0; i < game.grid.length; i++) {
				for (let j = 0; j < game.grid[i].length; j++) {
					if (game.grid[i][j].character === key) {
						if (game.grid[i][j].status === 'semi-right') {
							return 'semi-right';
						}
					}
				}
			}
		}
		return '';
	}

	function handleClick(game: Game | null, key: string) {
		if (isDisabled(game, user)) {
			return;
		}
		if (key === 'Enter') {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: key, keyCode: 13 }));
		} else if (key === 'Backspace') {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: key, keyCode: 8 }));
		} else {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: key }));
		}
	}

	function isDisabled(game: Game | null, user: User | null) {
		if (!game) {
			return 'disabled';
		}
		if (user && !user.canPlay) {
			return 'disabled';
		}
		if (game && user) {
			return '';
		}
	}
</script>

<div id="keyboard" class={isDisabled(game, user) ? 'disabled' : ''}>
	<div class="row">
		<button class={getKeyClass(game, 'q')} on:click={() => handleClick(game, 'q')}>Q</button>
		<button class={getKeyClass(game, 'w')} on:click={() => handleClick(game, 'w')}>W</button>
		<button class={getKeyClass(game, 'e')} on:click={() => handleClick(game, 'e')}>E</button>
		<button class={getKeyClass(game, 'r')} on:click={() => handleClick(game, 'r')}>R</button>
		<button class={getKeyClass(game, 't')} on:click={() => handleClick(game, 't')}>T</button>
		<button class={getKeyClass(game, 'y')} on:click={() => handleClick(game, 'y')}>Y</button>
		<button class={getKeyClass(game, 'u')} on:click={() => handleClick(game, 'u')}>U</button>
		<button class={getKeyClass(game, 'i')} on:click={() => handleClick(game, 'i')}>I</button>
		<button class={getKeyClass(game, 'o')} on:click={() => handleClick(game, 'o')}>O</button>
		<button class={getKeyClass(game, 'p')} on:click={() => handleClick(game, 'p')}>P</button>
	</div>
	<div class="row">
		<button class={getKeyClass(game, 'a')} on:click={() => handleClick(game, 'a')}>A</button>
		<button class={getKeyClass(game, 's')} on:click={() => handleClick(game, 's')}>S</button>
		<button class={getKeyClass(game, 'd')} on:click={() => handleClick(game, 'd')}>D</button>
		<button class={getKeyClass(game, 'f')} on:click={() => handleClick(game, 'f')}>F</button>
		<button class={getKeyClass(game, 'g')} on:click={() => handleClick(game, 'g')}>G</button>
		<button class={getKeyClass(game, 'h')} on:click={() => handleClick(game, 'h')}>H</button>
		<button class={getKeyClass(game, 'j')} on:click={() => handleClick(game, 'j')}>J</button>
		<button class={getKeyClass(game, 'k')} on:click={() => handleClick(game, 'k')}>K</button>
		<button class={getKeyClass(game, 'l')} on:click={() => handleClick(game, 'l')}>L</button>
	</div>
	<div class="row">
		<button class="enter" on:click={() => handleClick(game, 'Enter')}>ENTER</button>
		<button class={getKeyClass(game, 'z')} on:click={() => handleClick(game, 'z')}>Z</button>
		<button class={getKeyClass(game, 'x')} on:click={() => handleClick(game, 'x')}>X</button>
		<button class={getKeyClass(game, 'c')} on:click={() => handleClick(game, 'c')}>C</button>
		<button class={getKeyClass(game, 'v')} on:click={() => handleClick(game, 'v')}>V</button>
		<button class={getKeyClass(game, 'b')} on:click={() => handleClick(game, 'b')}>B</button>
		<button class={getKeyClass(game, 'n')} on:click={() => handleClick(game, 'n')}>N</button>
		<button class={getKeyClass(game, 'm')} on:click={() => handleClick(game, 'm')}>M</button>
		<button class="del" on:click={() => handleClick(game, 'Backspace')}
			><img src="/images/keyboard-delete.svg" alt="" />
		</button>
	</div>
</div>

<style>
	#keyboard {
		margin: 8px 8px;
		user-select: none;
		height: 200px;
	}
	.disabled {
		opacity: 0.2;
		pointer-events: none;
	}
	.row {
		display: flex;
		width: 100%;
		justify-content: center;
		gap: 4px;
	}
	button {
		flex-grow: 1;
		min-width: 30px;
		height: 56px;
		margin: 2px auto;
		border: none;
		border-radius: 4px;
		background-color: #dedee2;
		font-family: Nunito;
		font-size: 16px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.68;
		letter-spacing: normal;
		text-align: center;
		color: #110f28;
		justify-content: center;
		align-items: center;
		display: flex;
	}
	button:focus {
		outline: 0;
	}
	button:active {
		background-color: #2c2c2c5c;
	}
	.enter {
		min-width: 65px;
		flex-grow: 2;
		font-size: 14px;
	}
	.del {
		min-width: 65px;
		flex-grow: 2;
	}
	.del img {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.right {
		background-color: #79b851;
		border: solid 1.5px #79b851;
		color: #fff;
	}
	.semi-right {
		background-color: #f3c237;
		border: solid 1.5px #f3c237;
		color: #fff;
	}
	.wrong {
		background-color: #b1b1b9;
		border: solid 1.5px #b1b1b9;
		color: #fff;
	}
</style>
