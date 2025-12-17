<template>
  <section ref="galleryRoot" class="image-gallery">
    <div class="sticky-wrapper">
      <div class="wrap">
        <figure class="girl"></figure>

        <div class="container">
          <div class="wrapper">
            <ul class="list">
              <li v-for="(item, index) in flatItems" :key="index" class="item" :style="getItemStyle(index)">
                <GalleryTitleCard v-if="item.type === 'title'" :theme-one="item.themeOne" :theme-two="item.themeTwo" />
                <ImageArt
                  v-else
                  :src="item.img"
                  :alt="item.name"
                  :name="item.name"
                  :desc="item.desc"
                  :show-info="getIsInfoVisible(index)"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { onMounted, onUnmounted, ref, computed } from 'vue';
  import ImageArt from './ImageArt.vue';
  import GalleryTitleCard from './GalleryTitleCard.vue';
  import { galleryImages } from '../../constants/galleryImages';

  const flatItems = computed(() => {
    const items = [];
    galleryImages.forEach((theme) => {
      items.push({
        type: 'title',
        themeOne: theme.themeOne,
        themeTwo: theme.themeTwo
      });
      theme.images.forEach((img) => {
        items.push({
          type: 'image',
          ...img
        });
      });
    });
    return items;
  });

  // Configuration
  const config = {
    initialZPosition: -3000, // Reduced from 10000 to be visible immediately
    imageZSpacing: 8000, // Positive spacing puts subsequent images "behind" in queue
    maxVisibleZ: 6000,
    minVisibleZ: -20000,
    fullVisibilityThreshold: 3000,
    fadeInRange: 3000,
    fadeOutRange: 45000,
    baseYSpacing: 0,
    yOffsetMultiplier: 0,
    minScale: 0.4,
    scaleReduction: 0 // Disable index-based shrinking
  };

  const galleryRoot = ref(null);
  const scrollProgress = ref(0); // 0 to 1

  function calculateTotalZ(index) {
    const startZ = config.initialZPosition;

    // Calculate total distance needed to bring the last item to the front (Z=0)
    // We add a buffer (e.g. 1 extra spacing) to ensure it clears nicely
    const totalItems = flatItems.value.length;
    const lastItemZ = startZ + (totalItems - 1) * config.imageZSpacing;
    const zScrollTotal = -(lastItemZ + 2000); // 2000px buffer to scroll past the last item

    const zOffset = scrollProgress.value * zScrollTotal;

    const baseZ = startZ + index * config.imageZSpacing;
    return baseZ + zOffset;
  }

  function getIsInfoVisible(index) {
    const totalZ = calculateTotalZ(index);
    // When an image reaches -2346.15px totalZ or less
    return totalZ <= -1238;
  }

  function getItemStyle(index) {
    const totalZ = calculateTotalZ(index);

    let opacity = 0;
    if (totalZ <= config.maxVisibleZ && totalZ >= config.minVisibleZ) {
      if (totalZ > config.fullVisibilityThreshold) {
        opacity = Math.min(1, Math.max(0, 1 - (totalZ - config.fullVisibilityThreshold) / config.fadeInRange));
      } else if (totalZ >= 0) {
        opacity = 1;
      } else if (totalZ >= config.minVisibleZ) {
        opacity = Math.min(1, Math.max(0, 1 - Math.abs(totalZ) / config.fadeOutRange));
      }
    }

    const baseY = index * config.baseYSpacing;
    const yOffset = config.yOffsetMultiplier * (1 - Math.min(1, Math.max(0, totalZ / config.fullVisibilityThreshold)));

    return {
      transform: `translateZ(${totalZ}px) translateY(${baseY + yOffset}px) scale(${Math.max(
        config.minScale,
        1 - index * config.scaleReduction
      )})`,
      opacity: opacity,
      'z-index': flatItems.value.length - index
    };
  }

  function handleScroll() {
    if (!galleryRoot.value) return;

    const rect = galleryRoot.value.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    // Calculate how far we've scrolled into the element
    // When rect.top is 0, we are at the start.
    // When rect.bottom is windowHeight, we are at the end.
    // Actually, we want sticky behavior.
    // The sticky wrapper pins at top.
    // The scrollable distance is elementHeight - windowHeight.

    const scrolled = -rect.top;
    const scrollableDistance = elementHeight - windowHeight;

    let progress = scrolled / scrollableDistance;
    progress = Math.min(1, Math.max(0, progress));

    scrollProgress.value = progress;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calc
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<style scoped>
  .image-gallery {
    --girl-width: 450px;
    --girl-height: 600px;
    width: 100%;
    height: 500vh; /* Make component tall to allow scrolling */
    position: relative;
  }

  .sticky-wrapper {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .wrap {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .girl {
    background: url('/artgirl_standing.webp') center no-repeat;

    background-size: cover;
    margin-left: 2rem;
    width: var(--girl-width);
    height: var(--girl-height);
    bottom: 0%;
    top: 30%;
    position: absolute;
    transform: scaleX(-1);
    filter: drop-shadow(-2px 2px 6px black);
  }

  .container {
    margin: 0;
    padding: 0;
    perspective: 3000px;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .wrapper {
    width: 60%;
    height: 100%;
    transform-style: preserve-3d;
    position: absolute;
    top: -15%;
    left: 35%; /* Moved left from 54% */
    /* transform: translateX(-50%) rotateX(358deg) rotateY(354deg) translateZ(220px); */
    transform: translateX(-50%) rotateX(359deg) rotateY(354deg) translateZ(226px);
  }

  .list {
    transform-style: preserve-3d;
    height: 100%;
    position: relative;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .item {
    position: absolute;
    width: 100%;
    transform-style: preserve-3d;
    transform-origin: center bottom;
    transition: transform 0.1s linear, opacity 0.1s linear; /* Fast transition for scroll sync */
  }
</style>
