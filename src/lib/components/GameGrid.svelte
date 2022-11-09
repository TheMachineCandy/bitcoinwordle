<script lang="ts">
	import type { Block, Game, User } from 'src/types';
	// @ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { browser } from '$app/env';
	export let game: Game | null;
	export let user: User | null;

	function getBlockClass(game: Game, row: number, col: number) {
		if (!game.grid[row] || !game.grid[row][col]) {
			return 'block';
		}

		let block: Block | undefined = game?.grid[row][col];

		if (row === game?.activeRowIndex) {
			return 'block active';
		}

		if (block.status === 'right') {
			return 'block right';
		}

		if (block.status === 'wrong') {
			return 'block wrong';
		}

		if (block.status === 'semi-right') {
			return 'block semi-right';
		}

		if (block.status === '') {
			return 'block';
		}
	}
</script>

{#if game}
	<div id="grid-container">
		<div id="grid">
			{#if user && user.canPlay !== true && browser}
				<div class="not-ready">
					<div class="not-ready-child">
						<div class="lottie">
							<LottiePlayer
								src="/images/come-back.json"
								autoplay={true}
								loop={true}
								controls={false}
								renderer="svg"
								background="transparent"
								height={150}
								width={150}
							/>
						</div>
					</div>
					<span>Come back later</span>
				</div>
			{/if}
			<div class="row">
				<div class={getBlockClass(game, 0, 0)}>
					{#if game.grid.length > 0 && game.grid[0][0]}
						{game.grid[0][0]?.character?.toUpperCase()}{/if}
				</div>
				<div class={getBlockClass(game, 0, 1)}>
					{#if game.grid.length > 0 && game.grid[0][1]}
						{game.grid[0][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 0, 2)}>
					{#if game.grid.length > 0 && game.grid[0][2]}
						{game.grid[0][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 0, 3)}>
					{#if game.grid.length > 0 && game.grid[0][3]}
						{game.grid[0][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 0, 4)}>
					{#if game.grid.length > 0 && game.grid[0][4]}
						{game.grid[0][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
			<div class="row">
				<div class={getBlockClass(game, 1, 0)}>
					{#if game.grid.length > 1 && game.grid[1][0]}
						{game.grid[1][0]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 1, 1)}>
					{#if game.grid.length > 1 && game.grid[1][1]}
						{game.grid[1][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 1, 2)}>
					{#if game.grid.length > 1 && game.grid[1][2]}
						{game.grid[1][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 1, 3)}>
					{#if game.grid.length > 1 && game.grid[1][3]}
						{game.grid[1][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 1, 4)}>
					{#if game.grid.length > 1 && game.grid[1][4]}
						{game.grid[1][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
			<div class="row">
				<div class={getBlockClass(game, 2, 0)}>
					{#if game.grid.length > 2 && game.grid[2][0]}
						{game.grid[2][0]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 2, 1)}>
					{#if game.grid.length > 2 && game.grid[2][1]}
						{game.grid[2][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 2, 2)}>
					{#if game.grid.length > 2 && game.grid[2][2]}
						{game.grid[2][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 2, 3)}>
					{#if game.grid.length > 2 && game.grid[2][3]}
						{game.grid[2][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 2, 4)}>
					{#if game.grid.length > 2 && game.grid[2][4]}
						{game.grid[2][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
			<div class="row">
				<div class={getBlockClass(game, 3, 0)}>
					{#if game.grid.length > 3 && game.grid[3][0]}
						{game.grid[3][0]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 3, 1)}>
					{#if game.grid.length > 3 && game.grid[3][1]}
						{game.grid[3][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 3, 2)}>
					{#if game.grid.length > 3 && game.grid[3][2]}
						{game.grid[3][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 3, 3)}>
					{#if game.grid.length > 3 && game.grid[3][3]}
						{game.grid[3][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 3, 4)}>
					{#if game.grid.length > 3 && game.grid[3][4]}
						{game.grid[3][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
			<div class="row">
				<div class={getBlockClass(game, 4, 0)}>
					{#if game.grid.length > 4 && game.grid[4][0]}
						{game.grid[4][0]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 4, 1)}>
					{#if game.grid.length > 4 && game.grid[4][1]}
						{game.grid[4][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 4, 2)}>
					{#if game.grid.length > 4 && game.grid[4][2]}
						{game.grid[4][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 4, 3)}>
					{#if game.grid.length > 4 && game.grid[4][3]}
						{game.grid[4][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 4, 4)}>
					{#if game.grid.length > 4 && game.grid[4][4]}
						{game.grid[4][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
			<div class="row">
				<div class={getBlockClass(game, 5, 0)}>
					{#if game.grid.length > 5 && game.grid[5][0]}
						{game.grid[5][0]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 5, 1)}>
					{#if game.grid.length > 5 && game.grid[5][1]}
						{game.grid[5][1]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 5, 2)}>
					{#if game.grid.length > 5 && game.grid[5][2]}
						{game.grid[5][2]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 5, 3)}>
					{#if game.grid.length > 5 && game.grid[5][3]}
						{game.grid[5][3]?.character?.toUpperCase()}
					{/if}
				</div>
				<div class={getBlockClass(game, 5, 4)}>
					{#if game.grid.length > 5 && game.grid[5][4]}
						{game.grid[5][4]?.character?.toUpperCase()}
					{/if}
				</div>
			</div>
		</div>
	</div>
{:else}
	<div id="grid-container">
		<div id="grid">
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
			<div class="row">
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
				<div class="block" />
			</div>
		</div>
	</div>
{/if}

<style>
	#grid-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		overflow: hidden;
	}
	#grid {
		display: grid;
		grid-template-rows: repeat(6, 1fr);
		grid-gap: 5px;
		padding: 15px;
		box-sizing: border-box;
	}
	.row {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-gap: 5px;
	}
	.block {
		width: 55px;
		height: 55px;
		font-family: Nunito;
		font-size: 32px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.75;
		letter-spacing: normal;
		text-align: center;
		color: #110f28;
		border-radius: 6px;
		border: solid 1.5px #dedee2;
	}
	.active {
		border: solid 1.5px #b1b1b9;
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
	.not-ready {
		position: absolute;
		top: calc(50% - 75px);
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		width: 248px;
		height: 212px;
		border-radius: 16px;
		box-shadow: 0 16px 24px 0 rgba(104, 103, 119, 0.16), 0 2px 8px 0 rgba(49, 48, 70, 0.04),
			0 0 1px 0 rgba(0, 0, 0, 0.11);
		font-family: Nunito;
		font-size: 19px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.68;
		letter-spacing: normal;
		text-align: center;
		color: #110f28;
	}
	.not-ready-child {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: -25px;
	}
	.lottie {
		margin: auto;
	}
</style>
