<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';
	export let isOpen: boolean;
</script>

{#if isOpen}
	<div role="dialog" class="modal" transition:fly={{ y: -200, duration: 200 }}>
		<div class="contents" on:click={closeModal}>
			<div class="header">
				<h2>How to Play</h2>
				<img src="/images/close.svg" on:click={closeModal} class="close" alt="close" />
			</div>
			<p>
				You have to guess the hidden word in 6 tries and the color of the letters change to show how
				close you are. To start the game connect a Libre wallet, enter any word.
			</p>
			<h3>Examples</h3>
			<div class="blocks">
				<div class="block green">W</div>
				<div class="block">E</div>
				<div class="block">A</div>
				<div class="block">R</div>
				<div class="block">Y</div>
			</div>
			<p>The letter <span class="dark">W</span> is in the word and in the correct spot.</p>
			<br />
			<div class="blocks">
				<div class="block">P</div>
				<div class="block yellow">I</div>
				<div class="block">L</div>
				<div class="block">L</div>
				<div class="block">S</div>
			</div>
			<p>The letter <span class="dark">U</span> is in the word but in the wrong spot.</p>
			<br />
			<div class="blocks">
				<div class="block">V</div>
				<div class="block">A</div>
				<div class="block">G</div>
				<div class="block gray">U</div>
				<div class="block">E</div>
			</div>
			<p>The letter <span class="dark">U</span> is not in the word in any spot.</p>
			<br />
			<p>
				You have to guess the hidden word in 6 tries and the color of the letters change to show how
				close you are.
			</p>
		</div>
	</div>
{/if}

<style>
	.modal {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		/* allow click-through to backdrop */
		pointer-events: none;
		z-index: 100;
	}

	.dark {
		color: #110f28;
	}

	.blocks {
		display: flex;
		column-gap: 10px;
	}

	.block {
		display: flex;
		width: 56px;
		height: 56px;
		border-radius: 6px;
		border: solid 2px #b1b1b9;
		justify-content: center;
		align-items: center;
		font-size: 24px;
	}

	.block.green {
		background-color: #79b851;
		color: #fff;
		border: solid 2px #79b851;
	}

	.block.yellow {
		background-color: #f3c237;
		color: #fff;
		border: solid 2px #f3c237;
	}

	.block.gray {
		background-color: #b1b1b9;
		color: #fff;
		border: solid 2px #b1b1b9;
	}

	.contents {
		max-width: 424px;
		border-radius: 6px;
		padding: 16px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	h2 {
		font-family: Nunito;
		font-size: 22.2px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.44;
		letter-spacing: normal;
		color: #04021d;
		margin: 0;
		padding-top: 0px;
		padding-bottom: 8px;
	}

	h3 {
		/* width: 376px;
		height: 24px; */
		/* margin: 24px 8px 16px 0; */
		font-family: Nunito;
		font-size: 16px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.5;
		letter-spacing: normal;
		color: #04021d;
	}

	p {
		/* width: 376px;
		height: 72px;
		margin: 16px 8px 24px 0; */
		font-family: Nunito;
		font-size: 14px;
		font-weight: 600;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.71;
		letter-spacing: normal;
		color: #686777;
		margin: 0;
		padding-top: 12px;
		padding-bottom: 12px;
	}
	img.close {
		width: 24px;
		height: 24px;
		padding-top: 4px;
		object-fit: contain;
		cursor: pointer;
	}

	.header {
		display: flex;
		justify-content: space-between;
		padding-bottom: 12px;
	}
</style>
