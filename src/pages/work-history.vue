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
        />
      </template>
    </section>
    <div class="buttons">
      <PixelButton @click="$router.back()">&lt; Home</PixelButton>
      <PixelButton :disabled="activeIndex === 0" @click="prev">Prev</PixelButton>
      <PixelButton :disabled="activeIndex === yoshImages.length - 1" @click="next">Next</PixelButton>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import PixelButton from '../components/PixelButton.vue';
  import WorkHistorySlide from '../components/work-history/WorkHistorySlide.vue';
  import { yoshImages, historyManImages, yoshDialogue, historyManDialogue } from '../data/workHistoryData';

  const activeIndex = ref(0);
  const historyManDialogOpen = ref(false);

  const next = () => {
    if (activeIndex.value === yoshImages.length - 1) return;
    activeIndex.value += 1;
  };

  const prev = () => {
    if (activeIndex.value === 0) return;
    activeIndex.value -= 1;
  };

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
    padding: 2rem;
    width: 100%;
    display: flex;
    gap: 1rem;
    z-index: 50;
  }

  .buttons :first-child {
    margin-right: auto;
  }
</style>
