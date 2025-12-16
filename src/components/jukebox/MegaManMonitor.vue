<template>
  <div class="screen-section">
    <div class="monitor-casing">
      <div class="screen-inner">
        <!-- The placeholder for the YouTube Player -->
        <div id="youtube-player"></div>
        <!-- CRT Overlay (Combined with Click Shield) -->
        <div class="crt-overlay"></div>
      </div>

      <!-- Combined status and controls bar -->
      <RetroControls
        :is-playing="isPlaying"
        :current-volume="currentVolume"
        :track-title="currentVideo.title"
        :current-time="currentTime"
        :duration="duration"
        @toggle-play="togglePlay"
        @adjust-volume="adjustVolume"
        @seek="seekTo"
        @play-prev="$emit('play-prev')"
        @play-next="$emit('play-next')"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
  import RetroControls from './RetroControls.vue';

  const props = defineProps({
    currentVideo: {
      type: Object,
      required: true
    }
  });

  const emit = defineEmits(['play-prev', 'play-next', 'play', 'pause']);

  const isPlaying = ref(false);
  const currentVolume = ref(100); // 0-100
  const currentTime = ref(0);
  const duration = ref(0);
  let player = null;
  let timer = null;

  // Load YouTube API
  onMounted(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  });

  function initPlayer() {
    // Safety check if component unmounted before API loaded
    if (!document.getElementById('youtube-player')) return;

    player = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: props.currentVideo.id,
      playerVars: {
        autoplay: 1,
        controls: 0, // Hide default controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        disablekb: 1,
        iv_load_policy: 3 // Hide annotations
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  }

  function onPlayerReady(event) {
    event.target.setVolume(currentVolume.value);
    duration.value = event.target.getDuration();
    // Attempt play (browser policy might block unmuted autoplay)
    event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    if (event.data === window.YT.PlayerState.PLAYING) {
      isPlaying.value = true;
      startTimer();
      emit('play');
    } else {
      isPlaying.value = false;
      stopTimer();
      emit('pause');
    }
  }

  // Watch for video changes to load new video
  watch(
    () => props.currentVideo,
    (newVideo) => {
      if (player && player.loadVideoById) {
        player.loadVideoById(newVideo.id);
        currentTime.value = 0;
      }
    }
  );

  function togglePlay() {
    if (!player) return;
    if (isPlaying.value) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function adjustVolume(change) {
    if (!player) return;
    let newVol = currentVolume.value + change;
    if (newVol > 100) newVol = 100;
    if (newVol < 0) newVol = 0;
    currentVolume.value = newVol;
    player.setVolume(newVol);
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (player && player.getCurrentTime) {
        currentTime.value = player.getCurrentTime();
      }
    }, 500);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function seekTo(time) {
    if (!player) return;
    player.seekTo(time, true);
    currentTime.value = time;
  }

  onBeforeUnmount(() => {
    if (player && player.destroy) {
      player.destroy();
    }
  });
</script>

<style scoped>
  .screen-section {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #000;
    border: 4px solid #1a1a1a;
    border-radius: 4px;
    box-sizing: border-box;
    overflow: hidden; /* Round content */
    justify-content: center;
    position: relative;
    box-shadow:
      /* Inner-most Bevel (Recess) */ inset 4px 4px 0 rgba(0, 0, 0, 0.5),
      inset -2px -2px 0 rgba(255, 255, 255, 0.1), /* Casing Body Layers */ 0 0 0 4px #2b2b2b,
      /* Dark grey inner rim */ 0 0 0 8px #555, /* Lighter grey metallic body */ 0 0 0 12px #111,
      /* Outer dark styling line */ /* Casting shadow on the wall */ 0 10px 20px rgba(0, 0, 0, 0.8);

    margin-bottom: 0; /* Align perfectly */
  }

  .monitor-casing {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%; /* Fill the section */
    gap: 0; /* Remove gap to fix cutoff/fit content */
    overflow: visible;
    justify-content: space-between;
  }

  /* Rivets / Mechanical Details via Pseudo-elements */
  .screen-section::before,
  .screen-section::after {
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
  .screen-section::before {
    top: -6px;
    left: -6px;
  }

  /* Top-right rivet */
  .screen-section::after {
    top: -6px;
    right: -6px;
  }

  .screen-inner {
    width: 100%;
    height: 100%;
    background: #000;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  /* Force the iframe to ignore mouse events to be double sure */
  .screen-inner :deep(iframe) {
    pointer-events: none;
    z-index: 0;
  }

  /* CRT Overlay - Combined Visuals + Click Shield */
  .crt-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    cursor: default; /* Acts as shield */

    background: 
      /* 1. Glare Reflection (Top Left) */ radial-gradient(
        circle at 10% 10%,
        rgba(200, 220, 255, 0.4) 0%,
        transparent 40%
      ),
      /* 2. Scanlines */
        repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3) 1px, transparent 1px, transparent 3px),
      /* 3. Blue Tint for Visibility */ linear-gradient(rgba(0, 50, 200, 0.2), rgba(0, 50, 200, 0.2));

    /* Vignette for depth */
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.26), inset 0 0 20px rgba(0, 0, 0, 1);
  }

  @media (max-width: 1000px) {
    .screen-section {
      height: auto;
    }
  }
</style>
