<template>
  <div class="art-gallery-page">
    <section class="main">
      <section class="hero-img">
        <img src="/artgallery2.webp" alt="heroimg" />
      </section>
      <div class="art-girl-hero">
        <img src="/artgirl_sliding.webp" alt="art girl sliding" />
      </div>
      <h1>Art Girl's Gallery</h1>
      <svg class="paint-svg" viewBox="0 0 1025 437" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_3_17)">
          <rect width="1024.6" height="437" fill="transparent" />
          <path
            d="M1056 390.5L500 483L1029.5 312L226.5 467.5L1010 238.5L-14.5 442.5L956.5 174.5L26.5 349.5L854.5 104L107.5 251.5L755 34.5L277.5 118L396.5 50"
            stroke="deeppink"
            stroke-width="80"
            stroke-linecap="round"
            stroke-linejoin="round"
            pathlength="1"
          />
        </g>
        <defs>
          <clipPath id="clip0_3_17">
            <rect width="1024.6" height="437" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </section>

    <section class="gallery-container">
      <svg
        class="svg-paint-drips"
        width="100%"
        height="15vh"
        viewBox="0 0 100 20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path d="M0 0 Q5 10 10 5 T20 5 T30 15 T40 5 T50 10 T60 5 T70 15 T80 5 T90 10 T100 0 V20 H0 Z" fill="deeppink" />
      </svg>

      <img src="/stage__artgirl.webp" alt="art gallery img" />
      <div class="img-galleries">
        <!-- <ImageGallery class="img-gallery" /> -->
        <ImageGallery class="img-gallery" />
      </div>
    </section>
  </div>
</template>

<script setup>
  // inspired by: https://codepen.io/MalaikaIshtiaq/pen/MNbXyx
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }
  .art-gallery-page {
    display: grid;
  }

  .main {
    position: relative;
    display: grid;
    align-items: start;
    justify-items: center;
  }

  .hero-img,
  h1 {
    grid-area: 1/1;
  }
  h1 {
    align-self: flex-end;
    margin-bottom: 8rem;
    z-index: 10;
    width: 46rem;
    border: 1px solid black;
    text-align: center;

    position: relative;
    font-family: 'Saira', sans-serif;
    font-weight: 900;
    font-style: italic;
    font-size: 100px;
    display: inline-block;
    line-height: 0.9;
    letter-spacing: 0.25rem;
    color: #d3d3d3;
    text-transform: uppercase;
    text-shadow: -6px 6px black;
  }
  .hero-img img {
    width: 100%;
  }

  .art-girl-hero {
    position: absolute;
    top: 20vh;
    right: 15vw;
    width: 35%;
    z-index: 10;
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

  .paint-svg {
    mix-blend-mode: hard-light;
    height: 75%;
    grid-area: 1/1;
    align-self: flex-end;
  }

  .paint-svg path {
    stroke-dasharray: 1;
    stroke-dashoffset: -1;
    animation: draw both linear;
    animation-timeline: scroll();
    animation-range: 0 20vh;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  .gallery-container {
    margin-top: -10px;
    width: 100%;
    max-height: 100vh;
    /* object-fit: cover; */
    /* position: sticky; */
    /* background: linear-gradient(180deg, rgba(255,20,147,1) 0%, rgba(255,20,147,0.25) 60%); */
    display: grid;
    overflow: scroll;
  }
  .svg-paint-drips {
    overflow: unset;
    transform: rotateX(200deg);
    mix-blend-mode: color-dodge;
  }
  .gallery-container img,
  .img-galleries,
  .svg-paint-drips {
    grid-area: 1/1;
  }

  .img-galleries {
    display: grid;
  }

  .gallery-container img {
    width: 100%;
    height: 100vh;
  }
</style>
