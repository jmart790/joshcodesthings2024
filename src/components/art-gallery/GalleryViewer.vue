<template>
  <!-- Native modal dialog: top layer, Esc closes, focus is trapped by the browser. -->
  <dialog ref="dialog" class="gallery-viewer" @click="onBackdropClick" @close="onClose" @keydown="onKey">
    <div v-if="piece" class="gallery-viewer__body">
      <div class="gallery-viewer__frame">
        <img :src="piece.img" :alt="piece.name" class="gallery-viewer__img" />
      </div>
      <div class="gallery-viewer__info">
        <div>
          <h3 class="gallery-viewer__name">{{ piece.name }}</h3>
          <p class="gallery-viewer__desc">{{ piece.desc }}</p>
        </div>
        <span class="gallery-viewer__count">{{ index + 1 }} / {{ pieces.length }}</span>
      </div>
      <div class="gallery-viewer__controls">
        <RetroButton small :disabled="index === 0" @click="step(-1)">&lt; Prev</RetroButton>
        <RetroButton small @click="close">Close</RetroButton>
        <RetroButton small :disabled="index === pieces.length - 1" @click="step(1)">Next &gt;</RetroButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import RetroButton from '../shared/RetroButton.vue';

  type Piece = { img: string; name: string; desc: string };

  const props = defineProps<{ pieces: Piece[] }>();
  // index of the piece in `pieces`; reports the last one viewed on close
  const emit = defineEmits<{ (e: 'close', index: number): void }>();

  const dialog = ref<HTMLDialogElement | null>(null);
  const index = ref(0);
  const piece = computed(() => props.pieces[index.value]);

  function open(start: number) {
    index.value = start;
    // the page scrolls the 3D gallery; keep wheel/touch from moving it behind the modal
    document.documentElement.style.overflow = 'hidden';
    dialog.value?.showModal();
  }

  function close() {
    dialog.value?.close();
  }

  // fires however it closes (button, Esc, backdrop)
  function onClose() {
    document.documentElement.style.removeProperty('overflow');
    emit('close', index.value);
  }

  function step(dir: number) {
    index.value = Math.min(props.pieces.length - 1, Math.max(0, index.value + dir));
  }

  function onKey(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') step(-1);
    if (event.key === 'ArrowRight') step(1);
  }

  // a click that lands on the <dialog> itself (not its content) is the backdrop
  function onBackdropClick(event: MouseEvent) {
    if (event.target === dialog.value) close();
  }

  defineExpose({ open });
</script>

<style scoped>
  .gallery-viewer {
    max-width: none;
    max-height: none;
    width: min(960px, 100vw - 2 * var(--page-gutter));
    padding: 0;
    border: 0;
    background: transparent;
    overflow: visible;
  }

  .gallery-viewer::backdrop {
    background: rgba(5, 5, 16, 0.88);
  }

  .gallery-viewer[open] {
    animation: viewer-in 0.25s ease-out;
  }

  .gallery-viewer__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  /* same black matte frame as the hallway art (ImageArt.vue) */
  .gallery-viewer__frame {
    border: 12px solid #000;
    outline: 1px solid #333;
    background: #121212;
    box-shadow: 0 0 40px rgba(255, 0, 85, 0.25);
  }

  .gallery-viewer__img {
    display: block;
    max-width: 100%;
    max-height: calc(100dvh - 15rem);
    object-fit: contain;
  }

  .gallery-viewer__info {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    font-family: 'Courier New', Courier, monospace;
    color: #ccc;
  }

  .gallery-viewer__name {
    margin: 0 0 0.25rem;
    font-size: clamp(1.25rem, 3vw, 2rem);
    color: #ff0055;
    text-transform: uppercase;
    letter-spacing: 4px;
  }

  .gallery-viewer__desc {
    margin: 0;
    font-size: 1.1rem;
  }

  .gallery-viewer__count {
    font-family: 'Press Start 2P', monospace;
    font-size: 0.75rem;
    white-space: nowrap;
  }

  .gallery-viewer__controls {
    display: flex;
    gap: 2rem;
  }

  @keyframes viewer-in {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gallery-viewer[open] {
      animation: none;
    }
  }
</style>
