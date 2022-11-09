<script>
	// @ts-nocheck
	import LibreLink from '@libre-chain/libre-link';
	import LibreLinkBrowserTransport from '@libre-chain/libre-link-browser-transport';
	import { JsonRpc } from 'eosjs';

	import { closeModal } from 'svelte-modals';
	import { fly } from 'svelte/transition';

	// provided by <Modals />
	export let isOpen;
	export let title;

	const nodeUrl = process.env['DEV_RPC_URI'];
	const identifier = 'bitcoinwrdle';
	const scheme = 'libre'; // Change this for testnet or mainnet  ex: libre-dev (testnet) libre (mainnet)
	// The scheme has to be setup on the wallet side as a custom scheme so that it will open the libre wallet

	export const logout = async () => {
		try {
			const rpc = new JsonRpc(nodeUrl, { fetch });
			const info = await rpc.get_info();
			const chainId = info.chain_id;
			const transport = new LibreLinkBrowserTransport();
			const link = new LibreLink({
				transport,
				chains: [
					{
						chainId: chainId,
						nodeUrl: nodeUrl
					}
				],
				scheme: scheme
			});
			await link.clearSessions(identifier);

			const res = await fetch('api/logout', {
				method: 'POST',
				body: ''
			});
			location.href = location.protocol + '//' + location.host;
		} catch (error) {
			location.href = location.protocol + '//' + location.host;
			console.log(error);
		}
	};
</script>

{#if isOpen}
	<div role="dialog" class="modal" transition:fly={{ y: -200, duration: 333 }}>
		<div class="contents">
			<h2>
				{title}
				<img src="/images/close.svg" class="close" alt="Close Modal" on:click={closeModal} />
			</h2>
			<button on:click={logout}>Yes</button>
		</div>
	</div>
{/if}

<style>
	.modal {
		z-index: 100;
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #1a1a1a;

		/* allow click-through to backdrop */
		pointer-events: none;
	}

	.contents {
		width: 324px;
		border-radius: 6px;
		padding: 24px;
		background: white;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		pointer-events: auto;
		overflow-y: auto;
	}

	h2 {
		text-align: left;
		/* font-family: Poppins; */
		font-size: 19.2px;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.25;
		letter-spacing: normal;
		color: #04021d;
		margin: 0;
		padding-bottom: 24px;
	}

	img.close {
		float: right;
		width: 24px;
		height: 24px;
		object-fit: contain;
		cursor: pointer;
	}

	button {
		width: 100%;
		height: 48px;
		border-radius: 8px;
		background-color: #79b851;
		border: none;
		/* font-family: Poppins; */
		font-size: 16px;
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.5;
		letter-spacing: normal;
		text-align: center;
		color: #fff;
		cursor: pointer;
		margin-top: 28px;
	}
	button:hover {
		background-color: #79b851;
	}
	button:active {
		background-color: #79b851;
	}
</style>
