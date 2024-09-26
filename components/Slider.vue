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
    <YoshModel />
  </section>
</template>

<script setup lang="ts">

const props = defineProps<{
  items: { image: string; name: string; id: number; isActive: boolean; isSelected: boolean }[];
  activeIndex: number;
  positionOffset: number;
  isSelected: boolean;
}>();

const sliderStyle = computed(() => {
  const quantity = props.items.length;
  const activeIndex = 0;
  const initialRotateY = 15; // Initial offset in degrees
  const anglePerItem = 360 / quantity;
  const activeRotateY = initialRotateY + activeIndex * -anglePerItem;

  console.log({ activeRotateY, activeIndex });

  return {
    "--quantity": quantity,
    "--active-index": activeIndex,
    "--initial-rotate-y": `${initialRotateY}deg`,
    "--angle-per-item": `${anglePerItem}deg`,
    "--active-rotate-y": `${activeRotateY}deg`,
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
  transition: transform 0.5s ease;
}
</style>