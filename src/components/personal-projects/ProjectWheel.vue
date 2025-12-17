<template>
  <section class="wheel-column">
    <div class="wheel-list">
      <div
        v-for="(project, index) in projects"
        :key="project.id"
        class="wheel-item"
        :class="{ active: index === activeIndex }"
        @click="$emit('select', index)"
      >
        <!-- Logo/Title -->
        <span class="wheel-logo" :class="project.logoClass">{{ project.name }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { Project } from '../../data/projects';

  defineProps<{
    projects: Project[];
    activeIndex: number;
  }>();

  defineEmits<{
    (e: 'select', index: number): void;
  }>();
</script>

<style scoped>
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
    letter-spacing: 2px;
    font-family: 'Saira', sans-serif;

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
  .logo-pokedex {
    color: #ffcb05; /* Pokemon Yellow */
    -webkit-text-stroke: 2px #3c5aa6; /* Pokemon Blue Stroke */
    text-shadow: 4px 4px 0px #2a407a; /* Deeper Blue Shadow */
  }
</style>
