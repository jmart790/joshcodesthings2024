<template>
  <div class="personal-projects-page" @wheel="handleWheel">
    <div class="back-button">
      <RetroButton @click="$router.back()">< Home</RetroButton>
    </div>

    <div class="content-container">
      <!-- Left Column: Details -->
      <section class="details-column">
        <IndustrialDialog :isOpen="isDialogOpen" :project="activeProject" />
      </section>

      <!-- Right Column: Navigation Wheel -->
      <ProjectWheel :projects="doubledProjects" :active-index="activeIndex" @select="selectProject" />
    </div>

    <!-- Vignette Overlay -->
    <div class="vignette-overlay"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import IndustrialDialog from '../components/personal-projects/IndustrialDialog.vue';
  import ProjectWheel from '../components/personal-projects/ProjectWheel.vue';
  import { projects as rawProjects } from '../data/projects';

  const doubledProjects = [...rawProjects, ...rawProjects].map((p, i) => ({ ...p, uniqueId: i }));

  const activeIndex = ref(0);
  const isDialogOpen = ref(true);

  const activeProject = computed(() => doubledProjects[activeIndex.value]);

  watch(
    () => activeProject.value,
    () => {
      isDialogOpen.value = false;
      setTimeout(() => {
        isDialogOpen.value = true;
      }, 100);
    }
  );

  function selectProject(index: number) {
    activeIndex.value = index;
  }

  // Wheel Interaction
  let isThrottled = false;
  function handleWheel(event: WheelEvent) {
    if (isThrottled) return;

    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, 100); // 100ms throttle for responsiveness but stability

    if (event.deltaY > 0) {
      prevProject();
    } else {
      nextProject();
    }
  }

  function nextProject() {
    activeIndex.value = (activeIndex.value + 1) % doubledProjects.length;
  }

  function prevProject() {
    activeIndex.value = (activeIndex.value - 1 + doubledProjects.length) % doubledProjects.length;
  }
</script>

<style scoped>
  .personal-projects-page {
    width: 100vw;
    height: 100vh;
    background-color: #0b0b0b; /* Dark bg */
    color: white;
    overflow: hidden;
    position: relative;
    font-family: 'Arial', sans-serif;
    background-image: url('/constructionman_bg.png');
    background-size: cover;
    background-position: center;
  }

  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 20;
  }

  .details-column {
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
    height: 100%;
  }

  .vignette-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2; /* Content is 10, Bg is 1 */
    pointer-events: none;
    background: radial-gradient(circle at center, transparent 30%, #000000e0 100%);
  }

  .content-container {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Left takes space, Right is fixed width wheel */
    gap: 2rem;
    height: 100%;
    padding-top: 80px; /* Clear header space */
    position: relative; /* Context for absolute wheel */
    z-index: 10; /* Ensure content is above background */
  }
</style>
