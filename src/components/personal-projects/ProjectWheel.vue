<template>
  <section class="wheel-column" @mousedown="startDrag" @touchstart="startDrag">
    <div class="wheel-container" :style="{ transform: `translateY(-50%) rotate(${currentRotation}deg)` }">
      <div class="gear-bg" :style="{ transform: `rotate(${gearRotation}deg)` }">
        <GearSvg />
      </div>
      <!-- Labels ride on their own rotor with the same rotation and transition as the gear,
           so they stay glued to their segment while it turns. -->
      <div class="wheel-rotor" :style="{ transform: `rotate(${rotorRotation}deg)` }">
        <div
          v-for="item in slots"
          :key="item.slot"
          class="wheel-item"
          :class="{ active: item.offset === 0 }"
          :style="getItemStyle(item)"
          @click.stop="selectItem(item.index)"
        >
          <span class="wheel-logo" :class="item.project.logoClass">
            {{ item.project.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import type { Project } from '../../data/projects';
  import GearSvg from './GearSvg.vue';

  const props = defineProps<{
    projects: Project[];
    activeIndex: number;
  }>();

  const emit = defineEmits<{
    (e: 'select', index: number): void;
  }>();

  // Distance from the gear center to each label's center.
  const WHEEL_RADIUS = 278;
  const ANGLE_STEP = 30;
  const SLOT_COUNT = 360 / ANGLE_STEP; // one label per gear segment

  // ponytail: slot s permanently holds project (startIndex + s) % n. That only
  // wraps seamlessly when the project count divides 12 (1, 2, 3, 4, 6 or 12);
  // any other count shows a repeat seam on the far side as the wheel spins.
  const startIndex = props.activeIndex;
  const rotationIndex = ref(0);

  watch(
    () => props.activeIndex,
    (newVal, oldVal) => {
      if (oldVal === undefined) return;
      const total = props.projects.length;
      if (total === 0) return;

      let diff = newVal - oldVal;

      // Turn the short way round.
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      rotationIndex.value -= diff;
    },
    { immediate: true }
  );

  const mod = (a: number, n: number) => ((a % n) + n) % n;

  const slots = computed(() => {
    const total = props.projects.length;
    if (total === 0) return [];

    return Array.from({ length: SLOT_COUNT }, (_, slot) => {
      const index = mod(startIndex + slot, total);
      // Steps away from the selected position (left side of the wheel), -6..5.
      let offset = mod(slot + rotationIndex.value, SLOT_COUNT);
      if (offset >= SLOT_COUNT / 2) offset -= SLOT_COUNT;
      return { slot, index, offset, project: props.projects[index] };
    });
  });

  const isDragging = ref(false);
  const startY = ref(0);
  const currentDragY = ref(0);

  const dragAngleOffset = computed(() => {
    if (!isDragging.value) return 0;
    const deltaY = currentDragY.value - startY.value;
    return deltaY * -0.2;
  });

  const rotorRotation = computed(() => rotationIndex.value * ANGLE_STEP + dragAngleOffset.value);
  // +30 keeps the art's spokes between labels (any multiple of 30 works with the SVG).
  const gearRotation = computed(() => rotorRotation.value + 30);

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

  function getItemStyle({ slot, offset }: { slot: number; offset: number }) {
    // Fixed spot on the rotor: rotate about the gear center, then push straight out,
    // so the label sits exactly midway between two spokes and never moves relative to them.
    return {
      transform: `rotate(${slot * ANGLE_STEP}deg) translateX(-${WHEEL_RADIUS}px)`,
      opacity: Math.max(0.2, 1 - Math.abs(offset) * 0.15),
      zIndex: 50 - Math.abs(offset),
      filter: `grayscale(${offset === 0 ? 0 : 1})`
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

  .wheel-rotor {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    /* Must match .gear-bg so labels and gear turn as one. */
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
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
    /* Keep the filtered SVG on its own layer so rotating it doesn't re-run the filters. */
    will-change: transform;
  }

  .wheel-item {
    position: absolute;
    top: 0;
    left: 0;
    width: 125px;
    height: 70px;
    /* Centered on the gear's middle; the inline transform pushes it out. */
    margin-top: -35px;
    margin-left: -62.5px;
    line-height: 1.3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.4s ease, filter 0.4s ease;
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
