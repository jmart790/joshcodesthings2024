<template>
  <div class="personal-projects-page" @wheel="handleWheel">
    <div class="back-button">
      <RetroButton @click="$router.back()">< Home</RetroButton>
    </div>

    <div class="content-container">
      <!-- Left Column: Details -->
      <ProjectDetails :project="activeProject" />

      <!-- Right Column: Navigation Wheel -->
      <ProjectWheel :projects="projects" :active-index="activeIndex" @select="selectProject" />
    </div>

    <!-- Background (can be ignored or simple gradient for now) -->
    <div class="background-overlay"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import ProjectDetails from '../components/personal-projects/ProjectDetails.vue';
  import ProjectWheel from '../components/personal-projects/ProjectWheel.vue';
  import { projects } from '../data/projects';

  const activeIndex = ref(0);

  const activeProject = computed(() => projects[activeIndex.value]);

  function selectProject(index: number) {
    activeIndex.value = index;
  }

  // Wheel Interaction
  function handleWheel(event: WheelEvent) {
    // Simple throttle or just direct mapping
    if (event.deltaY > 0) {
      nextProject();
    } else {
      prevProject();
    }
  }

  function nextProject() {
    if (activeIndex.value < projects.length - 1) {
      activeIndex.value++;
    }
  }

  function prevProject() {
    if (activeIndex.value > 0) {
      activeIndex.value--;
    }
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
  }

  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 20;
  }

  .content-container {
    display: grid;
    grid-template-columns: 2fr 1fr; /* Left takes space, Right is fixed width wheel */
    height: 100%;
    padding-top: 80px; /* Clear header space */
  }
</style>
