<template>
  <div class="password-page">
    <div class="back-button">
      <RetroButton @click="$router.push('/')">&lt; Back</RetroButton>
    </div>
    <div class="retro-container">
      <PasswordGridFrame @submit="submitPassword">
        <PasswordGridButton
          v-for="(value, index) in gridState"
          :key="index"
          ref="gridButtons"
          :label="options[value]"
          :is-active="activeIndex === index"
          :status="validationStatus || 'neutral'"
          :style="{ '--delay': 0.6 + index * 0.05 + 's' }"
          @click="toggleCell(index)"
          @focus="activeIndex = index"
          @blur="activeIndex = null"
          @mouseenter="activeIndex = index"
        />

        <template #footer>
          <div class="footer-content">
            <RetroButton
              v-show="isDirty || validationStatus"
              class="footer-btn reset-btn"
              type="button"
              @click="resetGrid"
            >
              RESET
            </RetroButton>
            <RetroButton class="footer-btn enter-btn" type="submit">ENTER</RetroButton>
          </div>
        </template>
      </PasswordGridFrame>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import PasswordGridButton from '../components/password/PasswordGridButton.vue';
  import PasswordGridFrame from '../components/password/PasswordGridFrame.vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import { unlockMoshman } from '../state/progress';

  const router = useRouter();

  // Options for the grid cells
  const options = ['?', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'A', 'B', 'X', 'Y', 'L', 'R'];
  const correctPassword = [
    'UP',
    'UP',
    'DOWN',
    'DOWN',
    'LEFT',
    'RIGHT',
    'A',
    'B',
    'A'
  ];

  const GRID_CELL_COUNT = 9;
  const createEmptyGrid = () => new Array(GRID_CELL_COUNT).fill(0);

  // 3x3 Grid = 9 cells
  const gridState = ref(createEmptyGrid());
  const activeIndex = ref(0); // Start with first valid index
  const gridButtons = ref([]);

  // Form State
  const isDirty = ref(false);
  const validationStatus = ref(null); // null, 'success', 'error'

  const toggleCell = (index) => {
    // If we have a validation result (success/error), reset it on interaction so user can try again
    if (validationStatus.value) {
      validationStatus.value = null;
    }

    isDirty.value = true;
    activeIndex.value = index;
    gridState.value[index] = (gridState.value[index] + 1) % options.length;
  };

  const submitPassword = () => {
    const currentValues = gridState.value.map((i) => options[i]);

    // Check if every value matches
    const isCorrect = currentValues.every((val, index) => val === correctPassword[index]);

    if (isCorrect) {
      validationStatus.value = 'success';
      unlockMoshman();
      setTimeout(() => {
        router.push({ path: '/stage-select', query: { active: 'moshman' } });
      }, 1000);
      console.log('PASSWORD ACCEPTED');
    } else {
      validationStatus.value = 'error';
      console.log('ACCESS DENIED');
    }
  };

  const resetGrid = () => {
    gridState.value = createEmptyGrid(); // Reset to '?' (index 0)
    validationStatus.value = null;
    isDirty.value = false;
    activeIndex.value = 0; // Optional: focus first
  };

  onMounted(async () => {
    await nextTick();
    if (gridButtons.value.length > 0) {
      const firstBtn = gridButtons.value[0];
      if (firstBtn && firstBtn.$el) {
        firstBtn.$el.focus();
      }
    }
  });
</script>

<style scoped>
  .password-page {
    --cta-button-font-size: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: #fff;
    font-family: monospace;
    padding: 20px;
  }

  .back-button {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    z-index: 100;
  }

  .retro-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .password-page :deep(.retro-button) {
    font-size: var(--cta-button-font-size);
  }

  .header {
    font-size: 2rem;
    color: #fff;
    text-shadow: 2px 2px 0 #000;
    margin-bottom: 2rem;
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  /* Animations */
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* FOOTER ROW */
  /* Note: The GridFrame component provides the container .grid-footer */

  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding-right: 10px; /* Balance the padding-left from container if needed */
  }

  /* Button Styling */
  .footer-btn {
    margin: 0;
  }

  .reset-btn {
    /* Optional: make it red or distinct? User didn't specify, standard retro button is fine */
  }

  .enter-btn {
    margin-left: auto;
    opacity: 0;
    animation: fade-in 0.5s ease forwards;
    animation-delay: 1.7s; /* 0.6s (frame) + 0.8s (buttons approx) + buffer */
  }

  @media (max-width: 720px) {
    .password-page {
      --cta-button-font-size: clamp(14px, 4vw, 20px);

      padding: 16px;
    }

    .footer-content {
      padding-right: clamp(4px, 1.4vw, 10px);
    }
  }

  @media (max-width: 480px) {
    .password-page {
      padding: 12px;
    }

    .back-button {
      bottom: 1rem;
      left: 1rem;
    }
  }
</style>
