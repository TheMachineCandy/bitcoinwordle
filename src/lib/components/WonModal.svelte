<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';
	// @ts-ignore
	import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
	import { invalidate } from '$app/navigation';
	export let isOpen: boolean;
	export let amount: string;
	export let account: string;

	async function close() {
		closeModal();
		await new Promise((resolve) => setTimeout(resolve, 333));
		invalidate(`/${account}`);
	}
</script>

{#if isOpen}
	<div role="dialog" class="modal" transition:fly={{ y: -200, duration: 200 }}>
		<div class="contents" on:click={close}>
			<div class="header">
				<div />
				<img src="/images/close.svg" on:click={close} class="close" alt="close" />
			</div>
			<div class="won">
				<div class="lottie">
					<LottiePlayer
						src="/images/won-bitcoin.json"
						autoplay={true}
						loop={true}
						controls={false}
						renderer="svg"
						background="transparent"
						height={115}
						width={115}
					/>
				</div>
				<div class="won-title">YOU WON</div>
				<div class="sats">{amount}</div>
			</div>
			<p>Congrats on an amazing score. Come back later for another chance at the Bitcoin Wordle!</p>
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
	}

	.contents {
		width: 375px;
		border-radius: 6px;
		padding: 16px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
	}

	.lottie {
		margin-top: -55px;
		margin-left: 34%;
	}

	.won {
		margin: auto;
		width: 360px;
		height: 155px;
		margin-top: 35px;
		border-radius: 8px;
		background-color: #f5f5f6;
	}

	.won-title {
		font-family: Nunito;
		font-size: 19px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.68;
		letter-spacing: normal;
		text-align: center;
		color: #686777;
	}

	.sats {
		font-family: Nunito;
		font-size: 42.2px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.14;
		letter-spacing: normal;
		text-align: center;
		color: #04021d;
	}

	p {
		padding-top: 12px;
		font-family: Nunito;
		font-size: 14px;
		font-weight: 600;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.71;
		letter-spacing: normal;
		text-align: center;
		color: #686777;
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
