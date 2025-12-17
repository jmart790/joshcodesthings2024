<template>
  <dialog :open="isOpen" class="dialog-card" :class="`size-${size}`">
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
    </section>
    <RetroButton @click.stop="$emit('go-to-stage')" v-if="size !== 'sm'">
      <TypeWriter class="type-writer" v-if="isOpen" :delay="2500" :speed="10" text="Go!" />
    </RetroButton>
  </dialog>
</template>

<script setup lang="ts">
  import TypeWriter from './TypeWriter.vue';
  import RetroButton from './RetroButton.vue';
  const props = withDefaults(
    defineProps<{
      isOpen: boolean;
      name: string;
      desc: string;
      size: string;
      isNameBlue?: boolean;
    }>(),
    {
      isNameBlue: false
    }
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
    overflow: auto;
    animation: expand 1s ease forwards;
  }

  .dialog-card.size-sm {
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
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  header .type-writer.blue {
    font-size: 125%;
    background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .retro-button {
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    margin-left: auto;
  }
</style>
