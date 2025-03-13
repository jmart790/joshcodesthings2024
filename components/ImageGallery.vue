<template>
  <div class="image-gallery">
    <div class="wrap">
      <div class="girl"></div>

      <div class="container">
        <div class="wrapper">
          <div class="list">
            <!-- <h1>TMNT x Demon Slayer</h1> -->
            <div 
              v-for="image in images"
              :key="image"
               class="item"
              >
              <div class="img" :style="`background-image: url(${image});`"/>
            </div>
          </div>
        </div>
      </div>
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
    position: relative;
  }
  .wrap {

  }
  .girl {
    background: url('/artgirl_standingproud.webp') center no-repeat;
    background-size: cover;
    margin-left: 2rem;
    width: 450px;
    height: 600px;
    bottom: 0%;
    top: 30%;
    position: absolute;
    filter: drop-shadow(-2px 2px 6px pink);
  }
  h1 {
    font-family: "Press Start 2P", cursive, Arial, sans-serif;
    color: #333;
    font-size: 4em;
    position: sticky;
  }



  .container {
    border: 5px solid orange;
    /* height: 70vh; */
    margin: 0;
  padding: 0;
  perspective: 685px;
  position: relative;
}
.wrapper {
  height: 135vh;
    width: 27vw;
    border: 1px solid green;
    transform-style: preserve-3d;
    position: absolute;
    top: -24vw;
    left: 38vw;
    right: 0;
    transform: translateZ(672px) rotateY(347deg) rotateX(112deg);
}

.list {
  perspective: 424px;
    /* padding: 50px 0px; */
    width: 100%;
    height: 824px;
    transform-style: preserve-3d;
    overflow: auto;
    transform: translate(-50%, 0%);
    position: fixed;
    /* bottom: 40%; */
    left: 50%;
    top: -5%;
}
.item {
  position: relative;
    margin: auto;
    height: 100%;
    width: 100%;
    /* aspect-ratio: 1 / 4; */
    transform: rotateX(313deg);
    transform-origin: 0 0%;
}

.img {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
  }


</style>
