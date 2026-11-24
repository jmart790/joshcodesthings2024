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
    <section>
      <TypeWriter class="type-writer" v-if="isOpen" :delay="1000" :speed="10" :text="desc" />
      <slot></slot>
    </section>
    <!-- The card's only CTA: show it highlighted and focused on open, so Enter goes. -->
    <RetroButton ref="cta" selected @click.stop="$emit('go-to-stage')" v-if="isDisabled ? false : size !== 'sm'">
      <TypeWriter class="type-writer" v-if="isOpen" :delay="0" :speed="10" text="Go!" />
    </RetroButton>
  </dialog>
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue';
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

  /* Content Section: the only scrollable region. min-height: 0 lets this flex
     item shrink below its content so overflow-y actually scrolls. */
  .dialog-card > section {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    /* breathing room between the text and the scrollbar */
    padding-right: 0.5rem;
    display: flex;
    flex-direction: column;
  }

  /* Pixel scrollbar: hard-edged bevel blocks in the Go button's blue. Styling
     ::-webkit-scrollbar also opts out of macOS overlay scrollbars, so it stays
     visible whenever the content overflows. Don't add scrollbar-color/width
     here: in Chromium they override these pseudo-elements. */
  .dialog-card ::-webkit-scrollbar {
    width: 12px;
  }
  .dialog-card ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.6);
    box-shadow: inset 2px 0 0 #404040;
  }
  .dialog-card ::-webkit-scrollbar-thumb {
    background: #00aaff;
    border: 2px solid black;
    border-radius: 0;
    box-shadow:
      inset 2px 2px 0 #ccf2fd,
      inset -2px -2px 0 #0067a3;
  }
  .dialog-card ::-webkit-scrollbar-thumb:hover {
    background: #47c2ff;
  }
  /* Firefox has no scrollbar pseudo-elements; closest match. */
  @supports not selector(::-webkit-scrollbar) {
    .dialog-card > section {
      scrollbar-color: #00aaff rgba(0, 0, 0, 0.6);
    }
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
  @media (max-width: 768px) {
    section .type-writer {
      overflow: auto;
    }
  }
</style>
