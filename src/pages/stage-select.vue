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
        :transitionDuration="transitionDuration"
        :transitionTiming="transitionTiming"
        :style="{ top: sliderTop }"
        :showModel="isModelVisible"
      />
    </div>
    <div class="char-name" v-if="isTextVisible">
      <ScrambleText :text="characters[activeIndex].disabled ? DISABLED_CHAR_NAME : characters[activeIndex].name" />
    </div>
    <div class="buttons">
      <RetroButton @click="prev">Prev</RetroButton>
      <RetroButton @click="nextManually">Next</RetroButton>
      <RetroButton class="select-button" @click="select">{{ isSelected ? 'Deselect' : 'Select' }}</RetroButton>
    </div>
    <div class="char-desc">
      <DialogCard
        size="md"
        :isOpen="isSelected"
        :name="characters[activeIndex].disabled ? DISABLED_CHAR_NAME : characters[activeIndex].name"
        :desc="characters[activeIndex].disabled ? DISABLED_CHAR_DESC : characters[activeIndex].desc"
        :is-name-blue="false"
        :is-disabled="characters[activeIndex].disabled"
        @go-to-stage="navToCharPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
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
  const isSpinning = ref(false);

  const DEFAULT_TRANSITION_DURATION = 500;
  const SLIDER_IN_DELAY = 100;
  const TEXT_SHOW_DELAY = 1500;
  const MODEL_SHOW_DELAY = 2000;
  const DISABLED_CHAR_DESC = '... ..... .... ... ....... ... .... ..... .... .... ......... . . .';
  const DISABLED_CHAR_NAME = '????????';

  const transitionDuration = ref(DEFAULT_TRANSITION_DURATION);

  const transitionTiming = ref('ease');
  const sliderTop = ref('-100vh');
  const isModelVisible = ref(false);
  const isTextVisible = ref(false);

  const prev = () => {
    if (isSpinning.value) return;
    transitionDuration.value = DEFAULT_TRANSITION_DURATION;
    transitionTiming.value = 'ease';
    positionOffset.value += 1;
    activeIndex.value = (activeIndex.value - 1 + characters.value.length) % characters.value.length;
  };

  const next = () => {
    positionOffset.value -= 1;
    activeIndex.value = (activeIndex.value + 1) % characters.value.length;
  };

  const nextManually = () => {
    if (isSpinning.value) return;
    transitionDuration.value = DEFAULT_TRANSITION_DURATION;
    transitionTiming.value = 'ease';
    next();
  };

  const select = () => {
    if (isSpinning.value) return;
    isSelected.value = !isSelected.value;
  };

  const navToCharPage = () => {
    const route = characters.value[activeIndex.value].page;
    router.push(route);
  };

  const spinToRandomCharacter = async () => {
    isSpinning.value = true;
    const rotationAmmount = 2;
    const randomIndex = Math.floor(Math.random() * characters.value.length);
    // Ensure at least 2 full rotations (2 * length) plus the distance to the target
    const currentIdx = activeIndex.value;
    const distance = (randomIndex - currentIdx + characters.value.length) % characters.value.length;
    const totalSteps = characters.value.length * rotationAmmount + distance;

    let step = 0;

    const animateStep = () => {
      if (step >= totalSteps) {
        isSpinning.value = false;
        // Reset to default for manual interaction
        transitionDuration.value = DEFAULT_TRANSITION_DURATION;
        transitionTiming.value = 'ease';
        return;
      }

      // Interactive ease-out curve
      // Start fast (small delay), end slow (large delay)
      const progress = step / totalSteps;
      const delay = 40 + 450 * Math.pow(progress, 5); // Faster start, steeper curve

      // Update transition settings to match the speed of this step
      // Add a small buffer (e.g. 1.2x) to ensure the transition doesn't finish before the next step triggers
      // This prevents micro-stutters where the animation stops briefly
      transitionDuration.value = delay * 1.2;
      transitionTiming.value = 'linear';

      // If this is the last step, use ease-out for a smooth final stop
      if (step === totalSteps - 1) {
        transitionTiming.value = 'ease-out';
        transitionDuration.value = delay; // Let it take the full calculated time (slower)
      }

      next();
      step++;

      setTimeout(animateStep, delay);
    };

    animateStep();
  };

  onMounted(() => {
    // Start spinning immediately
    spinToRandomCharacter();

    // Animate in from top
    setTimeout(() => {
      sliderTop.value = '20%';
    }, SLIDER_IN_DELAY);

    // Show text after slide animation (100ms delay + 1s transition)
    setTimeout(() => {
      isTextVisible.value = true;
    }, TEXT_SHOW_DELAY);

    // Fade in YoshModel after entry animation (1s duration + buffer)
    setTimeout(() => {
      isModelVisible.value = true;
    }, MODEL_SHOW_DELAY);
  });
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
    right: 7%;
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
