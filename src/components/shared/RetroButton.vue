<script setup lang="ts">
  defineProps<{
    disabled?: boolean;
    selected?: boolean;
  }>();
</script>

<template>
  <button :disabled="disabled" class="retro-button" :class="{ selected }">
    <slot />
  </button>
</template>

<style scoped>
  .retro-button {
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
    font-size: 24px;
    margin: 10px 0;
    cursor: pointer;
    transition: all 0.3s;
    line-height: 1;
    border: none;
    filter: drop-shadow(-4px 4px 2px black);
    background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .retro-button:hover:not(:disabled),
  .retro-button.selected:not(:disabled) {
    background: linear-gradient(to bottom, #fe9900 0%, #fe9900 25%, #f9e5bd 50%, #ff9900 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .retro-button:disabled {
    background: linear-gradient(to bottom, #484645 0%, #7d7b78 25%, #b0aeaa 50%, #3b3a3a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: not-allowed;
    filter: drop-shadow(-2px 2px 1px black);
  }
</style>
