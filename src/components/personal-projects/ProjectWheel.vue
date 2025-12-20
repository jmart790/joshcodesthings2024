<template>
  <section class="wheel-column" @mousedown="startDrag" @touchstart="startDrag">
    <div class="wheel-container" :style="{ transform: `translateY(-50%) rotate(${currentRotation}deg)` }">
      <div class="gear-bg" :style="{ transform: `rotate(${gearRotation}deg)` }">
        <img src="/prop_gear.png" alt="Gear Background" class="gear-img" />
      </div>
      <div
        v-for="item in visibleItems"
        :key="`${item.project.name}-${item.offset}`"
        class="wheel-item"
        :class="{ active: item.offset === 0 }"
        :style="getItemStyle(item.offset)"
        @click.stop="selectItem(item.index)"
      >
        <span class="wheel-logo" :class="item.project.logoClass">
          {{ item.project.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { Project } from '../../data/projects';

  const props = defineProps<{
    projects: Project[];
    activeIndex: number;
  }>();

  const emit = defineEmits<{
    (e: 'select', index: number): void;
  }>();

  const VISIBLE_RADIUS = 8;
  const WHEEL_RADIUS = 250;
  const ANGLE_STEP = 30;

  const rotationIndex = ref(0);

  watch(
    () => props.activeIndex,
    (newVal, oldVal) => {
      if (oldVal === undefined) return;
      const total = props.projects.length;
      if (total === 0) return;

      let diff = newVal - oldVal;

      if (diff > 1) diff -= total;
      if (diff < -1) diff += total;

      rotationIndex.value -= diff;
    },
    { immediate: true }
  );

  const visibleItems = computed(() => {
    const total = props.projects.length;
    if (total === 0) return [];

    const items = [];
    for (let i = -VISIBLE_RADIUS; i <= VISIBLE_RADIUS; i++) {
      const index = (((props.activeIndex + i) % total) + total) % total;
      items.push({
        project: props.projects[index],
        index,
        offset: i
      });
    }
    return items;
  });

  const isDragging = ref(false);
  const startY = ref(0);
  const currentDragY = ref(0);

  const dragAngleOffset = computed(() => {
    if (!isDragging.value) return 0;
    const deltaY = currentDragY.value - startY.value;
    return deltaY * -0.2;
  });

  const gearRotation = computed(() => {
    return rotationIndex.value * ANGLE_STEP + dragAngleOffset.value + 30;
  });

  const currentRotation = ref(0);

  function startDrag(event: MouseEvent | TouchEvent) {
    isDragging.value = true;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    startY.value = clientY;
    currentDragY.value = clientY;

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);
  }

  function onDrag(event: MouseEvent | TouchEvent) {
    if (!isDragging.value) return;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    currentDragY.value = clientY;

    const diff = currentDragY.value - startY.value;
    const THRESHOLD_PX = 60;

    if (Math.abs(diff) >= THRESHOLD_PX) {
      if (diff > 0) {
        // Dragging DOWN -> Go to NEXT
        emit('select', (props.activeIndex + 1) % props.projects.length);
        startY.value += THRESHOLD_PX;
      } else {
        // Dragging UP -> Go to PREV
        emit('select', (props.activeIndex - 1 + props.projects.length) % props.projects.length);
        startY.value -= THRESHOLD_PX;
      }
    }
  }

  function stopDrag() {
    isDragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('touchmove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
    window.removeEventListener('touchend', stopDrag);
  }

  function getItemStyle(offset: number) {
    const angleDeg = 180 + offset * ANGLE_STEP + dragAngleOffset.value;
    const angleRad = angleDeg * (Math.PI / 180);

    const x = Math.cos(angleRad) * WHEEL_RADIUS;
    const y = Math.sin(angleRad) * WHEEL_RADIUS;

    const scale = offset === 0 ? 1.1 : 0.9;
    const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.15);
    const zIndex = 50 - Math.abs(offset);
    const grayscale = offset === 0 ? 0 : 1;

    return {
      transform: `translate(${x}px, ${y}px) rotate(${angleDeg - 180}deg) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      filter: `grayscale(${grayscale})`,
      transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s'
    };
  }

  function selectItem(index: number) {
    if (isDragging.value) return;
    emit('select', index);
  }
</script>

<style scoped>
  .wheel-column {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 50vw;
    overflow: hidden;
    pointer-events: auto;
    cursor: grab;
    user-select: none;
    z-index: 50;
  }

  .wheel-column:active {
    cursor: grabbing;
  }

  .wheel-container {
    position: absolute;
    top: 50%;
    right: -35px;
    width: 0;
    height: 0;
  }

  .gear-bg {
    position: absolute;
    top: -550px;
    left: -550px;
    width: 1100px;
    height: 1100px;
    z-index: -1;
    pointer-events: none;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .gear-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.8));
  }

  .wheel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 125px;
    height: 70px;
    margin-top: -30px;
    margin-left: -90px;
    line-height: 1.3;
    display: flex;
    align-items: center;
    justify-content: center;
    transform-origin: center right;
    cursor: pointer;
    will-change: transform;
  }

  .wheel-item:hover {
    filter: brightness(1.2);
  }

  .wheel-logo {
    font-size: 1.1rem;
    font-weight: 900;
    color: #fff;
    font-family: 'Press Start 2P';
    display: flex;
    flex-direction: column; /* Keep column just in case, but min-content does the heavy lifting */
    width: min-content; /* Force wrap at every word */
    align-items: flex-end;
    justify-content: center;
    text-align: center;
    line-height: 1.2;
    transition: all 0.3s ease;
  }

  .wheel-item:not(.active) .wheel-logo {
    color: #554d44 !important;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
    -webkit-text-stroke: 0px;
    -webkit-text-fill-color: #554d44;
    background: none !important;
  }

  .active .wheel-logo {
    background-image: linear-gradient(to bottom, #ffeebb, #cd7f32, #8b4513);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 2px rgba(49, 43, 5, 0.5));
    -webkit-text-stroke: 0.5px #3e1e05;
  }
</style>
