<template>
  <dialog
    :open="isOpen"
    class="dialog-card"
    :class="[`size-${size}`, { 'is-full-size': isFullSize, 'is-transparent': isTransparent }]"
  >
    <header>
      <TypeWriter
        class="type-writer"
        :class="{ blue: isNameBlue }"
        v-if="isOpen"
        :delay="10"
        :speed="10"
        :text="name"
      />
    </header>
    <!-- The description scrolls in .body; the bar beside it is our own (not the
         browser's) so it shows and can be dragged on touch screens too. -->
    <section>
      <div ref="body" class="body" @scroll="syncBar">
        <div ref="content">
          <TypeWriter class="type-writer" v-if="isOpen" :delay="1000" :speed="10" :text="desc" />
          <slot></slot>
        </div>
      </div>
      <div class="scrollbar" :class="{ 'is-idle': !bar.overflowing }" @pointerdown="jumpTo">
        <div
          class="thumb"
          :style="{ height: `${bar.thumbHeight}px`, transform: `translateY(${bar.thumbTop}px)` }"
          @pointerdown.stop="startDrag"
        ></div>
      </div>
    </section>
    <!-- The card's only CTA: show it highlighted and focused on open, so Enter goes. -->
    <RetroButton ref="cta" selected @click.stop="$emit('go-to-stage')" v-if="isDisabled ? false : size !== 'sm'">
      <TypeWriter class="type-writer" v-if="isOpen" :delay="0" :speed="10" text="Go!" />
    </RetroButton>
  </dialog>
</template>

<script setup lang="ts">
  import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
  import TypeWriter from './TypeWriter.vue';
  import RetroButton from './RetroButton.vue';
  const props = withDefaults(
    defineProps<{
      isOpen: boolean;
      name: string;
      desc: string;
      size: string;
      isDisabled?: boolean;
      isNameBlue?: boolean;
      isFullSize?: boolean;
      isTransparent?: boolean;
    }>(),
    {
      isDisabled: false,
      isNameBlue: false,
      isFullSize: false,
      isTransparent: false
    }
  );

  const cta = ref<{ $el: HTMLElement } | null>(null);
  watch(
    () => props.isOpen,
    async (open) => {
      if (!open) return;
      await nextTick();
      cta.value?.$el.focus({ preventScroll: true });
    },
    { immediate: true }
  );

  // --- Custom scrollbar for .body ---
  const body = ref<HTMLElement | null>(null);
  const content = ref<HTMLElement | null>(null);
  const bar = reactive({ overflowing: false, thumbHeight: 0, thumbTop: 0 });
  const MIN_THUMB = 24;

  // the track runs the full height of the scroll area
  const trackHeight = () => body.value?.clientHeight ?? 0;

  function syncBar() {
    const el = body.value;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    bar.overflowing = scrollable > 1;
    const track = trackHeight();
    bar.thumbHeight = Math.max(MIN_THUMB, (track * el.clientHeight) / Math.max(el.scrollHeight, 1));
    bar.thumbTop = scrollable > 0 ? ((track - bar.thumbHeight) * el.scrollTop) / scrollable : 0;
  }

  // drag the thumb: map pointer travel along the track to scroll distance
  function startDrag(event: PointerEvent) {
    const el = body.value;
    if (!el) return;
    const thumb = event.currentTarget as HTMLElement;
    // keep receiving moves when the finger slides off the thin thumb
    try {
      thumb.setPointerCapture(event.pointerId);
    } catch {
      /* pointer already gone; the move/up listeners still work */
    }
    const startY = event.clientY;
    const startScroll = el.scrollTop;
    const ratio = (el.scrollHeight - el.clientHeight) / Math.max(trackHeight() - bar.thumbHeight, 1);
    const move = (e: PointerEvent) => {
      el.scrollTop = startScroll + (e.clientY - startY) * ratio;
    };
    const end = () => {
      thumb.removeEventListener('pointermove', move);
      thumb.removeEventListener('pointerup', end);
      thumb.removeEventListener('pointercancel', end);
    };
    thumb.addEventListener('pointermove', move);
    thumb.addEventListener('pointerup', end);
    thumb.addEventListener('pointercancel', end);
  }

  // tap the track: center the thumb there
  function jumpTo(event: PointerEvent) {
    const el = body.value;
    if (!el) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const t = (event.clientY - rect.top - bar.thumbHeight / 2) / Math.max(rect.height - bar.thumbHeight, 1);
    el.scrollTop = Math.min(1, Math.max(0, t)) * (el.scrollHeight - el.clientHeight);
  }

  // the typewriter grows the text, and the card resizes as it opens
  let observer: ResizeObserver | undefined;
  onMounted(() => {
    observer = new ResizeObserver(syncBar);
    if (content.value) observer.observe(content.value);
    if (body.value) observer.observe(body.value);
  });
  onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
  @keyframes expand {
    0% {
      opacity: 0;
      width: 0px;
      height: 0px;
    }
    40% {
      opacity: 1;
      width: 1000px;
      height: 0px;
    }
    100% {
      width: 1000px;
      height: 1000px;
    }
  }
  .dialog-card {
    position: relative;
    background: black;
    color: white;
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
    line-height: 1.8;

    background: linear-gradient(to bottom, rgba(64, 64, 64, 0.8), rgba(0, 0, 0, 0.8));
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 0px;
    backdrop-filter: blur(10px);
    color: white;
    max-width: 500px;
    max-height: 550px;
    /* Card itself doesn't scroll: header and Go button sit fixed in the flex
       column and only the content <section> scrolls (see rules below). */
    overflow: hidden;
    animation: expand 1s ease forwards;
    transition: background 0.3s ease;
  }

  /* Transparent override */
  .dialog-card.is-transparent {
    background: linear-gradient(to bottom, rgba(64, 64, 64, 0.4), rgba(0, 0, 0, 0.4));
    backdrop-filter: blur(4px); /* Reduce blur slightly for transparency feel */
  }

  .dialog-card[open] {
    display: flex;
    flex-direction: column;
  }

  /* Full size override */
  .dialog-card.is-full-size {
    max-height: 800px;
    overflow: hidden;
  }

  /* Fixed title row: never shrinks or scrolls. */
  .dialog-card > header {
    flex: 0 0 auto;
  }

  /* Content section: the only scrollable region (header and Go stay fixed).
     min-height: 0 lets these flex items shrink so .body actually scrolls. */
  .dialog-card > section {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
  }

  .body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain; /* a flick at the end doesn't scroll the page */
    scrollbar-width: none; /* the .scrollbar below replaces the native one */
  }
  .body::-webkit-scrollbar {
    display: none;
  }

  /* Pixel scrollbar: hard-edged bevel blocks in the Go button's blue. Shown only
     while the text overflows (.is-idle hides it; stage-select's phone sheet
     keeps the track showing). */
  .scrollbar {
    position: relative;
    flex: none;
    width: 12px;
    margin: 0 8px 0 8px; /* gap from the text, and off the card's edge */
    background: rgba(0, 0, 0, 0.6);
    box-shadow: inset 2px 0 0 #404040;
    touch-action: none; /* dragging it shouldn't scroll the page */
    cursor: pointer;
  }

  /* wider invisible hit area for fingers */
  .scrollbar::before {
    content: '';
    position: absolute;
    inset: 0 -10px;
  }

  .scrollbar.is-idle {
    visibility: hidden;
  }

  .thumb {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    box-sizing: border-box;
    background: #00aaff;
    border: 2px solid black;
    box-shadow:
      inset 2px 2px 0 #ccf2fd,
      inset -2px -2px 0 #0067a3;
    cursor: grab;
  }

  .thumb:hover {
    background: #47c2ff;
  }

  .scrollbar.is-idle .thumb {
    display: none;
  }

  .dialog-card.size-sm.is-full-size {
    max-width: 650px;
    max-height: 800px;
    height: 100%;
    margin: 0;
  }

  .dialog-card.size-sm:not(.is-full-size) {
    max-width: 650px;
    max-height: 350px;
    margin: 0;
  }

  @keyframes typing {
    from {
      width: 0;
    }
    to {
      width: 100%;
    }
  }

  .type-writer {
    margin: 1rem;
  }

  header .type-writer {
    font-size: 125%;
    background: linear-gradient(to bottom, #fe9900 0%, #fe9900 25%, #f9e5bd 50%, #ff9900 100%);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  header .type-writer.blue {
    font-size: 125%;
    background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
    background-clip: text; /* Standard property */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Fixed CTA row below the scrollable content (a flex item, not absolute), so
     it sits under the description and never overlaps it. */
  .retro-button {
    flex: 0 0 auto;
    align-self: flex-end;
    /* room for the selected bracket (inset -6px) inside the card's overflow clip */
    margin-right: 1rem;
  }
  /* phones: tighter Go button so the sheet's text keeps more room */
  @media (max-width: 767px) {
    .retro-button .type-writer {
      margin: 4px;
    }
  }

  /* long words (accomplishments.) wrap instead of scrolling sideways in narrow cards */
  section .type-writer {
    overflow-wrap: anywhere;
  }
</style>
