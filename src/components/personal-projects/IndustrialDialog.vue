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
            <!-- Demo: WebM (VP9) first, MP4 fallback for Safari; poster shows while it loads.
                 Click opens the larger view. -->
            <button
              v-if="project.video"
              type="button"
              class="video-trigger"
              aria-label="Open demo in larger view"
              @click.stop="openModal"
            >
              <video
                ref="inlineVideo"
                :key="project.video"
                :poster="`${project.video}.jpg`"
                :autoplay="!reducedMotion"
                preload="none"
                loop
                muted
                playsinline
                class="project-video"
              >
                <source :src="`${project.video}.webm`" type="video/webm" />
                <source :src="`${project.video}.mp4`" type="video/mp4" />
              </video>
              <span class="video-expand-hint"><span class="touch-only">Tap to </span>Expand</span>
            </button>
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
            Live Site
          </button>
        </footer>
      </div>
    </div>

    <!-- Native <dialog>: top layer, Esc to close, focus handled by the browser.
         @wheel.stop keeps the page's wheel handler from switching projects underneath. -->
    <dialog
      v-if="project.video"
      ref="modal"
      class="demo-modal"
      :aria-label="`${project.name} demo`"
      @click="onModalClick"
      @close="onModalClose"
      @wheel.stop
    >
      <div class="demo-modal__frame">
        <div class="rivet outer top-left"></div>
        <div class="rivet outer top-right"></div>
        <div class="rivet outer bottom-left"></div>
        <div class="rivet outer bottom-right"></div>
        <div class="caution-tape top-center"></div>

        <header class="demo-modal__header">
          <h2 class="dialog-title">{{ project.name }}</h2>
          <button type="button" class="industrial-btn metal demo-modal__close" @click="closeModal">
            <div class="btn-rivet top-left"></div>
            <div class="btn-rivet top-right"></div>
            <div class="btn-rivet bottom-left"></div>
            <div class="btn-rivet bottom-right"></div>
            Close
          </button>
        </header>

        <div class="demo-modal__screen">
          <video
            v-if="isModalOpen"
            ref="modalVideo"
            :poster="`${project.video}.jpg`"
            autoplay
            loop
            muted
            playsinline
            controls
            class="demo-modal__video"
          >
            <source :src="`${project.video}.webm`" type="video/webm" />
            <source :src="`${project.video}.mp4`" type="video/mp4" />
          </video>
        </div>

        <div class="caution-tape bottom-center"></div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref } from 'vue';
  import type { Project } from '../../data/projects';
  import TypeWriter from '../shared/TypeWriter.vue';

  defineProps<{
    isOpen: boolean;
    project: Project;
  }>();

  defineEmits(['click']);

  // Reduced motion: no autoplay, the poster stands in until the visitor opens the demo.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const inlineVideo = ref<HTMLVideoElement>();
  const modalVideo = ref<HTMLVideoElement>();
  const modal = ref<HTMLDialogElement>();
  const isModalOpen = ref(false);

  function openLink(url: string) {
    window.open(url, '_blank');
  }

  // Phones: the frame can't get much bigger than the screen's width, so hand the
  // video to the phone's own full-screen player instead (it fills the screen when turned sideways).
  const phoneTouch = window.matchMedia('(max-width: 767px) and (pointer: coarse)');

  async function openFullscreen(video: HTMLVideoElement) {
    // iPhone Safari only supports full screen on the video itself, via its own API
    const iosVideo = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (!video.requestFullscreen && iosVideo.webkitEnterFullscreen) {
      iosVideo.webkitEnterFullscreen();
    } else {
      // no orientation lock: it opens centered at full width in portrait, and
      // turning the phone sideways fills the screen
      await video.requestFullscreen();
    }
    video.play().catch(() => {});
  }

  async function openModal() {
    const inline = inlineVideo.value;
    if (inline && phoneTouch.matches) {
      try {
        await openFullscreen(inline);
        return;
      } catch {
        /* full screen refused: fall back to the in-page view */
      }
    }
    inline?.pause();
    isModalOpen.value = true;
    modal.value?.showModal();
    await nextTick();
    // Pick up where the small player was so the expand feels continuous.
    if (modalVideo.value && inline) modalVideo.value.currentTime = inline.currentTime;
  }

  function closeModal() {
    modal.value?.close();
  }

  // Clicks on the backdrop land on the <dialog> itself; clicks on the frame don't.
  function onModalClick(event: MouseEvent) {
    if (event.target === modal.value) closeModal();
  }

  function onModalClose() {
    const inline = inlineVideo.value;
    if (inline && modalVideo.value) inline.currentTime = modalVideo.value.currentTime;
    isModalOpen.value = false; // unmounts the big video so it stops downloading/decoding
    if (inline && !reducedMotion) inline.play().catch(() => {});
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
      width: var(--card-w);
      height: 10px;
    }
    100% {
      width: var(--card-w);
      height: var(--card-h);
    }
  }

  /* Main Card Frame (Outer Border) */
  .industrial-dialog-card {
    /* Size comes from the page (personal-projects.vue overrides on tablet/phone);
       the expand animation reads the same vars. */
    --card-w: var(--industrial-card-w, 620px);
    --card-h: var(--industrial-card-h, 780px);

    position: relative;
    width: var(--card-w);
    height: var(--card-h);
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
  /* Shrink chain (min-height: 0 on each flex level) so a short card squeezes
     only the description, which scrolls; the demo and buttons keep full size. */
  .inner-frame-border,
  .screen-container {
    min-height: 0;
  }

  .dialog-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    min-height: 0;
  }

  .description-text {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    line-height: 1.6;
    color: #fff;
    text-shadow: 1px 1px 3px #000;
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
  }

  /* Pixel scrollbar, riveted-metal colors (same build as DialogCard.vue's).
     Styling ::-webkit-scrollbar keeps it visible on macOS while it overflows.
     Its first 8px are a transparent gap off the text: spacing that exists only
     when the scrollbar does, so text that fits never re-wraps. */
  .description-text::-webkit-scrollbar {
    width: 20px;
  }
  .description-text::-webkit-scrollbar-track {
    background: linear-gradient(90deg, transparent 8px, #222 8px 10px, rgba(0, 0, 0, 0.35) 10px);
  }
  .description-text::-webkit-scrollbar-thumb {
    background: #7a7a7a padding-box;
    border: 2px solid #222;
    border-left: 10px solid transparent; /* gap + the track's dark edge show through */
    border-radius: 0;
    box-shadow:
      inset 2px 2px 0 #bbb,
      inset -2px -2px 0 #444;
  }
  .description-text::-webkit-scrollbar-thumb:hover {
    background: #999 padding-box;
  }
  @supports not selector(::-webkit-scrollbar) {
    .description-text {
      scrollbar-color: #7a7a7a rgba(0, 0, 0, 0.35);
    }
  }

  .project-screenshot-container {
    flex: none;
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

  .video-trigger {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    cursor: zoom-in;
  }

  .project-video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-expand-hint {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 6px 8px;
    font-family: 'Press Start 2P', monospace;
    font-size: 0.55rem;
    color: #ffcc00;
    background: rgba(0, 0, 0, 0.75);
    border: 2px solid #ffcc00;
    text-shadow: 1px 1px 0 #000;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  .video-trigger:hover .video-expand-hint,
  .video-trigger:focus-visible .video-expand-hint {
    opacity: 1;
  }

  /* touch screens have no hover, so the hint always shows ("Tap to Expand") */
  .touch-only {
    display: none;
  }
  @media (hover: none) {
    .video-expand-hint {
      opacity: 1;
    }
    .touch-only {
      display: inline;
    }
  }

  /* Phones: thinner frame and the demo first, edge to edge on the blue screen,
     so it gets as much of the narrow card as possible. The description takes
     what's left below it and scrolls. */
  @media (max-width: 767px) {
    .industrial-dialog-card {
      padding: 10px;
    }
    .inner-frame-border {
      padding: 10px;
    }
    .screen-container {
      padding: 1.25rem 0.75rem 0;
    }
    .project-screenshot-container {
      order: -1;
      width: calc(100% + 1.5rem);
      margin-inline: -0.75rem;
      border-inline: 0;
    }
  }

  .video-trigger:focus-visible {
    outline: 3px solid #ffcc00;
    outline-offset: -3px;
  }

  /* Demo modal: same outer frame, rivets and caution tape as the card. */
  .demo-modal {
    width: min(1200px, 92vw);
    max-width: none;
    max-height: 92vh;
    padding: 0;
    border: 0;
    background: transparent;
    overflow: visible;
  }

  .demo-modal::backdrop {
    background: rgba(0, 0, 0, 0.8);
  }

  .demo-modal[open] {
    animation: demo-modal-in 0.25s ease-out;
  }

  @keyframes demo-modal-in {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
  }

  .demo-modal__frame {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 32px 24px 36px;
    background: #7a7a7a;
    border: 4px solid #555;
    border-top-color: #999;
    border-left-color: #999;
    border-bottom-color: #333;
    border-right-color: #333;
    border-radius: 10px;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
  }

  .demo-modal__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .industrial-btn.demo-modal__close {
    flex: 0 0 auto;
    padding: 10px 18px;
    font-size: 0.75rem;
  }

  .demo-modal__screen {
    background: #000;
    border: 4px solid #222;
    border-bottom-color: #888;
    border-right-color: #888;
    border-radius: 6px;
    box-shadow: inset 4px 4px 10px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .demo-modal__video {
    display: block;
    width: 100%;
    max-height: calc(92vh - 140px);
    object-fit: contain;
    background: #000;
  }

  @media (prefers-reduced-motion: reduce) {
    .demo-modal[open] {
      animation: none;
    }
  }

  @media (max-width: 720px) {
    .demo-modal__frame {
      padding: 26px 12px 30px;
    }

    .demo-modal .dialog-title {
      font-size: 0.8rem;
    }
  }

  /* same text sizes as the shared dialog box (DialogCard.vue) on small
     screens: body 0.9rem / 0.85rem, title 125% of that */
  @media (max-width: 720px) {
    .description-text {
      font-size: 0.9rem;
    }

    .dialog-title {
      font-size: 1.125rem;
    }
  }
  @media (max-width: 480px) {
    .description-text {
      font-size: 0.85rem;
    }

    .dialog-title {
      font-size: 1.0625rem;
    }
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
