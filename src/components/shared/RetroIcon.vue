<template>
  <div class="retro-icon" :style="{ width: size + 'px', height: size + 'px' }">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-svg">
      <defs>
        <linearGradient id="iconGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#02a7f9" />
          <stop offset="25%" stop-color="#47c2ff" />
          <stop offset="50%" stop-color="#ccf2fd" />
          <stop offset="100%" stop-color="#00aaff" />
        </linearGradient>
        <filter id="iconShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="-2" dy="2" stdDeviation="0.5" flood-color="black" />
        </filter>
      </defs>
      <g filter="url(#iconShadow)">
        <path :d="pathData" fill="url(#iconGradient)" :style="rotationStyle" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  const props = withDefaults(
    defineProps<{
      name: 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'rotate-cw' | 'rotate-ccw';
      size?: number;
    }>(),
    {
      size: 24
    }
  );

  // High-quality pixel art up arrow (24x24 grid)
  const ARROW_PATH = 'M11 4H13V6H15V8H17V10H19V12H5V10H7V8H9V6H11V4ZM10 12H14V20H10V12Z';

  // Chunky, 16-bit style clockwise rotation arrow (L-shape turn)
  const CW_PATH = 'M6 18V6H14V3H16V5H18V7H20V9H18V11H16V13H14V10H10V18Z';

  // Chunky, 16-bit style counter-clockwise rotation arrow (mirrored L-shape turn)
  const CCW_PATH = 'M18 18V6H10V3H8V5H6V7H4V9H6V11H8V13H10V10H14V18Z';

  const pathData = computed(() => {
    if (props.name.startsWith('arrow-')) {
      return ARROW_PATH;
    }
    if (props.name === 'rotate-cw') return CW_PATH;
    if (props.name === 'rotate-ccw') return CCW_PATH;
    return '';
  });

  const rotationStyle = computed(() => {
    switch (props.name) {
      case 'arrow-right':
        return { transform: 'rotate(90deg)', transformOrigin: 'center' };
      case 'arrow-down':
        return { transform: 'rotate(180deg)', transformOrigin: 'center' };
      case 'arrow-left':
        return { transform: 'rotate(-90deg)', transformOrigin: 'center' };
      default:
        return {};
    }
  });
</script>

<style scoped>
  .retro-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .icon-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.5));
  }
</style>
