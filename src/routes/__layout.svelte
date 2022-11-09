<script lang="ts">
	import { Modals, closeModal } from 'svelte-modals';
	import Navbar from '$lib/components/Navbar.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { fade } from 'svelte/transition';
	import '../app.css';
</script>

<svelte:head>
	<title>Bitcoin Wordle</title>
</svelte:head>

<Navbar />

<Modals>
	<div slot="backdrop" class="modal-backdrop" transition:fade={{ duration: 200 }} />
</Modals>

<slot />

<SvelteToast />

<style>
	.modal-backdrop {
		position: fixed;
		/* z-index: 100; */
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.85);
	}
</style>
