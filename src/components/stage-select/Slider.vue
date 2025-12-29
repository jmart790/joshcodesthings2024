<template>
  <section class="slider" :style="sliderStyle">
    <SlideItem
      v-for="(item, index) in items"
      :key="item.id"
      :image="item.image"
      :position="index + positionOffset"
      :isActive="index === activeIndex"
      :isSelected="isSelected"
    />
    <YoshModel :visible="showModel" />
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import SlideItem from './SlideItem.vue';
  import YoshModel from './YoshModel.vue';

  const props = defineProps<{
    items: { image: string; name: string; id: number; isActive: boolean; isSelected: boolean }[];
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
    position: absolute;
    width: 200px;
    height: 250px;
    top: 20%;
    left: calc(50% - 100px);
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(var(--active-rotate-y)) rotateX(-16deg);
    transition: transform var(--transition-duration) var(--transition-timing), top 1s ease-out;
  }
</style>
