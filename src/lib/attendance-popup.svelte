<script lang="ts">
  import { fade, fly } from "svelte/transition";

  export let locked: boolean = false;
  export let isOpen: boolean = locked;
  export let extraStyles: string = "";

  function toggleContainer() {
    if (locked) return;
    isOpen = !isOpen;
  }
</script>

{#key isOpen}
  <div
    class="{extraStyles} custom-modal"
    class:containerOpen={isOpen}
    in:fly={{ y: 40, duration: 150 }}
    out:fly={{ y: 40, duration: 150 }}
  >
    {#if !locked}
      <button class="custom-close-btn" on:click={toggleContainer}> X </button>
    {/if}
    <slot />
  </div>

  <div
    class:hidden={!isOpen}
    class="custom-overlay"
    on:click={toggleContainer}
    on:keydown={toggleContainer}
    role="presentation"
    tabindex="-1"
    in:fade={{ duration: 100 }}
    out:fade={{ duration: 100 }}
  />
{/key}

<style>
  .custom-modal {
    position: fixed;
    left: 50%;
    top: 55%;
    z-index: 20;
    display: none;
    width: 768px;
    max-height: 400px;
    overflow-y: scroll;
    transform: translate(-50%, -50%);
    border-radius: 0.5rem;
    background-color: rgb(var(--color-background-500));
    padding: 1.5rem;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }

  .containerOpen {
    top: 50%;
    display: block;
  }

  .custom-close-btn {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    background-color: rgb(var(--color-background-500));
    outline: none;
    border: none;
    cursor: pointer;
  }

  .custom-overlay {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    height: 100vh;
    width: 100vw;
    background-color: rgba(15, 23, 42, 0.25);
  }
</style>

