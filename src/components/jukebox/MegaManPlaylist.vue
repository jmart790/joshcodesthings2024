<template>
  <div class="data-logs-section">
    <div class="logs-header">DATA LOGS</div>
    <div class="playlist-container">
      <ul class="playlist">
        <MegaManLogItem
          v-for="video in videos"
          :key="video.id"
          :video="video"
          :is-active="currentVideoId === video.id"
          @click="$emit('select-video', video)"
        />
      </ul>
    </div>
    <!-- CRT Overlay -->
    <div class="crt-overlay"></div>
  </div>
</template>

<script setup>
  import MegaManLogItem from './MegaManLogItem.vue';

  defineProps({
    videos: {
      type: Array,
      required: true
    },
    currentVideoId: {
      type: String,
      required: true
    }
  });

  defineEmits(['select-video']);
</script>

<style scoped>
  /* --- Right: Data Logs Section --- */
  .data-logs-section {
    display: flex;
    flex-direction: column;
    /* Retro Panel styling - Green CRT Look */
    background: #0f160e; /* Deep green base */
    padding: 20px;
    height: 100%;
    box-sizing: border-box;
    position: relative;
    overflow: hidden; /* Overlay needs to stay put, inner content scrolls */
    border-radius: 4px;

    /* 16-bit 3D Depth Effect + CRT Bezel Shadow */
    border: 4px solid #1a1a1a;
    box-shadow: 
      /* Inner Vignette / CRT Curve Shadow */ inset 0 0 40px rgba(0, 0, 0, 0.9),
      inset 0 0 10px rgba(0, 0, 0, 0.8), /* Casing */ 0 0 0 4px #2b2b2b, 0 0 0 8px #555, 0 0 0 12px #111,
      0 10px 20px rgba(0, 0, 0, 0.8);

    margin-bottom: 20px;
  }

  /* Rivets / Mechanical Details via Pseudo-elements */
  .data-logs-section::before,
  .data-logs-section::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: #666;
    border: 1px solid #222;
    box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.4);
    z-index: 2;
  }

  /* Top-left rivet */
  .data-logs-section::before {
    top: -6px;
    left: -6px;
  }

  /* Top-right rivet */
  .data-logs-section::after {
    top: -6px;
    right: -6px;
  }

  .logs-header {
    color: #4aff4a;
    font-family: monospace;
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 8px #0f0;
    border-bottom: 2px solid #005500;
    padding-bottom: 8px;
    flex-shrink: 0;
    z-index: 1; /* Above overlay if needed, or overlay is transparent for clicks */
  }

  .playlist-container {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    position: relative;
    display: flex;
  }

  .playlist {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-right: 10px;
  }

  /* Scrollbar Styling - Green Terminal Look */
  .playlist::-webkit-scrollbar {
    width: 10px;
  }
  .playlist::-webkit-scrollbar-track {
    background: #001100;
    border-left: 1px solid #003300;
  }
  .playlist::-webkit-scrollbar-thumb {
    background: #004400;
    border: 2px solid #001100;
    border-radius: 0;
  }
  .playlist::-webkit-scrollbar-thumb:hover {
    background: #006600;
  }

  /* CRT Overlay */
  .crt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
    border-radius: 4px;

    /* Composition of multiple effects */
    background: 
      /* 1. Glare Reflection (Top Left) */ radial-gradient(
        circle at 5% 5%,
        rgba(6, 82, 6, 0.5) 1%,
        transparent 50%
      ),
      /* 2. Scanlines (Stronger) */
        repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) 1px, transparent 1px, transparent 3px),
      /* 3. Overall Green Tint */ linear-gradient(rgba(0, 30, 0, 0.2), rgba(0, 30, 0, 0.2));

    /* Heavy Vignette */
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.26), inset 0 0 20px rgba(0, 0, 0, 1);
  }
</style>
