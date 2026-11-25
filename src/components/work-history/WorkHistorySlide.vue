<template>
  <article class="slide" :class="{ cutscene }">
    <!-- Desktop: both speakers' boxes, angled toward each other -->
    <template v-if="!cutscene">
      <div class="dialog-container">
        <DialogCard is-open name="Yosh" :desc="yoshText" size="sm" is-name-blue />
      </div>
      <div class="dialog-container">
        <DialogCard :is-open="historyManOpen" name="History Man" :desc="historyManText" size="sm" />
      </div>
    </template>
    <!-- Tablet and below: a Mega Man X style cutscene box, one speaker at a time
         (keyed so the typewriter restarts for each line) -->
    <div v-else class="cutscene-box">
      <DialogCard
        :key="speaker"
        is-open
        :name="speaker === 'yosh' ? 'Yosh' : 'History Man'"
        :desc="speaker === 'yosh' ? yoshText : historyManText"
        size="sm"
        :is-name-blue="speaker === 'yosh'"
      />
    </div>
    <picture
      class="slide-image left"
      :class="[`left-${index}`, { speaking: cutscene && speaker === 'yosh', listening: cutscene && speaker !== 'yosh' }]"
    >
      <img :src="yoshImage" alt="Yosh Slide Image" />
    </picture>

    <picture
      class="slide-image right"
      :class="[
        `right-${index}`,
        { speaking: cutscene && speaker === 'history', listening: cutscene && speaker !== 'history' }
      ]"
    >
      <img :src="historyManImage" alt="HistoryMan Slide Image" />
    </picture>
  </article>
</template>

<script setup lang="ts">
  import DialogCard from '../shared/DialogCard.vue';

  defineProps<{
    index: number;
    yoshImage: string;
    historyManImage: string;
    yoshText: string;
    historyManText: string;
    historyManOpen: boolean;
    /** tablet and below: one cutscene box instead of two side-by-side boxes */
    cutscene?: boolean;
    speaker?: 'yosh' | 'history';
  }>();
</script>

<style scoped>
  .slide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: flex-end;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    position: relative;
  }

  .slide-image {
    display: flex;
    animation: fadeInFromLeft ease-in;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 11;
  }

  .slide-image.right {
    animation: fadeInFromRight ease-in;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
  }

  @keyframes fadeInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  @keyframes fadeInFromRight {
    from {
      opacity: 0;
      transform: translateX(25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  .slide-image img {
    position: absolute;
    bottom: 9%;
    width: auto;
    height: 50%;
    z-index: 1000;
  }

  .slide-image.left img {
    height: 50%;
  }
  .slide-image.right img {
    height: 55%;
    bottom: 7%;
    right: 25%;
  }

  .slide-image.left-0 img {
    left: 25%;
    transform: scaleX(-1);
  }
  .slide-image.left-1 img {
    bottom: 10%;
    left: 50%;
  }

  .slide-image.left-2 img {
    bottom: 7%;
    left: 30%;
    transform: scaleX(-1);
  }

  .slide-image.left-3 img {
    bottom: 7%;
    left: 10%;
  }

  .slide-image.left-4 img {
    bottom: 25%;
    left: 30%;
  }
  .slide-image.left-5 img {
    left: 50%;
  }
  .slide-image.left-6 img {
    left: 40%;
    bottom: 25%;
    transform: rotate(-15deg) scale(1.1);
  }
  .slide-image.right-1 img {
    right: 45%;
  }

  .slide-image.right-5 img {
    right: 40%;
  }
  .slide-image.right-6 img {
    right: 15%;
    bottom: 10%;
    transform: scale(0.9);
  }
  .dialog-container {
    position: absolute;
    top: 10%;
    left: 2%;
    transform: perspective(1000px) rotateY(23deg) rotateX(348deg);
  }
  .dialog-container:last-of-type {
    top: 10%;
    left: unset;
    right: 2%;
    transform: perspective(1000px) rotateY(-23deg) rotateX(348deg);
    z-index: 10;
  }

  /* --- Cutscene (tablet and below; work-history.vue decides via matchMedia) ---
     One full-width box across the top; the characters stand side by side at
     the bottom, the speaker lit and leaning in, the other dimmed; the page's
     buttons sit under them. */
  .slide.cutscene {
    /* minmax(0, ...) so wide action poses can't stretch the page past the screen */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    grid-template-areas:
      'box box'
      'left right';
    align-items: end;
    column-gap: 0;
    /* clear the Back / Prev / Next row at the bottom of the page */
    padding: var(--page-gutter) var(--page-gutter) calc(var(--page-gutter) + 3.5rem);
    box-sizing: border-box;
  }

  .cutscene .slide-image {
    height: auto;
    transition:
      filter 0.3s ease,
      translate 0.3s ease;
  }

  .cutscene .slide-image.left {
    grid-area: left;
    justify-content: flex-end;
  }

  .cutscene .slide-image.right {
    grid-area: right;
    justify-content: flex-start;
  }

  /* drop desktop's per-slide absolute placement; keep each pose's flip/tilt */
  .cutscene .slide-image img,
  .cutscene .slide-image.left img,
  .cutscene .slide-image.right img {
    position: static;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: min(38vh, 420px);
  }

  /* Slides 5 and 7: Yosh is mid-air, so he floats just under the box. Measured
     up from the bottom like everyone else (not down from the box, which grows
     as it opens): row bottom (100vh - gutter - 3.5rem) minus the box's final
     bottom (gutter + 32vh + 1rem gap) minus his height (38vh). */
  .cutscene .slide-image.left-4,
  .cutscene .slide-image.left-6 {
    margin-bottom: max(0px, 30vh - 2 * var(--page-gutter) - 4.5rem);
  }

  .cutscene .slide-image.speaking {
    translate: 0 -8px;
  }

  .cutscene .slide-image.listening {
    filter: brightness(0.45) saturate(0.6);
  }

  .cutscene-box {
    grid-area: box;
    align-self: start;
    width: 100%;
    margin-bottom: 1rem;
  }

  /* beats DialogCard's .size-sm caps (650px wide, 350px tall) */
  .cutscene-box :deep(.dialog-card.size-sm) {
    /* full width; a cap, since DialogCard's expand animation sizes it to 1000px */
    max-width: 100%;
    width: 100%;
    max-height: 32vh;
  }
</style>
