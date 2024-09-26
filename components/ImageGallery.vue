<template>
  <div class="image-gallery">
    <div class="wrap">
      <div class="girl"></div>
      <!-- <div class="list">
        <h1>TMNT x Demon Slayer</h1>
        <div 
          v-for="image in images"
          :key="image"
           class="item"
          >
          <div class="img" :style="`background-image: url(${image});`"/>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
  const images = [
    '/tmnt__april.webp',
    '/tmnt__casey.webp',
    '/tmnt__don.webp',
    '/tmnt__karai.webp',
    '/tmnt__leo.webp',
    '/tmnt__mikey.webp',
    '/tmnt__miyamoto.webp',
    '/tmnt__raph.webp',
    '/tmnt__slash.webp',
    '/tmnt__splinter.webp',
    '/tmnt__shredder.webp',
  ];
</script>

<style scoped>

  .image-gallery {
    width: 100%;
    min-height: 100%;
    overflow: hidden;
  }
  .wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    text-align: center;
    -webkit-perspective: 2500px;
    perspective: 2500px;
    -webkit-perspective-origin: 100% 50%;
    perspective-origin: 100% 50%;
  }
  .girl {
    background: url('/artgirl_standingproud.webp') center no-repeat;
    background-size: cover;
    margin-left: 2rem;
    width: 450px;
    height: 600px;
    bottom: 0%;
    top: 10%;
    position: absolute;
    filter: drop-shadow(-2px 2px 8px black);
  }
  h1 {
    font-family: "Press Start 2P", cursive, Arial, sans-serif;
    color: #333;
    font-size: 4em;
    position: sticky;
  }
  .list {
    position: relative;
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    width: 50%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: auto;
    margin-inline: auto;
  }
  .list::-webkit-scrollbar {
    display: none;
  }
  .item {
    /* filter: grayscale(100%); */
    height: 400px;
    /* margin: 20px; */
    display: inline-block;
    position: relative;
    transform: perspective(1000px);
    transform-style: preserve-3d;
    transition: all 500ms ease-in-out;
  }
  .item:hover {
    /* filter: grayscale(0%); */
    transform: scale3d(1.2, 1.2, 1.2);
    z-index: 1;
  }
  .img {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    box-shadow: 1px 1px 50px 0 #000;
    -webkit-transform-origin: 100% 50%;
    -ms-transform-origin: 100% 50%;
    transform-origin: 100% 50%;
    z-index: 10;
    position: relative;
  }


</style>
