<template>
  <button :disabled="disabled" class="pixel-button" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);
</script>

<style scoped>
.pixel-button {
  font-family: 'Press Start 2P', cursive, Arial, sans-serif;
  font-size: 24px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  filter: drop-shadow(-4px 4px 2px black);
  background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pixel-button:hover:not(:disabled) {
  background: linear-gradient(to bottom, #fe9900 0%, #fe9900 25%, #f9e5bd 50%, #ff9900 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.pixel-button:disabled {
  background: linear-gradient(to bottom, #484645 0%, #7d7b78 25%, #b0aeaa 50%, #3b3a3a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: not-allowed;
  filter: drop-shadow(-2px 2px 1px black);
}
</style>
