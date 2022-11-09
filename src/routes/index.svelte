<script lang="ts">
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import Keyboard from '$lib/components/Keyboard.svelte';
	import GameGrid from '$lib/components/GameGrid.svelte';

	if (browser) {
		session.subscribe((value) => {
			if (value.userSession) {
				goto(`${value.userSession.account}`);
			}
		});
	}
</script>

<div id="game">
	<GameGrid game={null} user={null} />
	<Keyboard game={null} user={null} />
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
