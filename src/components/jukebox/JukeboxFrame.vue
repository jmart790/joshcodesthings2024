<template>
  <div class="jukebox-assembly">
    <div class="power-pipe left-pipe"></div>
    <div class="power-pipe right-pipe"></div>

    <div class="megaman-frame">
      <div v-for="pos in ['tl', 'tr', 'bl', 'br']" :key="pos" :class="['corner-accent', pos]"></div>

      <div class="frame-label">Media Man Player 3000</div>

      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  .jukebox-assembly {
    position: relative;
    z-index: 1;
  }

  .megaman-frame {
    position: relative;
    background-color: #285b88;
    background-image: radial-gradient(#103332 15%, transparent 16%), radial-gradient(#103332 15%, transparent 16%);
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
    padding: 75px 90px;
    height: 70vh;
    width: calc(90vw - 140px);
    display: flex;
    box-sizing: border-box;
    border-radius: 30px;
    z-index: 5;
    box-shadow: inset 4px 4px 0px rgba(255, 255, 255, 0.2), inset -4px -4px 0px rgba(0, 0, 0, 0.4), 0 0 0 4px #001020,
      0 0 0 20px #5c5c70, 0 0 0 24px #333, 0 0 0 40px #707085, 20px 20px 50px rgba(0, 0, 0, 0.8);
  }

  .corner-accent {
    position: absolute;
    width: 250px;
    height: 250px;
    z-index: 1;
    pointer-events: none;
    background-image: radial-gradient(rgba(180, 230, 255, 0.7) 20%, transparent 22%),
      radial-gradient(rgba(180, 230, 255, 0.7) 20%, transparent 22%);
    background-size: 5px 5px;
    background-position: 0 0, 2.5px 2.5px;
  }

  .tl {
    top: 0;
    left: 0;
    border-top-left-radius: 30px;
    mask-image: radial-gradient(circle at top left, black 0%, transparent 70%);
  }
  .tr {
    top: 0;
    right: 0;
    border-top-right-radius: 30px;
    mask-image: radial-gradient(circle at top right, black 0%, transparent 70%);
  }
  .bl {
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 30px;
    mask-image: radial-gradient(circle at bottom left, black 0%, transparent 70%);
  }
  .br {
    bottom: 0;
    right: 0;
    border-bottom-right-radius: 30px;
    mask-image: radial-gradient(circle at bottom right, black 0%, transparent 70%);
  }

  .frame-label {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(0, 0, 0, 0.5);
    font-family: 'Press Start 2P', monospace;
    font-size: 30px;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-shadow: 1px 1px 0 rgba(0, 161, 156, 0.2);
    z-index: 5;
    pointer-events: none;
    font-weight: bold;
    white-space: nowrap;
  }

  .power-pipe {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 15vw;
    height: 60px;
    z-index: 6;
    background: linear-gradient(to bottom, #4a4a5a 0%, #707085 20%, #e0e0f0 40%, #707085 60%, #333 100%);
    border-top: 2px solid #555;
    border-bottom: 2px solid #222;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  .power-pipe::after {
    content: '';
    position: absolute;
    top: -5px;
    width: 10px;
    height: 70px;
    background: #4a4a5a;
    border: 1px solid #222;
    box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.3);
    z-index: 7;
  }

  .left-pipe {
    right: 100%;
    margin-right: 35px;
    border-right: 4px solid #333;
  }

  .left-pipe::after {
    right: 0;
  }

  .right-pipe {
    left: 100%;
    margin-left: 35px;
    border-left: 4px solid #333;
  }

  .right-pipe::after {
    left: 0;
  }

  .megaman-frame::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 40px;
    right: 40px;
    height: 10px;
    background: #333;
    box-shadow: 0 5px 0 #555;
    z-index: 2;
  }

  .megaman-frame::after {
    content: '';
    position: absolute;
    bottom: -40px;
    left: 40px;
    right: 40px;
    height: 10px;
    background: #333;
    box-shadow: 0 -5px 0 #555;
    z-index: 2;
  }

  @media (max-width: 1000px) {
    .megaman-frame {
      height: auto;
      max-height: none;
      aspect-ratio: auto;
      flex-direction: column;
      padding: 30px;
      width: 95vw;
    }
  }
</style>
