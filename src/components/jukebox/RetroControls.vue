<template>
  <div class="control-unit">
    <!-- Row 1: Title Display -->
    <div class="display-panel">
      <div class="info-row">
        <span class="label">PLAYING</span>
        <div class="marquee-container">
          <span class="track-name">{{ trackTitle }}</span>
        </div>
      </div>
      <div class="time-display">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</div>
    </div>

    <!-- Row 2: Controls -->
    <div class="control-deck">
      <!-- Group 1: Transport -->
      <div class="btn-group">
        <button class="retro-btn" @click="$emit('play-prev')" title="Previous">
          <div class="icon-prev"></div>
        </button>
        <button class="retro-btn" @click="$emit('toggle-play')" :title="isPlaying ? 'Pause' : 'Play'">
          <div v-if="isPlaying" class="icon-pause">
            <div class="bar"></div>
            <div class="bar"></div>
          </div>
          <div v-else class="icon-play"></div>
        </button>
        <button class="retro-btn" @click="$emit('play-next')" title="Next">
          <div class="icon-next"></div>
        </button>
      </div>

      <!-- Group 2: Progress -->
      <div class="slider-group">
        <input
          type="range"
          min="0"
          :max="duration"
          :value="currentTime"
          @input="$emit('seek', Number($event.target.value))"
          class="retro-slider"
        />
      </div>

      <!-- Group 3: Volume -->
      <div class="btn-group vol-group">
        <button class="retro-btn mini" @click="$emit('adjust-volume', -10)">-</button>
        <div class="vol-indicator">
          <div v-for="n in 5" :key="n" class="vol-led" :class="{ active: currentVolume / 20 >= n }"></div>
        </div>
        <button class="retro-btn mini" @click="$emit('adjust-volume', 10)">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    isPlaying: {
      type: Boolean,
      required: true
    },
    currentVolume: {
      type: Number,
      required: true
    },
    trackTitle: {
      type: String,
      required: true
    },
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    }
  });

  defineEmits(['toggle-play', 'adjust-volume', 'seek', 'play-prev', 'play-next']);

  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' + s : s}`;
  }
</script>

<style scoped>
  .control-unit {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #444; /* Base metallic */
    padding: 6px;
    border-top: 2px solid #666;
  }

  /* --- Row 1: Display Panel --- */
  .display-panel {
    background: #000;
    border: 2px solid #222;
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.8);
    font-family: monospace;
    font-size: 0.75rem;
    height: 24px;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    flex: 1;
    margin-right: 12px;
  }

  .label {
    color: #007700;
    font-weight: bold;
    flex-shrink: 0;
  }

  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
    mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
  }

  .track-name {
    color: #ccffcc;
    font-weight: bold;
    text-shadow: 0 0 2px #55aa55;
    padding-inline: 1rem;
  }

  .time-display {
    color: #ccffcc;
    font-family: monospace;
    white-space: nowrap;
  }

  /* --- Row 2: Control Deck --- */
  .control-deck {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Shared Button Styles */
  .retro-btn {
    background: linear-gradient(to bottom, #444, #2a2a2a);
    border: 1px solid #111;
    border-top-color: #555;
    border-left-color: #555;
    color: #ccc;
    cursor: pointer;
    width: 28px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .retro-btn:active {
    background: #222;
    border-color: #111;
    border-bottom-color: #444;
    border-right-color: #444;
    transform: translateY(1px);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .retro-btn.mini {
    width: 20px;
    height: 20px;
    font-size: 1rem;
    line-height: 0;
    padding: 0;
  }

  .btn-group {
    display: flex;
    gap: 2px;
  }

  /* --- Icons --- */
  .icon-play {
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid #ccc;
  }
  .icon-pause {
    display: flex;
    gap: 2px;
  }
  .icon-pause .bar {
    width: 3px;
    height: 10px;
    background: #ccc;
  }
  .icon-prev,
  .icon-next {
    display: flex;
    align-items: center;
  }
  /* Two triangles for next/prev or triangle+bar? usually |< and >| */
  .icon-prev::before {
    content: '';
    width: 2px;
    height: 10px;
    background: #ccc;
    margin-right: 1px;
  }
  .icon-prev::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 8px solid #ccc;
  }

  .icon-next::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 8px solid #ccc;
    margin-right: 1px;
  }
  .icon-next::after {
    content: '';
    width: 2px;
    height: 10px;
    background: #ccc;
  }

  /* --- Slider Group --- */
  .slider-group {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 4px;
    background: #222;
    border-radius: 2px;
    border-bottom: 1px solid #444; /* Embossed Look */
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
    height: 18px;
    position: relative;
  }

  .retro-slider {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 100%;
    cursor: pointer;
    outline: none;
    margin: 0;
  }

  /* Track (invisible mostly, we rely on container) */
  .retro-slider::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: #111;
    border: 1px solid #000;
    border-radius: 2px;
    margin-top: -1px; /* Align vertical center attempt */
  }

  /* Thumb */
  .retro-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 14px;
    width: 8px;
    background: linear-gradient(to bottom, #777, #444);
    border: 1px solid #111;
    border-top-color: #999;
    border-left-color: #999;
    margin-top: -6px; /* Center on track */
    box-shadow: -1px 0 2px rgba(0, 0, 0, 0.5);
  }

  /* --- Volume --- */
  .vol-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .vol-indicator {
    display: flex;
    gap: 1px;
    background: #000;
    padding: 2px;
    border: 1px solid #222;
  }
  .vol-led {
    width: 4px;
    height: 8px;
    background: #333;
  }
  .vol-led.active {
    background: #0f0;
    box-shadow: 0 0 2px #0f0;
  }
</style>
