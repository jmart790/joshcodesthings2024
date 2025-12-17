<template>
  <section class="details-column">
    <h1 class="project-title">{{ project.name }}</h1>
    <div class="meta-info">
      <span class="meta-year">{{ project.year }}</span>
      <span class="meta-links" v-if="project.github || project.demoLink">
        <RetroButton v-if="project.github" small @click="openLink(project.github)">GitHub</RetroButton>
        <span class="link-separator" v-if="project.github && project.demoLink"> | </span>
        <RetroButton v-if="project.demoLink" small @click="openLink(project.demoLink)">Demo</RetroButton>
      </span>
    </div>

    <p class="project-description">
      <strong style="display: block; margin-bottom: 0.5rem; color: #fff">Project Context:</strong>
      {{ project.description }}
    </p>

    <div class="project-screenshot-container">
      <!-- Video Support -->
      <video v-if="project.video" :src="project.video" autoplay loop muted playsinline class="project-video"></video>
      <!-- Placeholder for screenshot -->
      <div v-else class="screenshot-placeholder">
        <span>{{ project.name }} Screenshot</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { Project } from '../../data/projects';
  import RetroButton from '../shared/RetroButton.vue';

  defineProps<{
    project: Project;
  }>();

  function openLink(url: string) {
    window.open(url, '_blank');
  }
</script>

<style scoped>
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

  .meta-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .link-separator {
    color: #444;
    font-size: 1.2rem;
  }

  .project-screenshot-container {
    border: 2px solid #444;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; /* Ensure zoomed video doesn't overflow */
  }

  .project-description {
    max-width: 600px;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #ddd;
  }

  .project-video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Fill the container, cropping if necessary */
    background: black;
  }
</style>
