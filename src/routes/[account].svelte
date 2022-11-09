<script lang="ts">
	import Keyboard from '$lib/components/Keyboard.svelte';
	import GameGrid from '$lib/components/GameGrid.svelte';

	import { openModal } from 'svelte-modals';
	import WonModal from '$lib/components/WonModal.svelte';

	import type { Block, Game, User } from 'src/types';
	import { failure } from '$lib/components/toast';
	import LostModal from '$lib/components/LostModal.svelte';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	export let user: User | null;

	let canplay = false;

	if (user) {
		if (!user.blacklisted) {
			canplay = true;
		}
	} else {
		if (browser) {
			window.location.href = window.location.protocol + '//' + window.location.host;
		}
	}

	async function handleKeydown(event: { key: any; keyCode: any }) {
		if (!canplay || (user && !user.canPlay)) {
			return;
		}

		let activeRowIndex = user?.currentGame?.activeRowIndex || 0;
		let col = user?.currentGame?.grid[activeRowIndex].length || 0;

		if (event.keyCode === 8) {
			if (col === 0) {
				return;
			}

			user?.currentGame?.grid[activeRowIndex].splice(col - 1, 1);
			if (user?.currentGame?.grid) {
				user.currentGame.grid = user?.currentGame?.grid; // update
			}
			return;
		}

		if (event.keyCode === 13) {
			if (col !== 5) {
				return;
			}
			await submit();
		}

		if (/^[a-zA-Z]+$/.test(event.key) === false || event.key.length !== 1) {
			return;
		}

		if (col > 4) {
			return;
		}

		if (user?.currentGame?.grid) {
			const block: Block = { character: event.key.toLowerCase() || '', status: '' };
			user.currentGame.grid[activeRowIndex][col] = block;
			col++;
		}
	}

	export const submit = async () => {
		if (!canplay || (user && !user.canPlay)) {
			return;
		}

		canplay = false;

		try {
			const res = await fetch(`${user?.account}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json', accept: 'application/json' },
				body: JSON.stringify({
					activeRow: user?.currentGame?.grid[user.currentGame.activeRowIndex]
				})
			});
			const updatedGame: { game: Game } = await res.json();

			if (res.status === 200 && updatedGame.game && user?.currentGame) {
				canplay = true;

				if (user?.currentGame.activeRowIndex === updatedGame.game.activeRowIndex) {
					failure('Not in word list');
				}

				user.currentGame = updatedGame.game;
				if (user.currentGame.won) {
					const amount = `${user.currentGame.sats} SATS`;
					await new Promise((resolve) => setTimeout(resolve, 500));
					openModal(WonModal, { amount: amount, account: user.account });
				} else if (user.currentGame.won === false) {
					await new Promise((resolve) => setTimeout(resolve, 500));
					openModal(LostModal, { account: user.account });
				}
			} else {
				throw new Error('Something happened...');
			}
		} catch (err) {
			console.log(err);
		}
	};

	if (!user?.canPlay && browser) {
		(async () => {
			await new Promise((resolve) => setTimeout(resolve, 60000));
			window.location.reload();
		})();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div id="game">
	<GameGrid game={user?.currentGame || null} user={user || null} />
	<Keyboard game={user?.currentGame || null} user={user || null} />
</div>

<style>
	#game {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
		height: calc(100% - var(--header-height));
		min-height: calc(100% - var(--header-height));
		display: flex;
		flex-direction: column;
	}
</style>
