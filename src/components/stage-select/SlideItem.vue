<template>
  <div
    class="item-wrapper"
    :class="{ active: isActive, selected: isSelected, disabled: disabled }"
    :style="{ '--position': position }"
  >
    <div class="item">
      <img :src="image" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    image: string;
    position: number;
    isActive: boolean;
    isSelected: boolean;
    disabled?: boolean;
  }>();
</script>

<style scoped>
  .item-wrapper {
    position: absolute;
    inset: 0 0 0 0;
    transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(550px);
    z-index: calc(1000 + (550 - var(--position)) * 1); /* Adjust z-index based on position */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
  }

  .item {
    position: relative;
    width: 100%;
    height: 100%;
    clip-path: polygon(
      0% 0%,
      90% 0%,
      100% 10%,
      100% 100%,
      10% 100%,
      0% 90%
    ); /* Clipping the top-left and bottom-left corners */
    background: linear-gradient(135deg, #000 0%, #333 50%, #000 100%);
  }

  .item-wrapper::before,
  .item-wrapper::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 30px;
    opacity: 0;
    transition: opacity 0.5s ease;
    background: linear-gradient(to right, green, rgb(9, 255, 0));
  }

  .item-wrapper::before {
    top: -8px;
    left: -8px;
    clip-path: polygon(0 0, 100% 0, 100% 15%, 15% 15%, 15% 100%, 0 100%);
  }

  .item-wrapper::after {
    bottom: -8px;
    right: -8px;
    clip-path: polygon(85% 0, 100% 0, 100% 100%, 0 100%, 0 85%, 85% 85%);
  }

  @keyframes flash {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.2;
    }
  }

  @keyframes flip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }

  .item-wrapper.active::before,
  .item-wrapper.active::after {
    opacity: 0.5;
    animation: flash 0.5s infinite;
  }

  .item-wrapper.active.selected {
    transform: rotateY(calc((var(--position) - 0.6) * (360 / var(--quantity)) * 1deg)) translateZ(200px)
      translate(-240%, -45%) !important;
    transition: transform 1s ease, top 1s ease, left 1s ease, width 1s ease, height 1s ease;
  }
  @media screen and (min-width: 1400px) and (min-height: 900px) {
    .item-wrapper.active.selected {
      transform: rotateY(calc((var(--position) - 0.6) * (360 / var(--quantity)) * 1deg)) translateZ(200px)
        translate(-250%, -35%) !important;
    }
  }

  @media screen and (min-width: 2000px) {
    .item-wrapper.active.selected {
      transform: rotateY(calc((var(--position) - 0.6) * (360 / var(--quantity)) * 1deg)) translateZ(200px)
        translate(-290%, -45%) !important;
    }
  }

  /* small screens: don't fly the selected card out — leave it where the active
     card already sits (over the waist). The description slides up as a bottom
     sheet instead (see stage-select.vue). */
  @media screen and (max-width: 768px) {
    .item-wrapper.active.selected {
      transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)) translateZ(550px) !important;
    }
  }

  .item-wrapper.active.selected .item {
    animation: flip 1s forwards;
  }

  .item img {
    position: absolute;
    inset: 2px 2px 2px 2px;
    width: 98%;
    height: 98%;
    clip-path: inherit; /* Inherit clip-path from parent */
  }

  /* Disabled State - Static/No Signal Effect */
  .item-wrapper.disabled {
    pointer-events: none; /* Prevent interaction */
  }

  /* Apply scanlines to all items */
  .item::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 10;
    /* Static Noise Effect */
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.1) 2px,
      rgba(255, 255, 255, 0.1) 4px
    );
    background-size: 100% 4px;
    animation: static-lines 0.2s infinite linear;
    pointer-events: none;
  }

  /* Disabled State - Static Distortion on Image Only */
  .item-wrapper.disabled img {
    filter: contrast(100%) brightness(0.3) sepia(100%) blur(10px);
  }

  /* Disabled State - Question Mark Overlay */
  .item-wrapper.disabled .item::after {
    content: '?';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 6rem;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.8);
    font-family: 'Press Start 2P', cursive;
    text-shadow: 4px 4px 0px #000;
    z-index: 100;
  }

  @keyframes static-lines {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 4px;
    }
  }
</style>
