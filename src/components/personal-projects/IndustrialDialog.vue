<template>
  <div v-if="isOpen" class="industrial-dialog-card">
    <!-- Outer Frame Content -->
    <div class="outer-frame-elements">
      <!-- 4 Corner Rivets for Outer Frame -->
      <div class="rivet outer top-left"></div>
      <div class="rivet outer top-right"></div>
      <div class="rivet outer bottom-left"></div>
      <div class="rivet outer bottom-right"></div>

      <!-- Bottom Center Caution Tape -->
      <div class="caution-tape bottom-center"></div>
    </div>

    <!-- Inner Frame (The second border) -->
    <div class="inner-frame-border">
      <!-- Top Center Caution Tape (on inner frame) -->
      <div class="caution-tape top-center"></div>

      <!-- Inner Frame Rivets (Side and Bottom) -->
      <div class="rivet inner left-1"></div>
      <div class="rivet inner left-2"></div>
      <div class="rivet inner left-3"></div>
      <div class="rivet inner left-4"></div>
      <div class="rivet inner left-5"></div>

      <div class="rivet inner right-1"></div>
      <div class="rivet inner right-2"></div>
      <div class="rivet inner right-3"></div>
      <div class="rivet inner right-4"></div>
      <div class="rivet inner right-5"></div>

      <div class="screen-container">
        <header class="dialog-header">
          <h2 class="dialog-title">{{ project.name }}</h2>
        </header>

        <div class="dialog-content">
          <TypeWriter class="description-text" :text="project.description" :delay="800" :speed="10" />

          <div class="project-screenshot-container">
            <!-- Video Support -->
            <video
              v-if="project.video"
              :src="project.video"
              autoplay
              loop
              muted
              playsinline
              class="project-video"
            ></video>
            <!-- Placeholder for screenshot -->
            <div v-else class="screenshot-placeholder">
              <span>{{ project.name }} Screenshot</span>
            </div>
          </div>
        </div>

        <footer class="dialog-footer">
          <button v-if="project.github" class="industrial-btn wood" @click.stop="openLink(project.github)">
            <div class="btn-rivet top-left"></div>
            <div class="btn-rivet top-right"></div>
            <div class="btn-rivet bottom-left"></div>
            <div class="btn-rivet bottom-right"></div>
            GitHub
          </button>
          <button v-if="project.demoLink" class="industrial-btn metal" @click.stop="openLink(project.demoLink)">
            <div class="btn-rivet top-left"></div>
            <div class="btn-rivet top-right"></div>
            <div class="btn-rivet bottom-left"></div>
            <div class="btn-rivet bottom-right"></div>
            Demo
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Project } from '../../data/projects';
  import TypeWriter from '../shared/TypeWriter.vue';

  defineProps<{
    isOpen: boolean;
    project: Project;
  }>();

  defineEmits(['click']);

  function openLink(url: string) {
    window.open(url, '_blank');
  }
</script>

<style scoped>
  @keyframes expand-dialog {
    0% {
      opacity: 0;
      width: 0px;
      height: 0px;
    }
    40% {
      opacity: 1;
      width: 620px;
      height: 10px;
    }
    100% {
      width: 620px;
      height: 780px;
    }
  }

  /* Main Card Frame (Outer Border) */
  .industrial-dialog-card {
    position: relative;
    width: 620px; /* Fixed width matching max-width from user edit */
    height: 780px; /* Fixed height for consistency */
    background: #7a7a7a; /* Industrial Grey Base */
    border: 4px solid #555;
    border-top-color: #999;
    border-left-color: #999;
    border-bottom-color: #333;
    border-right-color: #333;
    border-radius: 10px;
    padding: 20px; /* Space for outer rivets/border thickness */
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    /* cursor: pointer; removed */
    overflow: hidden;
    animation: expand-dialog 0.6s ease forwards;
  }

  /* Inner Frame Border (The frame holding the screen) */
  .inner-frame-border {
    position: relative;
    background: #666; /* Slightly darker/different grey */
    border: 3px solid #333;
    border-top-color: #999; /* Light top for raised effect */
    border-left-color: #999;
    border-bottom-color: #222; /* Dark bottom for shadow */
    border-right-color: #222;
    border-radius: 10px;
    padding: 15px; /* Space for inner rivets */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); /* Drop shadow onto outer frame */
    display: flex;
    flex-direction: column;
    flex: 1; /* Fill outer frame */
  }

  /* Screen Container (Blueprint Area) */
  .screen-container {
    background: #335aa9; /* Blueprint Blue */
    border: 4px solid #333; /* Dark base for recess */
    border-top-color: #222; /* Shadow from top frame */
    border-left-color: #222; /* Shadow from left frame */
    border-bottom-color: #888; /* Highlight on bottom edge */
    border-right-color: #888; /* Highlight on right edge */
    border-radius: 10px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    flex: 1; /* Fill inner frame */
    gap: 1rem;
    box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.2); /* Recessed look */
    cursor: default; /* Content shouldn't look clickable unless buttons */
    position: relative; /* Context for grid pseudo */
    padding-bottom: 0; /* Let buttons sit at bottom */
  }

  /* Grid Pattern (Pseudo-element to not touch borders) */
  .screen-container::before {
    content: '';
    position: absolute;
    inset: 10px;
    bottom: 30px;

    /* Grid Lines: Increased opacity to 0.25 to stand out more */
    background-image: linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
    background-size: 30px 30px; /* Bigger squares */

    /* Borders on all sides */
    border: 1px solid rgba(255, 255, 255, 0.4);

    pointer-events: none;
    z-index: 0;
  }

  /* Blueprint Grid Pattern removed */

  /* Typography */
  .dialog-header {
    margin-bottom: 0.5rem;
  }

  .dialog-title {
    color: #ffcc00; /* Amber/Orange title */
    font-family: 'Press Start 2P', monospace;
    font-size: 1.2rem;
    text-transform: uppercase;
    margin: 0;
    text-shadow: 4px 4px #000;
    letter-spacing: 1px;
  }

  .dialog-footer {
    margin-top: auto;
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    padding-bottom: 10px; /* Space from bottom border */
    position: relative;
    z-index: 2; /* Above grid */
  }

  /* Content Styles */
  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    justify-content: space-between;
  }

  .description-text {
    line-height: 1.6;
    color: #fff;
    text-shadow: 1px 1px 3px #000;
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
  }

  .project-screenshot-container {
    width: 100%;
    aspect-ratio: 16/9;
    background: #000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    border: 2px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-inline: auto;
    z-index: 1;
  }

  .project-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .screenshot-placeholder {
    color: #fff;
  }

  /* Caution Tape Styles */
  .caution-tape {
    position: absolute;
    height: 20px;
    background: repeating-linear-gradient(45deg, #ffcc00, #ffcc00 10px, #000 10px, #000 20px);
    border: 1px solid #000;
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
    z-index: 2;
  }

  .caution-tape.bottom-center {
    bottom: 0px;
    left: 10%;
    right: 10%;
  }

  .caution-tape.top-center {
    top: 0px;
    left: 10%;
    right: 10%;
    height: 16px;
    border: 1px solid #000;
  }

  /* Rivet Styles */
  .rivet {
    position: absolute;
    width: 6px;
    height: 6px;
    background: radial-gradient(circle at 30% 30%, #cccccc, #4a4a4a);
    border-radius: 50%;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
    z-index: 4;
    border: 1px solid #0000006a;
  }

  /* Outer Frame Rivets (Corners) */
  .rivet.outer.top-left {
    top: 6px;
    left: 6px;
  }
  .rivet.outer.top-right {
    top: 6px;
    right: 6px;
  }
  .rivet.outer.bottom-left {
    bottom: 6px;
    left: 6px;
  }
  .rivet.outer.bottom-right {
    bottom: 6px;
    right: 6px;
  }

  /* Inner Frame Rivets */
  .rivet.inner.left-1 {
    left: 4px;
    top: 10%;
  }
  .rivet.inner.left-2 {
    left: 4px;
    top: 30%;
  }
  .rivet.inner.left-3 {
    left: 4px;
    top: 50%;
  }
  .rivet.inner.left-4 {
    left: 4px;
    top: 70%;
  }
  .rivet.inner.left-5 {
    left: 4px;
    top: 90%;
  }

  .rivet.inner.right-1 {
    right: 4px;
    top: 10%;
  }
  .rivet.inner.right-2 {
    right: 4px;
    top: 30%;
  }
  .rivet.inner.right-3 {
    right: 4px;
    top: 50%;
  }
  .rivet.inner.right-4 {
    right: 4px;
    top: 70%;
  }
  .rivet.inner.right-5 {
    right: 4px;
    top: 90%;
  }

  /* Industrial Buttons */
  .industrial-btn {
    flex: 1;
    font-family: 'Press Start 2P', monospace;
    font-size: 1rem;
    padding: 10px 0;
    cursor: pointer;
    border: 2px solid #000;
    border-radius: 4px;
    text-transform: capitalize;
    box-shadow: inset 2px 2px 0px rgba(255, 255, 255, 0.3), inset -2px -2px 0px rgba(0, 0, 0, 0.3),
      2px 2px 5px rgba(0, 0, 0, 0.5);
    text-shadow: 1px 1px 0 #000;
    color: #fff;
    position: relative;
  }

  .industrial-btn:hover {
    filter: brightness(1.2);
    text-shadow: 2px 2px 0 #000;
  }

  .industrial-btn:active {
    transform: translate(2px, 2px);
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.5);
    filter: brightness(0.9);
  }

  .industrial-btn.wood {
    background: #8b4513; /* SaddleBrown */
    background: linear-gradient(to bottom, #a0522d, #8b4513);
    border-color: #5c3317;
  }

  .industrial-btn.metal {
    background: #777;
    background: linear-gradient(to bottom, #999, #666);
    border-color: #444;
  }

  /* Button Rivets */
  .btn-rivet {
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle at 30% 30%, #ddd, #555);
    border-radius: 50%;
    box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  }

  .btn-rivet.top-left {
    top: 4px;
    left: 4px;
  }
  .btn-rivet.top-right {
    top: 4px;
    right: 4px;
  }
  .btn-rivet.bottom-left {
    bottom: 4px;
    left: 4px;
  }
  .btn-rivet.bottom-right {
    bottom: 4px;
    right: 4px;
  }
</style>
