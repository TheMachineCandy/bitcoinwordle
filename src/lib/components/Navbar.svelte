<script lang="ts">
	import LibreLink from '@libre-chain/libre-link';
	import LibreLinkBrowserTransport from '@libre-chain/libre-link-browser-transport';
	import { JsonRpc } from 'eosjs';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { UserSession } from 'src/types';
	import { openModal } from 'svelte-modals';
	import InfoModal from './InfoModal.svelte';
	import { failure } from './toast';
	import DisconnectModal from '$lib/components/DisconnectModal.svelte';

	const nodeUrl = process.env['DEV_RPC_URI'];
	const identifier = 'bitcoinwrdle';
	const scheme = 'libre';

	let userSession: UserSession;
	session.subscribe((value) => {
		userSession = value.userSession;
	});

	export const disconnect = async () => {
		openModal(DisconnectModal, { title: 'Disconnect Wallet?' });
	};

	export const connectLibre = async () => {
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

			const identity = await link.login(identifier);
			const res = await fetch('api/login', {
				method: 'POST',
				body: JSON.stringify({ proof: identity.proof })
			});

			const updatedSession: { userSession: UserSession } = await res.json();

			if (res.status === 200 && updatedSession) {
				session.set({ userSession: updatedSession.userSession });
				goto(`${userSession.account}`);
			} else if (res.status === 403) {
				failure('User blacklisted');
			} else {
				throw new Error('Something happened...');
			}
		} catch (err: unknown) {
			console.log(err);
		}
	};

	function showInfo() {
		openModal(InfoModal);
	}
</script>

<header>
	<div class="menu-left">
		<button class="menu-button" on:click={showInfo}>
			<img src="/images/info.svg" alt="" />
		</button>
	</div>
	<div class="title">Bitcoin Wordle</div>
	<div class="menu-right">
		{#if userSession}
			<button class="logged-in" on:click={disconnect}>{userSession.account} </button>
		{:else}
			<button class="connect" on:click={connectLibre}>Connect</button>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: nowrap;
		padding: 0 16px;
		height: var(--header-height);
		border-bottom: 1px solid #dedee2;
	}

	.menu-left {
		display: flex;
		margin: 0;
		padding: 0;
		align-items: center;
		width: 150px;
		justify-content: flex-start;
	}

	.menu-right {
		display: flex;
		width: 150px;
		justify-content: flex-end;
	}

	button.menu-button {
		width: 40px;
		height: 40px;
		margin: 0 8px 0px 0;
		padding: 8px;
		border-radius: 6px;
		border: none;
		background-color: #ebebed;
		cursor: pointer;
	}

	.title {
		font-size: 32px;
		font-weight: 800;
		letter-spacing: -0.6px;
		text-align: center;
		color: var(--dark-text-color);
	}

	button.connect {
		width: 150px;
		height: 40px;
		font-family: Nunito;
		font-weight: 800;
		font-size: 16px;
		text-align: center;
		color: #fff;
		border-radius: 6px;
		border: none;
		background-color: var(--green);
		cursor: pointer;
	}

	button.logged-in {
		width: 150px;
		height: 40px;
		font-size: 16px;
		font-family: Nunito;
		font-weight: 800;
		font-stretch: normal;
		font-style: normal;
		line-height: 1.5;
		letter-spacing: normal;
		text-align: center;
		border-radius: 6px;
		background-color: white;
		border: solid 1.5px #dedee2;
		cursor: pointer;
		color: #313046;
	}

	button.logged-in img {
		position: absolute;
		padding-top: 3px;
		padding-left: 28px;
	}

	@media only screen and (max-width: 560px) {
		.title {
			font-size: 18px;
		}
		button.connect {
			width: 100px;
			height: 40px;
			font-size: 12px;
		}
		button.menu-button {
			width: 35px;
			height: 35px;
		}
		.menu-button img {
			width: 17px;
			height: 17px;
		}
	}
</style>
