<template>
  <div class="work-history-page">
    <section class="slider">
      <template v-for="(yoshImage, index) in yoshImages" :key="`slide-${index}`">
        <WorkHistorySlide
          v-if="index === activeIndex"
          :index="index"
          :yosh-image="yoshImage"
          :history-man-image="historyManImages[index]"
          :yosh-text="yoshDialogue[index]"
          :history-man-text="historyManDialogue[index]"
          :history-man-open="historyManDialogOpen"
          :cutscene="cutscene"
          :speaker="speaker"
        >
          <nav class="slide-dots" aria-label="Slides">
            <button
              v-for="(_, i) in yoshImages"
              :key="i"
              class="slide-dot"
              :class="{ active: i === activeIndex, 'yosh-line': speaker === 'yosh' }"
              :aria-label="markerLabel(i)"
              :aria-current="i === activeIndex ? 'step' : undefined"
              @click="goTo(i)"
            >
              <span class="monitor"><span class="screen">{{ markerYear(i) }}</span></span>
            </button>
          </nav>
        </WorkHistorySlide>
      </template>
    </section>
    <div class="buttons">
      <RetroButton @click="$router.push('/stage-select')">&lt; Back</RetroButton>
      <RetroButton :disabled="isFirst" @click="prev">Prev</RetroButton>
      <RetroButton :disabled="isLast" @click="next">Next</RetroButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import WorkHistorySlide from '../components/work-history/WorkHistorySlide.vue';
  import {
    yoshImages,
    historyManImages,
    yoshDialogue,
    historyManDialogue,
    workHistoryYears
  } from '../data/workHistoryData';

  const activeIndex = ref(0);
  const historyManDialogOpen = ref(false);

  // Tablet and below play each slide as a cutscene: one speaker at a time, so
  // Next goes Yosh's line -> History Man's line -> next slide (Prev reverses).
  const CUTSCENE_QUERY = '(max-width: 1024px)';
  const cutscene = ref(false);
  const speaker = ref<'yosh' | 'history'>('yosh');
  const lastIndex = yoshImages.length - 1;

  const isFirst = computed(() => activeIndex.value === 0 && (!cutscene.value || speaker.value === 'yosh'));
  const isLast = computed(() => activeIndex.value === lastIndex && (!cutscene.value || speaker.value === 'history'));

  const next = () => {
    if (cutscene.value && speaker.value === 'yosh') {
      speaker.value = 'history';
      return;
    }
    if (activeIndex.value === lastIndex) return;
    activeIndex.value += 1;
    speaker.value = 'yosh';
  };

  const prev = () => {
    if (cutscene.value && speaker.value === 'history') {
      speaker.value = 'yosh';
      return;
    }
    if (activeIndex.value === 0) return;
    activeIndex.value -= 1;
    // land on the previous slide's last line
    speaker.value = cutscene.value ? 'history' : 'yosh';
  };

  // Markers show the year each job ended (two digits; the current job shows
  // this year), so jobs that started the same year still differ. The summary
  // slide shows Josh's initials.
  const markerYear = (i: number) => {
    const years = workHistoryYears[i];
    return years ? String(years.end ?? new Date().getFullYear()).slice(-2) : 'JM';
  };
  const markerLabel = (i: number) => {
    const years = workHistoryYears[i];
    if (!years) return 'Summary';
    const end = years.end ?? 'present';
    return years.start === end ? String(end) : `${years.start} to ${end}`;
  };

  const goTo = (i: number) => {
    activeIndex.value = i;
    speaker.value = 'yosh';
  };

  let media: MediaQueryList;
  const syncCutscene = () => (cutscene.value = media.matches);
  onMounted(() => {
    media = window.matchMedia(CUTSCENE_QUERY);
    syncCutscene();
    media.addEventListener('change', syncCutscene);
  });
  onUnmounted(() => media?.removeEventListener('change', syncCutscene));

  const delayOpen = () => {
    historyManDialogOpen.value = false;
    setTimeout(() => {
      historyManDialogOpen.value = true;
    }, 2000);
  };

  watch(
    () => activeIndex.value,
    () => {
      delayOpen();
    },
    { immediate: true }
  );
</script>

<style scoped>
  .work-history-page {
    background-image: url('/historymanstage.webp');
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    position: relative;
    overflow: hidden;
  }

  .slider {
    position: relative;
    display: grid;
    width: 90%;
    margin-inline: auto;
    height: 100%;
  }

  .buttons {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: var(--page-gutter);
    width: 100%;
    display: flex;
    gap: 1rem;
    z-index: 50;
  }

  .buttons :first-child {
    margin-right: auto;
  }

  /* cutscene mode (see CUTSCENE_QUERY): the slide pads itself to the page gutter */
  @media (max-width: 1024px) {
    .slider {
      width: 100%;
    }
  }

  /* Slide markers under the cutscene box (WorkHistorySlide's slot): tiny
     pixel monitors like History Man's head, black with a gold trim, showing
     the job's year. The current slide's screen is on (green, scanlines,
     blinking cursor) and powers up CRT style when its slide opens; the rest
     are off. */
  .slide-dots {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 4px;
  }

  .slide-dot {
    padding: 8px 4px; /* finger-sized hit area around the small monitor */
    background: none;
    border: 0;
    cursor: pointer;
  }

  .monitor {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 36px;
    height: 26px;
    background: #141414;
    /* beveled gold trim (lit top left, shaded bottom right) with a shadow
       cast inward onto the bezel */
    border: 3px solid;
    border-color: #ffd84d #b88600 #b88600 #ffd84d;
    box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.7);
  }

  /* the year (see markerYear); the current one gets a blinking underscore below */
  .screen {
    position: absolute;
    inset: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0b1f12;
    color: #2a6b37;
    font: 7px/1 'Press Start 2P', monospace;
  }

  @media (hover: hover) {
    .slide-dot:hover .screen {
      background: #1d5e2a;
      color: #7ee68c;
    }
  }

  .slide-dot:focus-visible .screen {
    background: #1d5e2a;
    color: #7ee68c;
  }

  .slide-dot.active .screen {
    background:
      repeating-linear-gradient(transparent 0 1px, rgba(0, 0, 0, 0.2) 1px 2px),
      #2fbf4a;
    color: #0b1f12;
    box-shadow: 0 0 6px #2fbf4a;
    animation: crt-on 0.35s ease-out both;
  }

  /* blinking underscore under a digit (two 7px glyphs centered, so the
     last one starts at the middle) */
  .slide-dot.active .screen::after {
    content: '';
    position: absolute;
    left: 50%;
    top: calc(50% + 4px);
    width: 6px;
    height: 2px;
    background: currentColor;
    animation: cursor-blink 1s step-end infinite;
  }

  /* Yosh's line: under the first digit; History Man's: the last */
  .slide-dot.active.yosh-line .screen::after {
    left: calc(50% - 7px);
  }

  @keyframes crt-on {
    0% {
      transform: scale(1, 0.1);
      filter: brightness(3);
    }
    60% {
      transform: scale(1, 1);
      filter: brightness(1.6);
    }
    100% {
      transform: none;
      filter: none;
    }
  }

  @keyframes cursor-blink {
    50% {
      opacity: 0;
    }
  }

  /* Phones: Back at the top left like the other pages (the slide's box starts
     under it, see WorkHistorySlide.vue); Prev / Next stay bottom right */
  /* stage select's spacing (mirrors --breakpoint-tablet) */
  @media (max-width: 720px) {
    .buttons {
      gap: 0.5rem;
    }
  }

  @media (max-width: 767px) {
    .buttons {
      justify-content: flex-end;
    }

    .buttons :first-child {
      position: fixed;
      top: var(--page-gutter);
      left: var(--page-gutter);
    }
  }
</style>
