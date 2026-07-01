<template>
  <div class="stage-select">
    <div class="home-button">
      <RetroButton @click="$router.push('/')">< Menu</RetroButton>
    </div>
    <SphereGrid class="sphere-grid" />
    <div class="slider-container" :class="{ 'is-in': isSliderIn }">
      <Slider
        :items="characters"
        :activeIndex="activeIndex"
        :positionOffset="positionOffset"
        :isSelected="isSelected"
        :transitionDuration="transitionDuration"
        :transitionTiming="transitionTiming"
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
  import { computed, ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import SphereGrid from '../components/stage-select/SphereGrid.vue';
  import Slider from '../components/stage-select/Slider.vue';
  import ScrambleText from '../components/shared/ScrambleText.vue';
  import DialogCard from '../components/shared/DialogCard.vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import { characters as allCharacters } from '../constants/characters';
  import { moshmanUnlocked } from '../state/progress';

  const route = useRoute();
  const router = useRouter();
  const MOSHMAN_ID = 6;
  const characters = computed(() =>
    allCharacters.map((character) =>
      character.id === MOSHMAN_ID
        ? {
            ...character,
            disabled: !moshmanUnlocked.value
          }
        : character
    )
  );

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
  const isSliderIn = ref(false);
  const isModelVisible = ref(false);
  const isTextVisible = ref(false);

  const focusCharacterById = (characterId: number) => {
    const characterIndex = characters.value.findIndex((character) => character.id === characterId);
    if (characterIndex === -1) return false;

    activeIndex.value = characterIndex;
    positionOffset.value = 1 - characterIndex;
    return true;
  };

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
    const shouldFocusMoshman = route.query.active === 'moshman';

    if (shouldFocusMoshman) {
      focusCharacterById(MOSHMAN_ID);
    } else {
      // Start spinning immediately
      spinToRandomCharacter();
    }

    // Animate in from top (drop-in via transform on .slider-container)
    setTimeout(() => {
      isSliderIn.value = true;
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
    --cta-button-font-size: 24px;

    position: relative;
    background-color: #d2d2d2;
    background: radial-gradient(circle, #d2d2d2, #020c29);
    /* clip, not hidden: the sphere-grid overflows (height: 200%), and `hidden`
       leaves a scroll container that the dialog's focus quietly scrolls and
       leaves stuck. `clip` clips identically without a scrollable box. */
    overflow: clip;
  }

  .stage-select :deep(.retro-button) {
    font-size: var(--cta-button-font-size);
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
    align-items: center;
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
    --scramble-font-size: 100px;
    --scramble-letter-spacing: 0.25rem;
    --scramble-text-shadow: -6px 6px black;
    --scramble-stroke-width: 2px;

    position: absolute;
    left: 0;
    bottom: 0;
    margin: 1rem;
    max-width: calc(100vw - 2rem);
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

  /* Shorten the card so the description scrolls in its own region (title stays
     on top, Go sits below) instead of running the full card height. */
  .char-desc :deep(.dialog-card) {
    max-height: 360px;
  }

  .slider-container {
    width: 100%;
    height: 100vh;
    text-align: center;
    overflow: hidden;
    position: relative;
    z-index: 2;
    /* drop-in: start above the viewport, slide to rest. Using transform (not
       top) keeps .slider's top free for per-viewport tuning in Slider.vue. */
    transform: translateY(-100vh);
    transition: transform 1s ease-out;
  }

  .slider-container.is-in {
    transform: translateY(0);
  }

  /* desktop-lg: mirrors --breakpoint-desktop-lg */
  @media (max-width: 1600px) {
    .char-name {
      bottom: 5rem;
    }
  }

  /* desktop: mirrors --breakpoint-desktop */
  @media (max-width: 1200px) {
    .char-name {
      --scramble-font-size: clamp(54px, 7vw, 88px);
      --scramble-letter-spacing: clamp(0.08rem, 0.3vw, 0.2rem);
      --scramble-text-shadow: -4px 4px black;
      --scramble-stroke-width: 1.5px;
    }
  }

  /* tablet: mirrors --breakpoint-tablet */
  @media (max-width: 720px) {
    .stage-select {
      --cta-button-font-size: clamp(14px, 4vw, 20px);
    }

    .buttons {
      bottom: 1rem;
      right: 1rem;
      gap: 0.5rem;
    }

    .select-button {
      margin-left: 1rem;
    }

    .char-name {
      --scramble-font-size: clamp(40px, 9vw, 58px);
      --scramble-letter-spacing: 0.06rem;
      --scramble-text-shadow: -3px 3px black;
      --scramble-stroke-width: 1px;

      bottom: 4.5rem;
    }
  }

  /* small screens: description shows as a straight, centered modal (same expand
     animation as desktop/tablet, just without the angled rotateY). The selected
     character card stays in place behind it (see SlideItem.vue); Deselect
     closes it. ponytail: 768px = "mobile" per the design. */
  @media (max-width: 768px) {
    .char-desc {
      right: auto;
      bottom: auto;
      left: 50%;
      top: 50%;
      width: min(90vw, 500px);
      height: auto;
      max-height: 70vh;
      transform: translate(-50%, -50%);
      z-index: 200;
    }

    .char-desc :deep(.dialog-card) {
      max-width: 100%;
      max-height: 70vh;
    }
  }

  /* mobile→tablet band: shrink the description card text slightly. font-size on
     the card scales the header (125%) and Go button along with the body. */
  @media (min-width: 481px) and (max-width: 720px) {
    .char-desc :deep(.dialog-card) {
      font-size: 0.9rem;
    }
  }

  /* mobile: mirrors --breakpoint-mobile */
  @media (max-width: 480px) {
    .home-button {
      top: 1rem;
      left: 1rem;
    }

    .buttons {
      bottom: 1rem;
      right: 1rem;
    }

    .char-name {
      --scramble-font-size: clamp(24px, 9vw, 40px);
      --scramble-letter-spacing: 0.03rem;
      --scramble-text-shadow: -2px 2px black;

      bottom: 4rem;
    }
  }
</style>
