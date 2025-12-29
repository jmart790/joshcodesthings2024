<template>
  <div class="default-layout">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,100..900;1,100..900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  .default-layout {
    min-height: 100vh;
    width: 100%;
    background-color: #101115;
    background-image: radial-gradient(circle at center, transparent 60%, #000000b1 100%),
      linear-gradient(rgba(19, 202, 58, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(19, 202, 58, 0.1) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    background-position: center;
  }
</style>
