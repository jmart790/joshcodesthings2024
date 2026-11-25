<template>
  <section ref="galleryRoot" class="image-gallery">
    <div class="sticky-wrapper">
      <div class="wrap">
        <figure class="girl"></figure>

        <!-- Dims the hallway and lights the piece at viewing distance (spotStyle). -->
        <div class="spotlight" :style="spotStyle" aria-hidden="true"></div>

        <div class="container">
          <div class="wrapper">
            <ul class="list">
              <li
                v-for="(item, index) in flatItems"
                :key="index"
                :ref="(el) => (itemEls[index] = el)"
                class="item"
                :class="{ 'item--art': item.type === 'image' }"
                :style="getItemStyle(index)"
                @click="item.type === 'image' && openViewer(index)"
              >
                <GalleryTitleCard v-if="item.type === 'title'" :theme-one="item.themeOne" :theme-two="item.themeTwo" />
                <GalleryTitleCard v-else-if="item.type === 'exit'">
                  <span class="exit-title">Thanks for visiting</span>
                  <RetroButton @click.stop="backToTop">Back to top</RetroButton>
                  <RetroButton @click.stop="$router.push('/stage-select')">Stage select</RetroButton>
                </GalleryTitleCard>
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

        <!-- Vertical scrubber above the standing girl, synced to the gallery's
             scroll: shows where you are; drag it, tap the track, or step with
             the arrows to move. Tapping a piece opens the viewer. -->
        <nav class="gallery-bar" aria-label="Gallery navigation">
          <RetroButton
            class="gallery-bar__step"
            small
            :disabled="currentIndex === 0"
            aria-label="Previous piece"
            @click="stepTo(-1)"
          >
            &lt;
          </RetroButton>
          <div class="gallery-bar__track">
            <!-- life-gauge cells: full below the tracker, drained above it -->
            <div class="gallery-bar__gauge" :style="{ '--progress': scrollProgress }"></div>
            <!-- a horizontal range turned 90deg: native vertical sliders aren't reliable everywhere -->
            <div class="gallery-bar__rail">
              <!-- marks only: tapping the track jumps the thumb (and scroll) there -->
              <template v-for="(item, index) in flatItems" :key="index">
                <span
                  v-if="item.type !== 'title'"
                  class="gallery-bar__tick"
                  :class="[`gallery-bar__tick--${item.type}`, { 'is-current': index === currentIndex }]"
                  :style="{ left: `calc(${viewProgress(index)} * (100% - var(--thumb)))` }"
                ></span>
              </template>
              <input
                class="gallery-bar__range"
                type="range"
                min="0"
                max="1000"
                :value="Math.round(scrollProgress * 1000)"
                aria-label="Gallery position"
                :aria-valuetext="currentLabel"
                @input="scrollToProgress($event.target.value / 1000, 'instant')"
              />
            </div>
          </div>
          <RetroButton
            class="gallery-bar__step"
            small
            :disabled="currentIndex === flatItems.length - 1"
            aria-label="Next piece"
            @click="stepTo(1)"
          >
            &gt;
          </RetroButton>
        </nav>
      </div>
    </div>

    <GalleryViewer ref="viewer" :pieces="pieces" @close="onViewerClose" />
  </section>
</template>

<script setup>
  import { onMounted, onUnmounted, ref, computed } from 'vue';
  import ImageArt from './ImageArt.vue';
  import GalleryTitleCard from './GalleryTitleCard.vue';
  import GalleryViewer from './GalleryViewer.vue';
  import RetroButton from '../shared/RetroButton.vue';
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
    // Exit card: the scroll ends with it resting at viewing distance.
    items.push({ type: 'exit' });
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

  // Depth where a piece is "being viewed": just past where its label appears
  // (getIsInfoVisible), and where the last item rests when the scroll ends.
  const VIEW_Z = -2000;

  const galleryRoot = ref(null);
  const scrollProgress = ref(0); // 0 to 1

  const baseZ = (index) => config.initialZPosition + index * config.imageZSpacing;
  // Z travelled over the whole scroll: brings the last item to VIEW_Z.
  const zTravel = computed(() => baseZ(flatItems.value.length - 1) - VIEW_Z);

  function calculateTotalZ(index) {
    return baseZ(index) - scrollProgress.value * zTravel.value;
  }

  // scroll progress (0-1) at which an item sits at VIEW_Z
  function viewProgress(index) {
    return Math.min(1, Math.max(0, (baseZ(index) - VIEW_Z) / zTravel.value));
  }

  // the item nearest viewing distance
  const currentIndex = computed(() => {
    let best = 0;
    flatItems.value.forEach((_, i) => {
      if (Math.abs(viewProgress(i) - scrollProgress.value) < Math.abs(viewProgress(best) - scrollProgress.value)) {
        best = i;
      }
    });
    return best;
  });

  const pieces = computed(() => flatItems.value.filter((item) => item.type === 'image'));
  // position among the pieces (title/exit excluded), for the viewer and labels
  const pieceNumber = (index) => flatItems.value.slice(0, index).filter((item) => item.type === 'image').length;

  function itemLabel(index) {
    const item = flatItems.value[index];
    if (item.type === 'title') return `${item.themeOne} x ${item.themeTwo}`;
    if (item.type === 'exit') return 'Exit';
    return `${item.name} · ${pieceNumber(index) + 1}/${pieces.value.length}`;
  }

  const currentLabel = computed(() => itemLabel(currentIndex.value));

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
      // invisible items (faded, or not yet arrived) must not catch taps meant for the one on view
      'pointer-events': opacity > 0.05 ? 'auto' : 'none',
      'z-index': flatItems.value.length - index
    };
  }

  // --- Scrolling to a position (control bar, exit card, viewer close) ---
  function scrollToProgress(progress, behavior = 'smooth') {
    const el = galleryRoot.value;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + progress * (el.offsetHeight - window.innerHeight), behavior });
  }

  const scrollToItem = (index) => scrollToProgress(viewProgress(index));

  // the page top (plaza), not the gallery's start
  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  function stepTo(dir) {
    const next = Math.min(flatItems.value.length - 1, Math.max(0, currentIndex.value + dir));
    scrollToItem(next);
  }

  // --- Viewer ---
  const viewer = ref(null);

  function openViewer(index) {
    viewer.value?.open(pieceNumber(index));
  }

  // land the hallway on the last piece viewed
  function onViewerClose(pieceIndex) {
    const index = flatItems.value.indexOf(pieces.value[pieceIndex]);
    scrollToProgress(viewProgress(index), 'instant');
  }

  // --- Spotlight: follows the current piece's on-screen box ---
  const itemEls = [];
  const spot = ref({ x: 0, y: 0, r: 0, strength: 0 });

  const spotStyle = computed(() => ({
    '--spot-x': `${spot.value.x}px`,
    '--spot-y': `${spot.value.y}px`,
    '--spot-r': `${spot.value.r}px`,
    opacity: spot.value.strength
  }));

  function updateSpot() {
    const index = currentIndex.value;
    const el = itemEls[index];
    if (!el || flatItems.value[index].type !== 'image') {
      spot.value = { ...spot.value, strength: 0 };
      return;
    }
    const box = el.getBoundingClientRect();
    // full strength at viewing distance, gone halfway to the next piece
    const off = Math.abs(calculateTotalZ(index) - VIEW_Z);
    spot.value = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
      r: Math.max(box.width, box.height) / 2,
      strength: Math.max(0, 1 - off / (config.imageZSpacing / 2))
    };
  }

  function handleScroll() {
    if (!galleryRoot.value) return;

    const rect = galleryRoot.value.getBoundingClientRect();
    // The sticky wrapper pins at top; the scrollable distance is elementHeight - windowHeight.
    const progress = -rect.top / (rect.height - window.innerHeight);
    scrollProgress.value = Math.min(1, Math.max(0, progress));

    // items ease their transform over 0.1s, so measure again once they settle
    requestAnimationFrame(updateSpot);
    clearTimeout(spotTimer);
    spotTimer = setTimeout(updateSpot, 150);
  }
  let spotTimer;

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calc
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(spotTimer);
  });
</script>

<style scoped>
  .image-gallery {
    --girl-width: 450px;
    --girl-height: 600px;
    --girl-top: 30%; /* the control bar ends just above her */
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
    top: var(--girl-top);
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

  /* In 3D, these flat layers sit at depth 0, in front of the receding art, and
     would swallow every tap. Only the items (pointer-events set inline by
     visibility) take clicks. */
  .container,
  .wrapper,
  .list {
    pointer-events: none;
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
    transition:
      transform 0.1s linear,
      opacity 0.1s linear; /* Fast transition for scroll sync */
  }

  .item--art {
    cursor: zoom-in;
  }

  /* Exit card content (slotted into GalleryTitleCard, which is the size container) */
  .exit-title {
    font-size: min(3rem, 8cqi);
    color: #ff0055;
    filter: drop-shadow(3px 3px 0 black);
  }

  /* Dims the hallway around the piece on view and casts a warm light on it.
     Sits under the art (.container paints later) and over the hallway/girl. */
  .spotlight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
    background: radial-gradient(
      circle at var(--spot-x) var(--spot-y),
      rgba(255, 236, 210, 0.16) 0,
      rgba(255, 236, 210, 0.05) calc(var(--spot-r) * 0.9),
      rgba(0, 0, 0, 0.45) calc(var(--spot-r) * 1.6),
      rgba(0, 0, 0, 0.6)
    );
  }

  /* --- Control bar: a Mega Man X style life gauge on the left, from under the
     back button down to just above the standing girl (--girl-top). Arrows sit
     in the caps; the cells drain from the top as you walk the hallway, and the
     pink pointer is the draggable tracker. --- */
  .gallery-bar {
    --thumb: 6px; /* tracker thickness along the gauge */
    --cell: #f8d870;

    position: absolute;
    left: var(--page-gutter);
    top: calc(var(--page-gutter) + 4rem);
    /* her image has ~15% empty space above her head; stop 1rem above the head */
    bottom: calc(100% - var(--girl-top) - var(--girl-height) * 0.15 + 1rem);
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px 4px;
    /* casing: black outline, steel-blue rim, dark well */
    background: #1b1b2f;
    border: 2px solid #000;
    border-radius: 8px 8px 3px 3px;
    box-shadow:
      inset 0 0 0 2px #8fa0c0,
      inset 0 0 0 4px #2c3350,
      2px 2px 0 #000;
  }

  /* < and > turned to point up and down (the whole button: its gradient text
     doesn't paint onto a separately rotated child) */
  .gallery-bar__step {
    rotate: 90deg;
  }

  .gallery-bar__track {
    position: relative;
    flex: 1;
    width: 28px;
    container-type: size;
  }

  /* Cells: 4px bars on a 6px pitch, anchored to the bottom so the empty and
     full layers line up. Full cells fill from the tracker down. */
  .gallery-bar__gauge {
    position: absolute;
    inset: 0 6px;
    border: 2px solid #000;
    background: repeating-linear-gradient(to top, #3a3a52 0 4px, #000 4px 6px) bottom / 100% 6px;
  }

  .gallery-bar__gauge::after {
    content: '';
    position: absolute;
    inset: 0;
    top: calc(var(--thumb) / 2 + var(--progress) * (100% - var(--thumb)));
    background: repeating-linear-gradient(
        to top,
        #b08a30 0 1px,
        var(--cell) 1px 3px,
        #fff2b0 3px 4px,
        #000 4px 6px
      )
      bottom / 100% 6px;
  }

  /* lies along the track's height: rotated 90deg about its top-left corner,
     then shifted right by its own thickness so it lands inside the track */
  .gallery-bar__rail {
    position: absolute;
    top: 0;
    left: 28px;
    width: 100cqh;
    height: 28px;
    transform-origin: top left;
    rotate: 90deg;
  }

  .gallery-bar__range {
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background: transparent;
    cursor: pointer;
  }

  /* invisible track: the gauge cells are the visual */
  .gallery-bar__range::-webkit-slider-runnable-track {
    height: 100%;
    background: transparent;
  }
  .gallery-bar__range::-moz-range-track {
    height: 100%;
    background: transparent;
  }

  /* tracker: a pink pointer across the full gauge width */
  .gallery-bar__range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--thumb);
    height: 100%;
    background: #ff0055;
    border: 1px solid #000;
    border-radius: 0;
    box-shadow: 0 0 6px rgba(255, 0, 85, 0.8);
  }
  .gallery-bar__range::-moz-range-thumb {
    width: var(--thumb);
    height: 100%;
    background: #ff0055;
    border: 1px solid #000;
    border-radius: 0;
    box-shadow: 0 0 6px rgba(255, 0, 85, 0.8);
  }

  .gallery-bar__range:focus-visible {
    outline: 2px solid #ffcc00;
    outline-offset: 2px;
  }

  /* One notch per piece on the casing beside the cells (the rail's top edge
     is the track's right side after the turn); `left` is set inline. */
  .gallery-bar__tick {
    position: absolute;
    top: 0;
    z-index: 1;
    margin-left: calc(var(--thumb) / 2);
    pointer-events: none;
  }

  .gallery-bar__tick::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 0;
    width: 2px;
    height: 5px;
    background: #8fa0c0;
  }

  .gallery-bar__tick--exit::before {
    background: #fff;
  }

  .gallery-bar__tick.is-current::before {
    background: #ff0055;
  }

  /* Portrait: the background is cropped around its center (art-gallery.vue),
     which puts the hallway's vanishing point right of center. Aim the
     perspective there so receding art travels down the hallway; the standing
     girl shrinks into the bottom-left corner so she doesn't cover the art. */
  @media (orientation: portrait) {
    .container {
      /* vanishing point in the 210vh-tall crop: 15vh right of center, 57% down */
      perspective-origin: calc(50% + 15vh) 57%;
    }

    .image-gallery {
      --girl-width: 225px;
      --girl-height: 300px;
      --girl-top: 50%;
    }

    .girl {
      margin-left: var(--page-gutter);
    }

    /* no rotateY: the perspective-origin above does the aiming */
    /* nudged toward the vanishing point so receding art lines up with the
       hallway's end wall, while close-up art still fits the screen */
    .wrapper {
      width: 85%;
      top: 0;
      left: calc(50% + 8vh);
      transform: translateX(-50%) rotateX(359deg) translateZ(226px);
    }

    /* Bottom-anchor each piece near the screen's bottom edge so, as it recedes
       toward the vanishing point, it rides the floor instead of floating. */
    .item {
      bottom: 4vh;
    }
  }
</style>
