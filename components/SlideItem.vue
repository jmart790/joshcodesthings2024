<template>
  <div class="item-wrapper" :class="{ active: isActive, selected: isSelected }" :style="{ '--position': position }">
    <div class="item">
      <img :src="image" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ image: string; position: number; isActive: boolean; isSelected: boolean; }>();
</script>

<style scoped>
.item-wrapper {
  position: absolute;
  inset: 0 0 0 0;
  transform: rotateY(calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg))
    translateZ(550px);
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
    0% 0%, 90% 0%, 100% 10%, 100% 100%, 
    10% 100%, 0% 90%
  ); /* Clipping the top-left and bottom-left corners */
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
  0%, 100% {
    opacity: .6;
  }
  50% {
    opacity: .2;
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
  opacity: .5;
  animation: flash .5s infinite;
}

.item-wrapper.active.selected {
  transform: rotateY(calc((var(--position) - 0.6) * (360 / var(--quantity)) * 1deg)) translateZ(200px) translate(-240%, -45%) !important;
  transition: transform 1s ease, top 1s ease, left 1s ease, width 1s ease, height 1s ease;
}
@media  screen and (min-width: 1600px) {
  .item-wrapper.active.selected {
    transform: rotateY(calc((var(--position) - 0.6) * (360 / var(--quantity)) * 1deg)) translateZ(200px) translate(-270%, -45%) !important;
  }  
}

.item-wrapper.active.selected .item img {
  animation: flip 1s forwards;
}

.item img {
  position: absolute;
  inset: 2px 2px 2px 2px;
  width: 98%;
  height: 98%;
  clip-path: inherit; /* Inherit clip-path from parent */
}
</style>
