<template>
  <div class="typewriter">{{ displayedText }}</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
  speed: {
    type: Number,
    default: 100,
  },
  delay: {
    type: Number,
    default: 0
  }
});

const displayedText = ref('');
let intervalId = null;

const startTyping = () => {
  
  displayedText.value = '';
  clearInterval(intervalId);
  
  let charIndex = 0;
  intervalId = setInterval(() => {
    if (charIndex < props.text.length) {
      displayedText.value += props.text.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(intervalId);
    }
  }, props.speed);
};

onMounted(() => {
  setTimeout(() => {
    startTyping();
  }, props.delay);
});

watch(() => props.text, () => {
  startTyping();
});
</script>

<style scoped>
.typewriter {
  overflow: hidden;
}
</style>