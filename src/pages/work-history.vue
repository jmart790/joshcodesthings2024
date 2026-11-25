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
        />
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
  import { yoshImages, historyManImages, yoshDialogue, historyManDialogue } from '../data/workHistoryData';

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
</style>
