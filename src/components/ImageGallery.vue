<template>
  <section ref="galleryRoot" class="image-gallery">
    <div class="sticky-wrapper">
      <div class="wrap">
        <figure class="girl"></figure>

        <div class="container">
          <div class="wrapper">
            <ul class="list">
              <li v-for="(image, index) in images" :key="image.name" class="item" :style="getItemStyle(index)">
                <ImageArt
                  :src="image.img"
                  :alt="image.name"
                  :name="image.name"
                  :desc="image.desc"
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
  import { onMounted, onUnmounted, ref } from 'vue';
  import ImageArt from './ImageArt.vue';

  const images = [
    {
      img: '/tmnt__leo.webp',
      name: 'Leonardo',
      desc: 'Water Hashira'
    },
    {
      img: '/tmnt__don.webp',
      name: 'Donatello',
      desc: 'Mist Hashira'
    },
    {
      img: '/tmnt__mikey.webp',
      name: 'Michelangelo',
      desc: 'Thunder Hashira'
    },
    {
      img: '/tmnt__raph.webp',
      name: 'Raphael',
      desc: 'Flame Hashira'
    },
    {
      img: '/tmnt__april.webp',
      name: "April O'Neil",
      desc: 'Love Hashira'
    },
    {
      img: '/tmnt__casey.webp',
      name: 'Casey Jones',
      desc: 'Beast Hashira'
    },
    {
      img: '/tmnt__miyamoto.webp',
      name: 'Miyamoto Usagi',
      desc: 'Wind Hashira'
    },
    {
      img: '/tmnt__splinter.webp',
      name: 'Master Splinter',
      desc: 'Stone Hashira'
    },
    {
      img: '/tmnt__slash.webp',
      name: 'Slash',
      desc: 'Upper Demon 6'
    },
    {
      img: '/tmnt__leatherhead.webp',
      name: 'Leatherhead',
      desc: 'Upper Demon 5'
    },
    {
      img: './tmnt__baxter.webp',
      name: 'Baxter Stockman',
      desc: 'Upper Demon 4'
    },
    {
      img: './tmnt__rocksteady.webp',
      name: 'Rocksteady',
      desc: 'Upper Demon 3'
    },
    {
      img: './tmnt__krang.webp',
      name: 'Krang',
      desc: 'Upper Demon 2'
    },
    {
      img: '/tmnt__karai.webp',
      name: 'Karai',
      desc: 'Upper Demon 1'
    },
    {
      img: '/tmnt__shredder.webp',
      name: 'Shredder',
      desc: 'Demon King'
    }
  ];

  // Configuration
  const config = {
    initialZPosition: 10000, // Start right in front (fully visible)
    imageZSpacing: 8000, // Positive spacing puts subsequent images "behind" in queue
    maxVisibleZ: 6000,
    minVisibleZ: -20000,
    fullVisibilityThreshold: 3000,
    fadeInRange: 3000,
    fadeOutRange: 25000,
    baseYSpacing: 0,
    yOffsetMultiplier: 0,
    minScale: 0.4,
    scaleReduction: 0.03
  };

  const galleryRoot = ref(null);
  const scrollProgress = ref(0); // 0 to 1

  function calculateTotalZ(index) {
    const startZ = config.initialZPosition;

    // Adjusted total travel distance for the new queue length
    const zScrollTotal = -130000;
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
      'z-index': images.length - index
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
    transform: translateX(-50%) rotateX(358deg) rotateY(354deg) translateZ(220px);
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
