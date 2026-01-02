<template>
  <!-- Main container for the 3D scene -->
  <div class="scene-container">
    <div class="scene">
      <div
        class="cube-rotator"
        :style="{
          transform: `rotateX(-15deg) rotateY(-15deg) rotateZ(${rotateZ}deg)`,
          transition: rotatorTransition
        }"
      >
        <div class="cube" :style="cubeStyle">
          <!-- 6 Faces of the cube generated dynamically -->
          <div v-for="(face, index) in FACES" :key="face" :class="['cube-face', `face-${face}`]">
            <div class="content-wrapper">
              <header class="carousel-header">
                <h2 class="title">{{ getSlide(index).title }}</h2>
              </header>
              <div class="carousel-body">
                <div class="icon-container" v-if="getSlide(index).icon">
                  <img :src="getSlide(index).icon" :alt="getSlide(index).title" class="slide-icon" />
                </div>
                <p class="description">{{ getSlide(index).text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- D-Pad Controls -->
    <div class="d-pad">
      <div class="rotator-controls">
        <CarouselControlBtn icon="rotate-ccw" title="Rotate Counter-Clockwise" @click="rotate('ccw')" />
        <CarouselControlBtn icon="rotate-cw" title="Rotate Clockwise" @click="rotate('cw')" />
      </div>
      <div class="directional-controls">
        <CarouselControlBtn icon="arrow-up" @click="rotate('up')" />
        <div class="middle-row">
          <CarouselControlBtn icon="arrow-left" @click="rotate('left')" />
          <CarouselControlBtn icon="arrow-right" @click="rotate('right')" />
        </div>
        <CarouselControlBtn icon="arrow-down" @click="rotate('down')" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import CarouselControlBtn from './CarouselControlBtn.vue';

  // --- Types ---
  export interface Slide {
    title: string;
    text: string;
    icon?: string;
  }

  type Direction = 'up' | 'down' | 'left' | 'right';
  type RotationDirection = 'cw' | 'ccw';
  type ControlAction = Direction | RotationDirection;
  type CubeFace = 'front' | 'right' | 'back' | 'left' | 'top' | 'bottom';
  type Axis = 'x' | 'y';

  // --- Constants ---
  const ROTATION_STEP = 90;
  const TILT_ANGLE = -15;
  const PHASE_COUNT = 4;
  const FACES: CubeFace[] = ['front', 'right', 'back', 'left', 'top', 'bottom'];

  // Mapping lookup for view-relative navigation
  // Phase 0 (0deg):   Up->X+, Down->X-, Right->Y+, Left->Y-
  // Phase 1 (90deg):  Up->Y-, Down->Y+, Right->X+, Left->X-
  // Phase 2 (180deg): Up->X-, Down->X+, Right->Y-, Left->Y+
  // Phase 3 (270deg): Up->Y+, Down->Y-, Right->X-, Left->X+
  const DIRECTION_MAPPINGS: Record<number, Record<Direction, { axis: Axis; val: number }>> = {
    0: {
      up: { axis: 'x', val: ROTATION_STEP },
      down: { axis: 'x', val: -ROTATION_STEP },
      left: { axis: 'y', val: -ROTATION_STEP },
      right: { axis: 'y', val: ROTATION_STEP }
    },
    1: {
      up: { axis: 'y', val: -ROTATION_STEP },
      down: { axis: 'y', val: ROTATION_STEP },
      left: { axis: 'x', val: -ROTATION_STEP },
      right: { axis: 'x', val: ROTATION_STEP }
    },
    2: {
      up: { axis: 'x', val: -ROTATION_STEP },
      down: { axis: 'x', val: ROTATION_STEP },
      left: { axis: 'y', val: ROTATION_STEP },
      right: { axis: 'y', val: -ROTATION_STEP }
    },
    3: {
      up: { axis: 'y', val: ROTATION_STEP },
      down: { axis: 'y', val: -ROTATION_STEP },
      left: { axis: 'x', val: ROTATION_STEP },
      right: { axis: 'x', val: -ROTATION_STEP }
    }
  };

  // --- Props ---
  const props = withDefaults(
    defineProps<{
      slides: Slide[];
    }>(),
    {
      slides: () => []
    }
  );

  // --- State ---

  const rotateX = ref(0);
  const rotateY = ref(0);
  const rotateZ = ref(-720);

  // Animation state
  const rotatorTransition = ref('transform 2.5s ease-out');
  const zOffset = ref('-50000px');
  const transitionStyle = ref('transform 2.5s ease-out');

  const cubeStyle = computed(() => ({
    transform: `translateZ(${zOffset.value}) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: transitionStyle.value
  }));

  onMounted(() => {
    // Trigger fly-in animation
    setTimeout(() => {
      zOffset.value = 'calc(var(--cube-size) / -2)';
      rotateY.value = -720;
    }, 50);

    // Reset transition to default CSS after animation
    setTimeout(() => {
      transitionStyle.value = '';
      rotatorTransition.value = 'transform 1s ease-in-out';
    }, 2050);
  });

  // --- Methods ---

  /**
   * Handles rotation logic for both view (Z-axis) and content (X/Y-axis).
   * Uses smart mapping to ensure directional controls match screen orientation.
   */
  const rotate = (direction: ControlAction) => {
    // Handle Z-rotation (View Rotation)
    if (direction === 'cw') {
      rotateZ.value += ROTATION_STEP;
      return;
    }
    if (direction === 'ccw') {
      rotateZ.value -= ROTATION_STEP;
      return;
    }

    // Handle Directional Navigation (View-Relative)
    // Calculate current Z-phase (0-3) to determine orientation
    const normalizedZ = Math.round(rotateZ.value / ROTATION_STEP);
    // Ensure positive modulo result
    const phase = ((normalizedZ % PHASE_COUNT) + PHASE_COUNT) % PHASE_COUNT;

    // We cast `direction` to `Direction` because we already handled 'cw'/'ccw' above
    const action = DIRECTION_MAPPINGS[phase][direction as Direction];

    if (action.axis === 'x') {
      rotateX.value += action.val;
    } else {
      rotateY.value += action.val;
    }
  };

  /**
   * Helper to safely get slide content for a face index (0-5)
   * If not enough slides, wraps around or returns placeholder
   */
  const getSlide = (index: number) => {
    if (props.slides.length === 0) return { title: 'Empty', text: 'No slides provided' };
    return props.slides[index % props.slides.length];
  };
</script>

<style scoped>
  .scene-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    /* Default cube size */
    --cube-size: 600px;
  }

  .scene {
    --cube-size: 600px; /* Default cube size */
    width: var(--cube-size);
    height: var(--cube-size);
    perspective: 1200px;
  }

  .cube-rotator {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s ease-in-out;
  }

  .cube {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s ease-in-out;
    /* Initial state, overridden by style binding, but good for reference
       translateZ should be half of --cube-size
    */
  }

  .cube-face {
    position: absolute;
    width: var(--cube-size);
    height: var(--cube-size);
    padding: 2rem;
    box-sizing: border-box;

    /* Glass Style from before, but adapted for square faces */
    background: linear-gradient(135deg, rgba(0, 100, 150, 0.4) 0%, rgba(0, 20, 40, 0.6) 100%);
    border: 4px solid #aefeff;
    box-shadow: 0 0 10px rgba(174, 254, 255, 0.5), inset 0 0 20px rgba(0, 200, 255, 0.2);
    backdrop-filter: blur(6px); /* Might be heavy for 3D opacity, but let's try */

    /* Ensure backface visibility so we can see inside the cube or through it */
    backface-visibility: visible;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 3D Transforms for faces using CSS var for depth */
  .face-front {
    transform: rotateY(0deg) translateZ(calc(var(--cube-size) / 2));
  }
  .face-right {
    transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2));
  }
  .face-back {
    transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2));
  }
  .face-left {
    transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2));
  }
  .face-top {
    transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2));
  }
  .face-bottom {
    transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2));
  }

  /* Content Styling */
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #cbfeff;
    font-family: 'Press Start 2P', cursive, monospace;
    text-shadow: 2px 2px 0px #005f63;
  }

  .carousel-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .title {
    font-size: 1.8rem;
    margin: 0;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .carousel-body {
    flex: 1;
    display: block; /* Changed from flex to block to support float */
    overflow-y: auto;
  }

  .description {
    font-weight: bold;
    font-size: 0.9rem;
    line-height: 1.8;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
    margin: 0;
  }

  .icon-container {
    float: right; /* Wrap text around */
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    shape-outside: margin-box; /* Helps text flow nicely */
    display: block; /* Ensure it behaves as block for float */
  }

  .slide-icon {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(0 0 5px rgba(110, 220, 217, 0.5));
    image-rendering: pixelated; /* Keep retro look for pixel art */
  }

  /* D-Pad Controls */
  .d-pad {
    position: fixed;
    bottom: 30px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    z-index: 100; /* Ensure on top */
  }

  .directional-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .middle-row {
    display: flex;
    gap: 40px; /* Space for the center */
  }

  .rotator-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  /* Responsive downsizing */
  @media (max-width: 768px) {
    .scene-container {
      --cube-size: 300px;
    }

    /* Adjust font sizes for smaller cube */
    .title {
      font-size: 1.2rem;
    }
    .description {
      font-size: 0.8rem;
    }
    .icon-placeholder {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }

    .d-pad {
      bottom: 20px;
      right: 20px;
      transform: scale(0.8);
      transform-origin: bottom right;
    }
  }
</style>
