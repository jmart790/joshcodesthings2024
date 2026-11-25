<template>
  <div class="personal-projects-page" @wheel="handleWheel">
    <div class="back-button">
      <RetroButton @click="$router.push('/stage-select')">&lt; Back</RetroButton>
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
    top: var(--page-gutter);
    left: var(--page-gutter);
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
    padding-top: calc(48px + var(--page-gutter)); /* clear the back button (80px on desktop) */
    position: relative; /* Context for absolute wheel */
    z-index: 10; /* Ensure content is above background */
  }

  /* Portrait (tablet + phone): card on top at full width, cog turned 90deg and
     peeking up from the bottom edge (cog geometry lives in ProjectWheel.vue).
     The query must match PORTRAIT in ProjectWheel.vue, which flips the drag axis. */
  @media (orientation: portrait) {
    .personal-projects-page {
      /* visible cog strip height; mirror of ProjectWheel's scale/drop math */
      --cog-peek: calc(550px * var(--cog-scale) - var(--cog-drop));
      --cog-scale: 0.8;
      /* center this far below the screen: hub (r 186 * scale = 149) stays hidden,
         selected label (r 318 * scale = 254) sits 30px above the bottom edge */
      --cog-drop: 224px;
    }

    .content-container {
      display: block;
    }

    .details-column {
      /* full width between 2rem gutters, matching .back-button's left: 2rem */
      --industrial-card-w: 100%;
      --industrial-card-h: min(780px, 100%);

      height: calc(100% - var(--cog-peek));
      padding: 1.5rem var(--page-gutter) 1rem; /* top: breathing room under the back button */
      align-items: center;
    }
  }
</style>
