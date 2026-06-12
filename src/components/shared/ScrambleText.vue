<template>
  <div class="scramble-wrap">
    <div class="text text-fill">{{ displayedText }}</div>
    <div class="text text-outline" aria-hidden="true">{{ displayedText }}</div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    text: {
      type: String,
      required: true
    }
  });

  const SCRAMBLE_FRAME_RANGE = 12;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const displayedText = ref(''); // This will hold the scrambled text

  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const setText = (newText) => {
    const oldText = displayedText.value || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => {
      const queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        const start = Math.floor(Math.random() * SCRAMBLE_FRAME_RANGE);
        const end = start + Math.floor(Math.random() * SCRAMBLE_FRAME_RANGE);
        queue.push({ from, to, start, end });
      }
      animate(queue, resolve);
    });
    return promise;
  };

  const animate = (queue, resolve) => {
    let frame = 0;
    const update = () => {
      let output = '';
      let complete = 0;
      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = getRandomChar();
            queue[i].char = char;
          }
          output += char;
        } else {
          output += from;
        }
      }
      displayedText.value = output;
      if (complete === queue.length) {
        resolve();
      } else {
        frame++;
        requestAnimationFrame(update);
      }
    };
    update();
  };

  watch(
    () => props.text,
    (newText) => {
      setText(newText);
    },
    { immediate: true }
  );
</script>

<style scoped>
  .scramble-wrap {
    position: relative;
    display: inline-block;
    max-width: 100%;
  }

  .text {
    position: relative;
    font-family: 'Saira', sans-serif;
    font-weight: 900;
    font-style: italic;
    font-size: var(--scramble-font-size, 100px);
    display: inline-block;
    line-height: 0.9;
    letter-spacing: var(--scramble-letter-spacing, 0.25rem);
    color: #d3d3d3;
    text-transform: uppercase;
    text-shadow: var(--scramble-text-shadow, -6px 6px black);
    white-space: nowrap;
  }

  .text-outline {
    position: absolute;
    inset: 0;
    z-index: 2000;
    color: transparent;
    -webkit-text-stroke: var(--scramble-stroke-width, 2px) #d3d3d3;
    text-stroke: var(--scramble-stroke-width, 2px) #d3d3d3;
    text-shadow: none;
    pointer-events: none;
  }

  .text::first-letter {
    font-size: 125%;
  }
</style>
