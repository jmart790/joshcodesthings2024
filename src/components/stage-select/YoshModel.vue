<template>
  <div :class="['yosh-model', { visible: visible, glitch: isGlitching }]" />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps<{
    visible?: boolean;
  }>();

  const isGlitching = ref(false);

  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        isGlitching.value = true;
        setTimeout(() => {
          isGlitching.value = false;
        }, 2000);
      } else {
        isGlitching.value = false;
      }
    }
  );
</script>

<style scoped>
  .yosh-model {
    background-image: url('/YoshModel2025.webp');
    width: 900px;
    height: 95vh;
    position: absolute;
    top: -35%;
    left: 50%;
    transform: translateX(-50%) rotateX(var(--yosh-model-rotate-x, 16deg)) rotateY(var(--yosh-model-rotate-y, -16deg));
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;
    z-index: 5;
    opacity: 0;
    /* Removed transition for instant appearance */
  }

  .yosh-model.visible {
    opacity: 1;
  }

  .yosh-model.glitch {
    animation: flicker 2s linear both;
  }

  .yosh-model.glitch::before,
  .yosh-model.glitch::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/YoshModel2025.webp');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top center;
  }

  .yosh-model.glitch::before {
    left: 4px;
    text-shadow: -3px 0 #ff00c1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    animation: glitch-anim-1 2s infinite linear alternate-reverse;
  }

  .yosh-model.glitch::after {
    left: -4px;
    text-shadow: -3px 0 #00fff9;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    animation: glitch-anim-2 2.5s infinite linear alternate-reverse;
  }

  @keyframes glitch-anim-1 {
    0% {
      clip-path: inset(80% 0 2% 0);
    }
    20% {
      clip-path: inset(10% 0 85% 0);
    }
    40% {
      clip-path: inset(50% 0 30% 0);
    }
    60% {
      clip-path: inset(15% 0 65% 0);
    }
    80% {
      clip-path: inset(95% 0 5% 0);
    }
    100% {
      clip-path: inset(35% 0 55% 0);
    }
  }

  @keyframes glitch-anim-2 {
    0% {
      clip-path: inset(15% 0 70% 0);
    }
    20% {
      clip-path: inset(70% 0 10% 0);
    }
    40% {
      clip-path: inset(25% 0 45% 0);
    }
    60% {
      clip-path: inset(65% 0 15% 0);
    }
    80% {
      clip-path: inset(5% 0 80% 0);
    }
    100% {
      clip-path: inset(45% 0 40% 0);
    }
  }

  @keyframes flicker {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    20% {
      opacity: 0;
    }
    30% {
      opacity: 1;
    }
    40% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    60% {
      opacity: 0.2;
    }
    70% {
      opacity: 1;
    }
    80% {
      opacity: 0.8;
    }
    100% {
      opacity: 1;
    }
  }
</style>
