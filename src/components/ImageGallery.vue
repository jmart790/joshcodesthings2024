<template>
  <div class="image-gallery">
    <div class="wrap">
      <div class="girl"></div>

      <div class="container">
        <div class="wrapper">
          <div class="list">
            <div v-for="(image, index) in images" :key="image" class="item" :style="getItemStyle(index)">
              <div class="img" :style="`background-image: url(${image});`" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div ref="scrollTrigger" class="scroll-trigger"></div>
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref, computed } from 'vue';

  const images = [
    '/tmnt__april.webp',
    '/tmnt__casey.webp',
    '/tmnt__don.webp',
    '/tmnt__karai.webp',
    '/tmnt__leo.webp',
    '/tmnt__mikey.webp',
    '/tmnt__miyamoto.webp',
    '/tmnt__raph.webp',
    '/tmnt__slash.webp',
    '/tmnt__splinter.webp',
    '/tmnt__shredder.webp'
  ];

  // Configuration variables
  const config = {
    // 3D positioning
    initialZPosition: 15000, // Initial z-position for the first image
    scrollZMultiplier: -1500, // How much scrolling affects z-position
    scrollNormalizationFactor: 100, // Normalizes scroll value
    imageZSpacing: -4500, // Z-axis spacing between images

    // Visibility thresholds
    maxVisibleZ: 6000, // Maximum z-position where images start to appear
    minVisibleZ: -2000, // Minimum z-position where images disappear
    fullVisibilityThreshold: 3000, // Z-position where images are fully visible
    fadeInRange: 3000, // Range over which images fade in
    fadeOutRange: 2000, // Range over which images fade out

    // Positioning and scaling
    baseYSpacing: 25, // Base Y-position spacing per image
    yOffsetMultiplier: 50, // Y-offset multiplier for animation
    minScale: 0.4, // Minimum scale for images
    scaleReduction: 0.03, // Scale reduction per image

    // Scrolling
    scrollSensitivity: 3, // Divisor to control scroll sensitivity
    intersectionThreshold: 0.8 // Threshold for intersection observer
  };

  // Reactive state
  const scrollTrigger = ref(null);
  const isEnabled = ref(false);
  const virtualScroll = ref(0);
  const allowUpscroll = ref(false);

  // Computed property to check if all images are past the viewer
  const allImagesPassed = computed(() => {
    const zOffset = isEnabled.value
      ? config.scrollZMultiplier * (virtualScroll.value / config.scrollNormalizationFactor)
      : 0;
    const firstImageZ = config.initialZPosition + zOffset;

    return firstImageZ < 0;
  });

  // Function to compute styles for each item
  function getItemStyle(index) {
    // Calculate z-position - going back to direct calculations similar to original
    const startZ = config.initialZPosition; // 15000
    const baseZ = startZ + index * config.imageZSpacing; // 15000 - (4500 * index)
    const zOffset = isEnabled.value
      ? config.scrollZMultiplier * (virtualScroll.value / config.scrollNormalizationFactor)
      : 0;
    const totalZ = baseZ + zOffset;

    // Calculate opacity following original logic but with named variables
    let opacity = 0;

    if (totalZ <= config.maxVisibleZ && totalZ >= config.minVisibleZ) {
      if (totalZ > config.fullVisibilityThreshold) {
        // Fade in
        opacity = Math.min(1, Math.max(0, 1 - (totalZ - config.fullVisibilityThreshold) / config.fadeInRange));
      } else if (totalZ >= 0) {
        // Fully visible
        opacity = 1;
      } else if (totalZ >= config.minVisibleZ) {
        // Fade out
        opacity = Math.min(1, Math.max(0, 1 - Math.abs(totalZ) / config.fadeOutRange));
      }
    }

    // Calculate y-position and scale using original approach
    const baseY = index * config.baseYSpacing;
    const yOffset = isEnabled.value
      ? config.yOffsetMultiplier * (1 - Math.min(1, Math.max(0, totalZ / config.fullVisibilityThreshold)))
      : 0;

    // Use original scaling approach first to ensure compatibility
    return {
      transform: `translateZ(${totalZ}px) translateY(${baseY + yOffset}px) scale(${Math.max(
        config.minScale,
        1 - index * config.scaleReduction
      )})`,
      opacity: opacity,
      'z-index': images.length - index
    };
  }

  // Function to handle wheel events
  function handleWheel(e) {
    if (!isEnabled.value) return;

    // Prevent default only when we're handling our virtual scroll
    e.preventDefault();

    // Calculate direction and amount
    const delta = e.deltaY;

    // Block scrolling down if all images have passed
    if (delta > 0 && allImagesPassed.value) {
      return; // Prevent further downscroll
    }

    // Block scrolling up initially
    if (delta < 0 && !allowUpscroll.value) {
      return; // Block upscroll until we've seen all images
    }

    // Update virtual scroll position with configurable sensitivity
    virtualScroll.value += delta / config.scrollSensitivity;

    // Clamp to prevent scrolling too far back
    virtualScroll.value = Math.max(0, virtualScroll.value);

    // Allow upscroll after we've seen all images (even if user scrolls back)
    if (allImagesPassed.value) {
      allowUpscroll.value = true;
    }
  }

  onMounted(() => {
    // Check if we're in the browser environment
    if (process.client) {
      // Create intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            console.log('Scroll trigger is visible, enabling virtual scroll');
            isEnabled.value = true;

            // Add wheel event listener for virtual scrolling
            window.addEventListener('wheel', handleWheel, { passive: false });

            observer.disconnect();
          }
        },
        {
          threshold: config.intersectionThreshold
        }
      );

      if (scrollTrigger.value) {
        observer.observe(scrollTrigger.value);
      }

      // Cleanup will still happen via onUnmounted
    }
  });

  // Separate onUnmounted to ensure it only runs on client
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('wheel', handleWheel, { passive: false });
    }
  });
</script>

<style scoped>
  :root {
    --perspective-depth: 3000px;
    --girl-width: 450px;
    --girl-height: 600px;
    --girl-top: 30%;
    --wrapper-width: 60%;
    --wrapper-top: 20%;
    --wrapper-left: 54%;
  }

  .image-gallery {
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    position: relative;
  }

  .girl {
    background: url('/artgirl_standingproud.webp') center no-repeat;
    background-size: cover;
    margin-left: 2rem;
    width: 450px;
    height: 600px;
    bottom: 0%;
    top: 30%;
    position: absolute;
    filter: drop-shadow(-2px 2px 6px pink);
  }

  h1 {
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
    color: #333;
    font-size: 4em;
    position: sticky;
  }

  .container {
    margin: 0;
    padding: 0;
    perspective: 3000px; /* Using direct value instead of CSS variable */
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .wrapper {
    width: 60%;
    height: 100%;
    transform-style: preserve-3d;
    position: absolute;
    top: 20%;
    left: 54%;
    transform: translateX(-50%) rotateX(358deg) rotateY(354deg) translateZ(220px);
  }

  .list {
    transform-style: preserve-3d;
    overflow: visible;
    height: 100%;
    position: relative;
    width: 100%;
  }

  .item {
    position: absolute;
    width: 100%;
    height: auto;
    transform-style: preserve-3d;
    transform-origin: center bottom;
    transition: opacity 0.3s ease; /* Smooth opacity transitions */
  }

  .img {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.4));
  }


  .scroll-trigger {
    width: 100%;
    height: 20px;
    position: absolute;
    bottom: 20px;
    left: 0;
  }
</style>
