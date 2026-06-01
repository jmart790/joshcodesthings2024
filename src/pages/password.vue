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
  import PasswordGridButton from '../components/password/PasswordGridButton.vue';
  import PasswordGridFrame from '../components/password/PasswordGridFrame.vue';
  import RetroButton from '../components/shared/RetroButton.vue';
  import { unlockMoshman } from '../state/progress';

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
    'A',
    '?',
    '?',
    '?',
    '?',
    '?',
    '?',
    '?'
  ];

  // 4x4 Grid = 16 cells
  const gridState = ref(new Array(16).fill(0));
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
      console.log('PASSWORD ACCEPTED');
    } else {
      validationStatus.value = 'error';
      console.log('ACCESS DENIED');
    }
  };

  const resetGrid = () => {
    gridState.value = new Array(16).fill(0); // Reset to '?' (index 0)
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
    font-size: 24px;
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
</style>
