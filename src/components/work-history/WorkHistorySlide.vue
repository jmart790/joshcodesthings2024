<template>
  <article class="slide">
    <div class="dialog-container">
      <DialogCard is-open name="Yosh" :desc="yoshText" size="sm" is-name-blue />
    </div>
    <div class="dialog-container">
      <DialogCard :is-open="historyManOpen" name="History Man" :desc="historyManText" size="sm" />
    </div>
    <picture class="slide-image left" :class="`left-${index}`">
      <img :src="yoshImage" alt="Yosh Slide Image" />
    </picture>

    <picture class="slide-image right" :class="`right-${index}`">
      <img :src="historyManImage" alt="HistoryMan Slide Image" />
    </picture>
  </article>
</template>

<script setup lang="ts">
  import DialogCard from '../shared/DialogCard.vue';

  defineProps<{
    index: number;
    yoshImage: string;
    historyManImage: string;
    yoshText: string;
    historyManText: string;
    historyManOpen: boolean;
  }>();
</script>

<style scoped>
  .slide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: flex-end;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    position: relative;
  }

  .slide-image {
    display: flex;
    animation: fadeInFromLeft ease-in;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 11;
  }

  .slide-image.right {
    animation: fadeInFromRight ease-in;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
  }

  @keyframes fadeInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  @keyframes fadeInFromRight {
    from {
      opacity: 0;
      transform: translateX(25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  .slide-image img {
    position: absolute;
    bottom: 9%;
    width: auto;
    height: 50%;
    z-index: 1000;
  }

  .slide-image.left img {
    height: 50%;
  }
  .slide-image.right img {
    height: 55%;
    bottom: 7%;
    right: 25%;
  }

  .slide-image.left-0 img {
    left: 25%;
    transform: scaleX(-1);
  }
  .slide-image.left-1 img {
    bottom: 10%;
    left: 50%;
  }

  .slide-image.left-2 img {
    bottom: 7%;
    left: 30%;
    transform: scaleX(-1);
  }

  .slide-image.left-3 img {
    bottom: 7%;
    left: 10%;
  }

  .slide-image.left-4 img {
    bottom: 25%;
    left: 30%;
  }
  .slide-image.left-5 img {
    left: 50%;
  }
  .slide-image.left-6 img {
    left: 40%;
    bottom: 25%;
    transform: rotate(-15deg) scale(1.1);
  }
  .slide-image.right-1 img {
    right: 45%;
  }

  .slide-image.right-5 img {
    right: 40%;
  }
  .slide-image.right-6 img {
    right: 15%;
    bottom: 10%;
    transform: scale(0.9);
  }
  .dialog-container {
    position: absolute;
    top: 10%;
    left: 2%;
    transform: perspective(1000px) rotateY(23deg) rotateX(348deg);
  }
  .dialog-container:last-of-type {
    top: 10%;
    left: unset;
    right: 2%;
    transform: perspective(1000px) rotateY(-23deg) rotateX(348deg);
    z-index: 10;
  }
</style>
