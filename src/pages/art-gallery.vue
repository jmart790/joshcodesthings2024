<template>
  <div class="art-gallery-page">
    <div class="back-button">
      <PixelButton @click="$router.back()">< Home</PixelButton>
    </div>
    <section class="hero-img">
      
      <img src="/art_gallery.webp" alt="heroimg" />
    </section>
    <section class="main">
      <div class="art-girl-hero">
        <img src="/artgirl_swinging.webp" alt="art girl swinging" />
      </div>
      <PaintStrokeSvg />
    </section>

    <section class="gallery-container">
      <PaintDripsSvg />
      <div class="img-galleries">
        <ImageGallery />
      </div>
    </section>
  </div>
</template>

<script setup>
  import ImageGallery from '../components/ImageGallery.vue';
  import PaintStrokeSvg from '../components/PaintStrokeSvg.vue';
  import PaintDripsSvg from '../components/PaintDripsSvg.vue';
  import PixelButton from '../components/PixelButton.vue';
  
  // inspired by: https://codepen.io/MalaikaIshtiaq/pen/MNbXyx
</script>

<style scoped>
  .art-gallery-page {
    display: grid;
    position: relative;
    min-height: 100vh;
    isolation: isolate; /* Create new stacking context cleanly */
  }

  .back-button {
    position: fixed;
    top: 2rem;
    left: 2rem;
    z-index: 100;
  }

  .main {
    position: relative;
    display: grid;
    align-items: start;
    justify-items: center;
    grid-area: 1/1;
  }

  .hero-img {
    position: sticky;
    bottom: 0;
    width: 100%;
    /* No explicit height, let top/bottom stretch it */
    z-index: -1; /* Behind content */
    pointer-events: none;
  }

  /* The painted version overlay */
  .hero-img::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/art_gallery_painted.webp');
    background-size: 100% 100%;
    background-position: center;
    opacity: 0;
    animation: paintReveal 1s ease 400ms forwards;
    z-index: 1; /* Sit above the sketch image */
  }

  .hero-img img {
    display: block;
    width: 100%;
    position: sticky;
    bottom: 0;
    z-index: -1;
    animation: sketchFade 1s ease 400ms forwards;
  }

  @keyframes paintReveal {
    to {
      opacity: 1;
    }
  }

  @keyframes sketchFade {
    to {
      opacity: 0;
    }
  }

  .art-girl-hero {
    position: absolute;
    top: 50vh;
    margin-inline: auto;
    width: 45%;
    z-index: 10;
    filter: drop-shadow(-2px 2px 6px rgba(0, 0, 0, 0.476));
  }

  .art-girl-hero img {
    width: 100%;
    filter: drop-shadow(-2px 2px 8px black);
    opacity: 0;
    animation: fadeIn 1s ease 300ms forwards; /* 0s delay */
  }


  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      scale: 1;
    }
  }

  .gallery-container {
    width: 100%;
    display: grid;
    grid-area: 2/1;
  }

  .gallery-container img,
  .img-galleries {
    grid-area: 1/1;
  }

  :deep(.svg-paint-drips) {
    grid-area: 1/1;
    opacity: 0;
    animation: fadeIn 1s ease 300ms forwards;
  }

  .img-galleries {
    display: grid;
  }

  .gallery-container img {
    width: 100%;
    height: 100vh;
    position: sticky;
    top: 0;
    object-fit: cover;
    z-index: -1;
  }
</style>
