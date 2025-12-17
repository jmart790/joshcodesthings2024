<template>
  <div class="juke-box-page">
    <div class="back-button">
      <RetroButton @click="$router.push('./stage-select')">&lt; Back</RetroButton>
    </div>

    <JukeboxFrame>
      <div class="frame-content">
        <MegaManMonitor
          :current-video="currentVideo"
          @play-next="playNext"
          @play-prev="playPrev"
          @play="setAmbienceState(true)"
          @pause="setAmbienceState(false)"
        />
        <MegaManPlaylist :videos="videos" :current-video-id="currentVideo.id" @select-video="playVideo" />
      </div>

      <WireAssembly />

      <video
        ref="mediamanVideo"
        class="mediaman-video"
        autoplay
        loop
        muted
        playsinline
        src="/mediaman_dancing.webm"
      ></video>

      <video ref="yoshxVideo" class="yoshx-video" loop muted playsinline src="/yoshx_nodding.webm"></video>
    </JukeboxFrame>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import MegaManMonitor from '../components/jukebox/MegaManMonitor.vue';
  import MegaManPlaylist from '../components/jukebox/MegaManPlaylist.vue';
  import WireAssembly from '../components/jukebox/WireAssembly.vue';
  import JukeboxFrame from '../components/jukebox/JukeboxFrame.vue';

  const videos = [
    { title: 'Breath of LoFi III: Beats from Cedar Woods', id: 'UeGPZerwib4' },
    { title: 'Super Lofi-Vania IV : Beats from the Clock Tower', id: '2DVUhqmgqhI' },
    { title: 'Lo-Fi Fantasy Tactics: Beats from the Zodiac Brave', id: 'lnxKqQA6_qU' },
    { title: 'Blue Bomber LoFi: Beats from 20XX', id: 'QXrXy3LpzVQ' },
    { title: 'Lo-Fi Trigger: Beats from Between Timelines', id: '6KDtnf_Ai_k' },
    { title: 'Maverick Hunter LoFi: Beats from the Maverick Rebellion', id: 'jlhXMH1vQGQ' },
    { title: 'Lo-Fi Fantasy VI: Beats from the Opera House (Vol.3)', id: 'Y6a2HPi7w4E' },
    { title: 'Lo-Fi the Hedgehog: Beats from the Green Hills', id: '1D2k-uipzBI' },
    { title: 'Lo-Fi Trigger: Beats from 1000 A.D (Vol.1)', id: 'TXRoSN0pHkI' }
  ];

  const currentVideo = ref(videos[Math.floor(Math.random() * videos.length)]);
  const mediamanVideo = ref(null);
  const yoshxVideo = ref(null);

  function playVideo(video) {
    currentVideo.value = video;
  }

  function playNext() {
    const currentIndex = videos.findIndex((v) => v.id === currentVideo.value.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    currentVideo.value = videos[nextIndex];
  }

  function playPrev() {
    const currentIndex = videos.findIndex((v) => v.id === currentVideo.value.id);
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    currentVideo.value = videos[prevIndex];
  }

  function setAmbienceState(shouldPlay) {
    const ambienceVideos = [mediamanVideo.value, yoshxVideo.value];
    ambienceVideos.forEach((video) => {
      if (video) {
        shouldPlay ? video.play() : video.pause();
      }
    });
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .juke-box-page {
    min-height: 100vh;
    background-color: #1a1b1b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Press Start 2P', monospace;
    font-family: monospace;
    padding: 8rem;
    box-sizing: border-box;
    overflow: hidden;
    background-image: radial-gradient(circle at center, transparent 80%, #000 100%),
      linear-gradient(rgba(0, 200, 255, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(2, 200, 255, 0.07) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    background-position: center;
  }

  .back-button {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    z-index: 100;
  }

  .frame-content {
    position: relative;
    z-index: 10;
    display: grid;
    grid-template-columns: 2fr 1.2fr;
    gap: 20px;
    width: 100%;
    height: 100%;
    background: #000c18;
    border: 4px solid hsla(188, 23%, 39%, 0.497);
    border-radius: 12px;
    padding: 15px;
    box-shadow: inset 0 0 30px #000, 0 0 0 2px #333310;
    box-sizing: border-box;
    overflow: hidden;
  }

  .mediaman-video {
    position: absolute;
    height: 200px;
    width: auto;
    bottom: -19px;
    right: 0%;
    transform: translateX(22%);
    z-index: 15;
    pointer-events: none;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }

  .yoshx-video {
    position: absolute;
    height: 200px;
    width: auto;
    bottom: -10px;
    left: 0%;
    transform: translateX(-30%);
    z-index: 15;
    pointer-events: none;
    filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5));
  }

  @media (max-width: 1000px) {
    .frame-content {
      display: flex;
      flex-direction: column;
    }
  }
</style>
