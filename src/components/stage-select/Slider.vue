<template>
  <section class="slider" :style="sliderStyle">
    <SlideItem
      v-for="(item, index) in items"
      :key="item.id"
      :image="item.image"
      :position="index + positionOffset"
      :isActive="index === activeIndex"
      :isSelected="isSelected"
      :disabled="item.disabled"
    />
    <YoshModel :visible="showModel" />
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import SlideItem from './SlideItem.vue';
  import YoshModel from './YoshModel.vue';

  const props = defineProps<{
    items: { image: string; name: string; id: number; isActive: boolean; isSelected: boolean; disabled?: boolean }[];
    activeIndex: number;
    positionOffset: number;
    isSelected: boolean;
    transitionDuration?: number;
    transitionTiming?: string;
    showModel?: boolean;
  }>();

  const sliderStyle = computed(() => {
    const quantity = props.items.length;
    // We keep this hardcoded to 0 because the container itself shouldn't rotate based on active index.
    // The items themselves move via positionOffset.
    const activeIndex = 0;
    const initialRotateY = 15; // Initial offset in degrees
    const anglePerItem = 360 / quantity;
    const activeRotateY = initialRotateY + activeIndex * -anglePerItem;

    return {
      '--quantity': quantity,
      '--active-index': activeIndex,
      '--initial-rotate-y': `${initialRotateY}deg`,
      '--angle-per-item': `${anglePerItem}deg`,
      '--active-rotate-y': `${activeRotateY}deg`,
      '--transition-duration': `${props.transitionDuration ?? 500}ms`,
      '--transition-timing': props.transitionTiming ?? 'ease'
    };
  });
</script>

<style scoped>
  .slider {
    --slider-scale: 1;
    --active-rotate-x: -16deg;
    --active-rotate-y-adjust: 0deg;
    --yosh-model-rotate-x: 16deg;
    --yosh-model-rotate-y: -16deg;

    position: absolute;
    width: 200px;
    height: 250px;
    top: 20%;
    left: calc(50% - 100px);
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(calc(var(--active-rotate-y) + var(--active-rotate-y-adjust)))
      rotateX(var(--active-rotate-x))
      scale(var(--slider-scale));
    transform-origin: center center;
    transition:
      transform var(--transition-duration) var(--transition-timing),
      top 1s ease-out;
  }

  /* desktop: mirrors --breakpoint-desktop */
  @media (max-width: 1200px) {
    .slider {
      --slider-scale: 0.75;
      --active-rotate-x: -10deg;
      --active-rotate-y-adjust: -15deg;
      --yosh-model-rotate-x: 10deg;
      --yosh-model-rotate-y: 0deg;
    }
  }

  @media (max-width: 900px) {
    .slider {
      --slider-scale: 0.5;
    }
  }
</style>
