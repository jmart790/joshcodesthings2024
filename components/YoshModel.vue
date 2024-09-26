<template>
  <div 
    class="yosh-model" 
  />
</template>

<script setup lang="ts">
</script>

<style scoped>
.yosh-model {
  background-image: url('/yoshmodel.webp');
  width: 900px;
  height: 95vh;
  position: absolute;
  top: -35%;
  left: 50%;
  transform: translateX(-50%) rotateX(16deg) rotateY(-16deg);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top center;
  z-index: 5;
}
</style>