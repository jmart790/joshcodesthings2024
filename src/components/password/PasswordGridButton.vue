<template>
  <button
    type="button"
    class="grid-cell"
    :class="{ active: isActive, success: status === 'success', error: status === 'error' }"
  >
    <div class="cell-content">
      <svg
        v-if="isArrow || status === 'success' || status === 'error'"
        class="pixel-arrow"
        viewBox="0 0 11 11"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="arrow-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#02a7f9" />
            <stop offset="25%" stop-color="#47c2ff" />
            <stop offset="50%" stop-color="#ccf2fd" />
            <stop offset="100%" stop-color="#00aaff" />
          </linearGradient>
          <linearGradient id="success-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#00ff00" />
            <stop offset="100%" stop-color="#00cc00" />
          </linearGradient>
          <linearGradient id="error-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#ff0000" />
            <stop offset="100%" stop-color="#cc0000" />
          </linearGradient>
        </defs>

        <!-- ARROWS -->
        <path
          v-if="status === 'neutral' && label === 'UP'"
          d="M 5 1 H 6 V 3 H 7 V 5 H 8 V 7 H 9 V 9 H 10 V 10 H 1 V 9 H 2 V 7 H 3 V 5 H 4 V 3 H 5 Z"
          class="arrow-path"
          shape-rendering="crispEdges"
        />

        <path
          v-if="status === 'neutral' && label === 'DOWN'"
          d="M 5 10 H 6 V 8 H 7 V 6 H 8 V 4 H 9 V 2 H 10 V 1 H 1 V 2 H 2 V 4 H 3 V 6 H 4 V 8 H 5 Z"
          class="arrow-path"
          shape-rendering="crispEdges"
        />

        <path
          v-if="status === 'neutral' && label === 'LEFT'"
          d="M 1 5 V 6 H 3 V 7 H 5 V 8 H 7 V 9 H 9 V 10 H 10 V 1 H 9 V 2 H 7 V 3 H 5 V 4 H 3 V 5 Z"
          class="arrow-path"
          shape-rendering="crispEdges"
        />

        <path
          v-if="status === 'neutral' && label === 'RIGHT'"
          d="M 10 5 V 6 H 8 V 7 H 6 V 8 H 4 V 9 H 2 V 10 H 1 V 1 H 2 V 2 H 4 V 3 H 6 V 4 H 8 V 5 Z"
          class="arrow-path"
          shape-rendering="crispEdges"
        />

        <!-- SUCCESS CHECK MARK -->
        <path
          v-if="status === 'success'"
          d="M 2 5 H 4 V 6 H 2 Z M 3 6 H 5 V 7 H 3 Z M 4 7 H 6 V 8 H 4 Z M 5 6 H 7 V 7 H 5 Z M 6 5 H 8 V 6 H 6 Z M 7 4 H 9 V 5 H 7 Z M 8 3 H 10 V 4 H 8 Z M 9 2 H 11 V 3 H 9 Z"
          class="success-path"
          shape-rendering="crispEdges"
          style="fill: url(#success-gradient)"
        />

        <!-- ERROR X MARK -->
        <path
          v-if="status === 'error'"
          d="M 2 2 H 4 V 3 H 5 V 4 H 6 V 3 H 8 V 2 H 9 V 3 H 8 V 4 H 7 V 5 H 8 V 6 H 9 V 7 H 8 V 8 H 6 V 7 H 5 V 6 H 4 V 7 H 2 V 8 H 1 V 7 H 2 V 6 H 3 V 5 H 2 V 4 H 1 V 3 H 2 V 2"
          class="error-path"
          shape-rendering="crispEdges"
          style="fill: url(#error-gradient)"
        />
      </svg>
      <span v-else>{{ label }}</span>
    </div>
    <div class="active-border"></div>
  </button>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: 'neutral', // 'neutral', 'success', 'error'
      validator: (value) => ['neutral', 'success', 'error'].includes(value)
    }
  });

  const isArrow = computed(() => ['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(props.label));
</script>

<style scoped>
  @keyframes fade-in-button {
    from {
      opacity: 0;
      transform: scale(0.5);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .grid-cell {
    width: var(--button-size, 132px);
    height: var(--button-size, 132px);
    box-sizing: border-box;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    outline: none;
    image-rendering: pixelated;
    border-radius: 6px;
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
    background: linear-gradient(135deg, #e0f7fa 0%, #80deea 50%, #00acc1 100%);
    box-shadow: inset 2px 2px 5px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.2),
      4px 4px 6px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    /* Animation Stagger */
    opacity: 0;
    animation: fade-in-button 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: var(--delay, 0s);
  }

  /* Default Blue Gradient */
  .grid-cell::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    z-index: 1;
    background: linear-gradient(180deg, #d0e0f0 0%, #a0bcd0 50%, #809cb0 100%);
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.7), inset -2px -2px 0 rgba(50, 70, 90, 0.6), 0 0 0 1px #405060;
  }

  /* Success Green Gradient */
  .grid-cell.success::before {
    background: linear-gradient(180deg, #d0f0d0 0%, #a0d0a0 50%, #80b080 100%);
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.7), inset -2px -2px 0 rgba(40, 90, 40, 0.6), 0 0 0 1px #306030;
  }

  /* Error Red Gradient */
  .grid-cell.error::before {
    background: linear-gradient(180deg, #f0d0d0 0%, #d0a0a0 50%, #b08080 100%);
    box-shadow: inset 2px 2px 0 rgba(255, 255, 255, 0.7), inset -2px -2px 0 rgba(90, 40, 40, 0.6), 0 0 0 1px #603030;
  }

  .grid-cell::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 25px;
    height: 25px;
    z-index: 2;
    pointer-events: none;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.8) 40%,
      transparent 41%,
      transparent 100%
    );
    border-top-left-radius: 4px;
    opacity: 0.6;
  }

  .grid-cell:active {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  }

  .grid-cell:active::before {
    background: linear-gradient(180deg, #b0c0d0 0%, #809cb0 50%, #607c90 100%);
    box-shadow: inset 2px 2px 0 rgba(0, 0, 0, 0.2), inset -2px -2px 0 rgba(255, 255, 255, 0.3), 0 0 0 1px #405060;
  }

  /* Text/Icon Content */
  .cell-content {
    position: relative;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
    font-size: calc(var(--button-size, 132px) * 0.295);
    line-height: 1;
    background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(2px 2px 0px black) drop-shadow(2px 2px 2px black);
  }

  .grid-cell.success .cell-content {
    background: linear-gradient(to bottom, #00ff00 0%, #47ff47 50%, #ccffcc 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .grid-cell.error .cell-content {
    background: linear-gradient(to bottom, #ff0000 0%, #ff4747 50%, #ffcccc 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pixel-arrow {
    width: calc(var(--button-size, 132px) * 0.44);
    height: calc(var(--button-size, 132px) * 0.44);
  }

  .arrow-path {
    fill: url(#arrow-gradient);
  }

  .active-border {
    position: absolute;
    inset: -6px;
    pointer-events: none;
    display: none;
    z-index: 10;
  }

  .grid-cell.active .active-border,
  .grid-cell:active .active-border {
    display: block;
    background: linear-gradient(#ffcc00, #ffcc00) top left, linear-gradient(#ffcc00, #ffcc00) top left,
      linear-gradient(#ffcc00, #ffcc00) top right, linear-gradient(#ffcc00, #ffcc00) top right,
      linear-gradient(#ffcc00, #ffcc00) bottom right, linear-gradient(#ffcc00, #ffcc00) bottom right,
      linear-gradient(#ffcc00, #ffcc00) bottom left, linear-gradient(#ffcc00, #ffcc00) bottom left;
    background-size: 15px 3px, 3px 15px, 15px 3px, 3px 15px, 15px 3px, 3px 15px, 15px 3px, 3px 15px;
    background-repeat: no-repeat;
    animation: flashBracket 0.2s step-end infinite alternate;
  }

  @keyframes flashBracket {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
