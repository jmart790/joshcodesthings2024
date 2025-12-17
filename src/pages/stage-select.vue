<template>
  <div class="stage-select">
    <div class="home-button">
      <RetroButton @click="$router.push('/')">< Menu</RetroButton>
    </div>
    <SphereGrid class="sphere-grid" />
    <div class="slider-container">
      <Slider
        :items="characters"
        :activeIndex="activeIndex"
        :positionOffset="positionOffset"
        :isSelected="isSelected"
      />
    </div>
    <div class="char-name">
      <ScrambleText :text="characters[activeIndex].name" />
    </div>
    <div class="buttons">
      <RetroButton @click="prev">Prev</RetroButton>
      <RetroButton @click="next">Next</RetroButton>
      <RetroButton class="select-button" @click="select">{{ isSelected ? 'Deselect' : 'Select' }}</RetroButton>
    </div>
    <div class="char-desc">
      <DialogCard
        :isOpen="isSelected"
        :name="characters[activeIndex].name"
        :desc="characters[activeIndex].desc"
        size="md"
        @go-to-stage="navToCharPage"
        :is-name-blue="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import SphereGrid from '../components/stage-select/SphereGrid.vue';
  import Slider from '../components/stage-select/Slider.vue';
  import ScrambleText from '../components/shared/ScrambleText.vue';
  import DialogCard from '../components/shared/DialogCard.vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import { characters as allCharacters } from '../constants/characters';

  const router = useRouter();
  const characters = ref(allCharacters);

  const activeIndex = ref(0);
  const isSelected = ref(false);
  const positionOffset = ref(1);

  const prev = () => {
    positionOffset.value += 1;
    activeIndex.value = (activeIndex.value - 1 + characters.value.length) % characters.value.length;
  };

  const next = () => {
    positionOffset.value -= 1;
    activeIndex.value = (activeIndex.value + 1) % characters.value.length;
  };

  const select = () => {
    isSelected.value = !isSelected.value;
  };

  const navToCharPage = () => {
    const route = characters.value[activeIndex.value].page;
    router.push(route);
  };
</script>

<style scoped>
  .stage-select {
    position: relative;
    background-color: #d2d2d2;
    background: radial-gradient(circle, #d2d2d2, #020c29);
    overflow: hidden;
  }
  .sphere-grid {
    position: absolute;
    inset: -30% 0 0 0;
    height: 200%;
  }

  .buttons {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    gap: 1rem;
    z-index: 5;
  }

  .select-button {
    margin-left: 3rem;
  }

  .home-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 100;
  }

  .char-name {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 1rem;
  }

  .char-desc {
    position: absolute;
    right: 10%;
    bottom: 20%;
    z-index: 100;
    height: 550px;
    width: 500px;
    transform: perspective(1000px) rotateY(-40deg) rotateX(0deg);
    transform-origin: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .slider-container {
    width: 100%;
    height: 100vh;
    text-align: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
  }
</style>
