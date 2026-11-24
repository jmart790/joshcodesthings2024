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

    position: absolute;
    width: 200px;
    height: 250px;
    top: 20%;
    left: calc(50% - 100px);
    transform-style: preserve-3d;
    transform: perspective(1000px) rotateY(calc(var(--active-rotate-y) + var(--active-rotate-y-adjust)))
      rotateX(var(--active-rotate-x)) scale(var(--slider-scale));
    transform-origin: center center;
    transition:
      transform var(--transition-duration) var(--transition-timing),
      top 1s ease-out;
  }

  /* tablet → mobile: shrink and re-angle the ring. Yosh lives inside .slider and
     counter-rotates from these same vars (YoshModel.vue), so he stays flat at
     any tilt. Applies to mobile too via the cascade. */
  @media (max-width: 1200px) {
    .slider {
      --slider-scale: 0.75;
    }
  }
  @media (max-width: 900px) {
    .slider {
      --slider-scale: 0.55;
      --active-rotate-x: -10deg; /* ponytail: stand the ring up (less tilt) so the active card rises to the waist; toward 0 = higher, toward -16 = lower */
      --active-rotate-y-adjust: -5deg; /* pull the active card in from the right edge on tablet */
    }
  }
  @media (max-width: 580px) {
    .slider {
      left: 10%;
      top: 15%;
      --active-rotate-y-adjust: -9deg;
    }
  }
  @media (max-width: 425px) {
    .slider {
      --active-rotate-y-adjust: -10deg;
    }
  }
</style>
