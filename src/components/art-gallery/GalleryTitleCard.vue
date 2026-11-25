<script setup lang="ts">
  defineProps<{
    themeOne?: string;
    themeTwo?: string;
  }>();
</script>

<template>
  <div class="gallery-title-card frame">
    <div class="title-content">
      <!-- Default: the theme title. The gallery's exit card passes its own content. -->
      <slot>
        <span class="theme">{{ themeOne }}</span>
        <span class="x">X</span>
        <span class="theme">{{ themeTwo }}</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
  .gallery-title-card {
    width: 100%;
    aspect-ratio: 3/4;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    background-color: #121212;
    border: 12px solid #000;
    outline: 1px solid #333;
    box-sizing: border-box;
    image-rendering: pixelated;
    padding: 2rem;
    container-type: inline-size; /* text below sizes off the card's width */
  }

  .title-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    font-family: 'Press Start 2P', cursive;
    line-height: 1.2;
    color: white;
    text-transform: uppercase;
    text-align: center;
  }

  /* Press Start glyphs are 1em wide; the longest word (SLAYER) is 6 chars,
     so 16cqi keeps it inside the card at any width, capped at desktop's 8rem. */
  .theme {
    font-size: min(8rem, 16cqi);
    background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 50%, #00aaff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(4px 4px 0px black);
  }

  .x {
    font-size: min(4rem, 8cqi);
    color: #ffcc00; /* Yellow X */
    filter: drop-shadow(2px 2px 0px black);
  }
</style>
