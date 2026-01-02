<template>
  <button class="carousel-control-btn" :title="title">
    <RetroIcon :name="icon" />
    <div class="active-border"></div>
  </button>
</template>

<script setup lang="ts">
  import RetroIcon from '../shared/RetroIcon.vue';

  defineProps<{
    icon: 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'rotate-cw' | 'rotate-ccw';
    title?: string;
  }>();
</script>

<style scoped>
  .carousel-control-btn {
    width: 50px;
    height: 50px;
    background: rgba(0, 20, 40, 0.8);
    border: 2px solid #6edcd9;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.1s;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    position: relative;
    outline: none;
  }

  .carousel-control-btn:hover {
    background: rgba(0, 100, 150, 0.8);
    transform: scale(1.1);
    box-shadow: 0 0 15px #6edcd9;
  }

  .carousel-control-btn:active {
    transform: scale(0.9);
    background: #6edcd9;
    /* Icon internal color handling relies on RetroIcon implementation */
  }

  /* Blinking Corner Border */
  .active-border {
    position: absolute;
    inset: -6px;
    pointer-events: none;
    display: none;
    z-index: 10;
  }

  .carousel-control-btn:focus-visible .active-border {
    display: block;
    background: linear-gradient(#ffcc00, #ffcc00) top left, linear-gradient(#ffcc00, #ffcc00) top left,
      linear-gradient(#ffcc00, #ffcc00) top right, linear-gradient(#ffcc00, #ffcc00) top right,
      linear-gradient(#ffcc00, #ffcc00) bottom right, linear-gradient(#ffcc00, #ffcc00) bottom right,
      linear-gradient(#ffcc00, #ffcc00) bottom left, linear-gradient(#ffcc00, #ffcc00) bottom left;
    background-size: 10px 3px, 3px 10px, 10px 3px, 3px 10px, 10px 3px, 3px 10px, 10px 3px, 3px 10px;
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
