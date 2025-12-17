<template>
  <div class="personal-projects-page" @wheel="handleWheel">
    <div class="back-button">
      <RetroButton @click="$router.back()">< Home</RetroButton>
    </div>

    <div class="content-container">
      <!-- Left Column: Details -->
      <section class="details-column" :key="activeProject.id">
        <h1 class="project-title">{{ activeProject.name }}</h1>
        <div class="meta-info">
          <span class="meta-year">{{ activeProject.year }}</span>
          <span class="meta-count">{{ activeProject.tech }}</span>
        </div>

        <div class="project-screenshot-container">
          <!-- Placeholder for screenshot -->
          <div class="screenshot-placeholder">
            <span>{{ activeProject.name }} Screenshot</span>
          </div>
        </div>

        <p class="project-description">
          {{ activeProject.description }}
        </p>
      </section>

      <!-- Right Column: Navigation Wheel -->
      <section class="wheel-column">
        <div class="wheel-list">
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="wheel-item"
            :class="{ active: index === activeIndex }"
            @click="selectProject(index)"
          >
            <!-- Logo/Title -->
            <span class="wheel-logo" :class="project.logoClass">{{ project.name }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Background (can be ignored or simple gradient for now) -->
    <div class="background-overlay"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';

  // Placeholder Data
  const projects = [
    {
      id: 1,
      name: 'Sony PlayStation', // Placeholder naming from reference
      year: '1994',
      tech: 'C++, Assembly',
      description:
        'The PlayStation was known for standardizing disc based games over cartridges, as well as controllers with two analog sticks and vibration feedback.',
      logoClass: 'logo-ps'
    },
    {
      id: 2,
      name: 'Sega Genesis',
      year: '1989',
      tech: 'Motorola 68000',
      description:
        'A 16-bit home video game console developed and sold by Sega. It was a major competitor to the SNES.',
      logoClass: 'logo-sega'
    },
    {
      id: 3,
      name: 'Neo Geo',
      year: '1990',
      tech: 'Arcade Board',
      description:
        'Known for its high-end arcade specs brought to the home console market. Very expensive but powerful.',
      logoClass: 'logo-neogeo'
    },
    {
      id: 4,
      name: 'Nintendo 64',
      year: '1996',
      tech: 'MIPS R4300i',
      description: 'Named for its 64-bit central processing unit. Released with Super Mario 64.',
      logoClass: 'logo-n64'
    },
    {
      id: 5,
      name: 'Dreamcast',
      year: '1998',
      tech: 'Hitachi SH-4',
      description: 'The final home console from Sega, featuring a built-in modem for internet play.',
      logoClass: 'logo-dreamcast'
    }
  ];

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
    font-family: 'Arial', sans-serif; /* Clean sans-serif like reference */
  }

  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 20;
  }

  .content-container {
    display: grid;
    grid-template-columns: 1fr 400px; /* Left takes space, Right is fixed width wheel */
    height: 100%;
    padding-top: 80px; /* Clear header space */
  }

  /* LEFT COLUMN */
  .details-column {
    padding: 2rem 4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .project-title {
    font-size: 4rem;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0;
    line-height: 1;
  }

  .meta-info {
    display: flex;
    gap: 2rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #ccc;
  }

  .project-screenshot-container {
    width: 100%;
    max-width: 600px;
    aspect-ratio: 16/9;
    background: #222;
    border: 2px solid #444;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  .project-description {
    max-width: 600px;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #ddd;
  }

  /* RIGHT COLUMN (Wheel) */
  .wheel-column {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* Add a gradient mask if possible */
    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
  }

  .wheel-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end; /* Align right like reference */
    padding-right: 2rem;
    gap: 1rem;
  }

  .wheel-item {
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0.4;
    transform-origin: right center;
    transform: scale(0.8);
  }

  .wheel-item.active {
    opacity: 1;
    transform: scale(1.1); /* Active item is larger */
  }

  .wheel-logo {
    font-size: 3rem;
    font-weight: 900;
    /* Specific styles to mimic logos */
    color: #fff;
    text-transform: uppercase;

    /* Outline effect for that sticker feel */
    -webkit-text-stroke: 1px #888;
    display: block;
    text-align: right;
    white-space: nowrap;
  }

  /* Simulate Logo Colors */
  .logo-ps {
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  .logo-sega {
    color: #0055ff;
    -webkit-text-stroke: 1px white;
  }
  .logo-neogeo {
    color: #ffcc00;
  }
  .logo-n64 {
    color: #e60012;
  }
</style>
