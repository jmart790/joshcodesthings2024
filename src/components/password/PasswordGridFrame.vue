<template>
  <form class="grid-container" @submit.prevent>
    <!-- Top Sockets (Vertical Columns 1, 2, 3) -->
    <div class="socket socket-t socket-pos-1"></div>
    <div class="socket socket-t socket-pos-2"></div>
    <div class="socket socket-t socket-pos-3"></div>
    <!-- Left Sockets (Horizontal Rows 1, 2, 3, 4) -->
    <div class="socket socket-l socket-pos-1"></div>
    <div class="socket socket-l socket-pos-2"></div>
    <div class="socket socket-l socket-pos-3"></div>
    <div class="socket socket-l socket-pos-4"></div>
    <!-- Right Sockets (Horizontal Rows 1, 2, 3, 4) -->
    <div class="socket socket-r socket-pos-1"></div>
    <div class="socket socket-r socket-pos-2"></div>
    <div class="socket socket-r socket-pos-3"></div>
    <div class="socket socket-r socket-pos-4"></div>
    <!-- Corner Sockets -->
    <div class="socket socket-c socket-tl"></div>
    <div class="socket socket-c socket-tr"></div>
    <div class="socket socket-c socket-bl"></div>
    <div class="socket socket-c socket-br"></div>

    <!-- Row 1 -->
    <div class="joint joint-c1 joint-r1"></div>
    <div class="joint joint-c2 joint-r1"></div>
    <div class="joint joint-c3 joint-r1"></div>
    <!-- Row 2 -->
    <div class="joint joint-c1 joint-r2"></div>
    <div class="joint joint-c2 joint-r2"></div>
    <div class="joint joint-c3 joint-r2"></div>
    <!-- Row 3 -->
    <div class="joint joint-c1 joint-r3"></div>
    <div class="joint joint-c2 joint-r3"></div>
    <div class="joint joint-c3 joint-r3"></div>
    <!-- Row 4 (Footer Divider) -->
    <div class="joint joint-c1 joint-r4"></div>
    <div class="joint joint-c2 joint-r4"></div>
    <div class="joint joint-c3 joint-r4"></div>

    <div class="grid-matrix">
      <slot></slot>
    </div>

    <div class="grid-footer">
      <slot name="footer"></slot>
    </div>
  </form>
</template>

<style scoped>
  @keyframes expand-grid {
    0% {
      transform: scale(0.05, 0.03);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: scale(1, 0.01);
      opacity: 1;
    }
    100% {
      transform: scale(1, 1);
      opacity: 1;
    }
  }

  .grid-container {
    --button-size: 100px;
    --gap: 72px;
    --pipe-width: 16px;
    --outer-pipe-width: 32px;

    --padding: calc((var(--gap) - var(--pipe-width)) / 2);

    /* Animation */
    animation: expand-grid 0.6s ease forwards;
    transform-origin: center;

    /* Pipe Positions (Horizontal & Vertical) */
    /* 1, 2, 3 are between buttons 1-2, 2-3, 3-4 */
    --pos-1: calc(var(--padding) + var(--button-size) + (var(--gap) - var(--pipe-width)) / 2);
    --pos-2: calc(var(--padding) + 2 * var(--button-size) + var(--gap) + (var(--gap) - var(--pipe-width)) / 2);
    --pos-3: calc(var(--padding) + 3 * var(--button-size) + 2 * var(--gap) + (var(--gap) - var(--pipe-width)) / 2);

    /* Pos 4 is AFTER the 4th row, acting as the divider between Grid and Footer */
    --pos-4: calc(var(--padding) + 4 * var(--button-size) + 3 * var(--gap) + (var(--gap) - var(--pipe-width)) / 2);

    /* V-Pipe Height: Length from Top (0) to Bottom of the 4th horizontal pipe (Divider) */
    --v-pipe-height: calc(var(--pos-4) + var(--pipe-width));

    /* Texture Variables */
    --texture-pattern: repeating-linear-gradient(45deg, #4a4a4a 0px, #4a4a4a 2px, #5a5a5a 2px, #5a5a5a 4px);

    --lighting-v: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 20%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 80%,
      rgba(0, 0, 0, 0.6) 100%
    );

    --lighting-h: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      transparent 20%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 80%,
      rgba(0, 0, 0, 0.6) 100%
    );

    display: flex;
    flex-direction: column;
    padding: var(--padding);
    padding-bottom: 0;
    border-radius: 12px;
    position: relative;
    width: fit-content;
    border: var(--outer-pipe-width) solid transparent;
    background-clip: padding-box;
    /* Background Pipes */
    background-image: 
      /* == LIGHTING LAYER (Top) == */ var(--lighting-v), var(--lighting-v), var(--lighting-v),
      /* V1, V2, V3 */ var(--lighting-h), var(--lighting-h), var(--lighting-h), var(--lighting-h),
      /* H1, H2, H3, H4 */ /* == TEXTURE LAYER (Bottom) == */ var(--texture-pattern), var(--texture-pattern),
      var(--texture-pattern), /* V1, V2, V3 */ var(--texture-pattern), var(--texture-pattern), var(--texture-pattern),
      var(--texture-pattern),
      /* H1, H2, H3, H4 */ /* == SUBSTRATE (Grid Background) == */
        linear-gradient(rgba(51, 34, 85, 0.55), rgba(51, 34, 85, 0.55));

    background-repeat: no-repeat;
    background-position: 
       /* LIGHTING V */ var(--pos-1) 0, var(--pos-2) 0, var(--pos-3) 0,
      /* LIGHTING H */ 0 var(--pos-1), 0 var(--pos-2), 0 var(--pos-3), 0 var(--pos-4), /* TEXTURE V */ var(--pos-1) 0,
      var(--pos-2) 0, var(--pos-3) 0, /* TEXTURE H */ 0 var(--pos-1), 0 var(--pos-2), 0 var(--pos-3), 0 var(--pos-4),
      /* SUBSTRATE */ 0 0;
    background-size: 
       /* LIGHTING V */ var(--pipe-width) var(--v-pipe-height),
      var(--pipe-width) var(--v-pipe-height), var(--pipe-width) var(--v-pipe-height),
      /* LIGHTING H */ 100% var(--pipe-width), 100% var(--pipe-width), 100% var(--pipe-width), 100% var(--pipe-width),
      /* TEXTURE V */ var(--pipe-width) var(--v-pipe-height), var(--pipe-width) var(--v-pipe-height),
      var(--pipe-width) var(--v-pipe-height), /* TEXTURE H */ 100% var(--pipe-width), 100% var(--pipe-width),
      100% var(--pipe-width), 100% var(--pipe-width), /* SUBSTRATE */ 100% 100%;

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), inset 0 0 40px rgba(0, 0, 0, 0.6);
  }

  /* Outer Border Pseudo-Element */
  .grid-container::after {
    content: '';
    position: absolute;
    top: calc(-1 * var(--outer-pipe-width));
    left: calc(-1 * var(--outer-pipe-width));
    right: calc(-1 * var(--outer-pipe-width));
    bottom: calc(-1 * var(--outer-pipe-width));
    pointer-events: none;
    border-radius: 12px;
    z-index: 2;
    background-image: 
      /* == LIGHTING OVERLAYS (4 Sides) == */
      /* Top (Vertical Light) */ linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.6) 0%,
        transparent 20%,
        rgba(255, 255, 255, 0.7) 45%,
        rgba(255, 255, 255, 0.7) 55%,
        transparent 80%,
        rgba(0, 0, 0, 0.6) 100%
      ),
      /* Bottom (Vertical Light) */
        linear-gradient(
          180deg,
          rgba(0, 0, 0, 0.6) 0%,
          transparent 20%,
          rgba(255, 255, 255, 0.7) 45%,
          rgba(255, 255, 255, 0.7) 55%,
          transparent 80%,
          rgba(0, 0, 0, 0.6) 100%
        ),
      /* Left (Horizontal Light) */
        linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.6) 0%,
          transparent 20%,
          rgba(255, 255, 255, 0.7) 45%,
          rgba(255, 255, 255, 0.7) 55%,
          transparent 80%,
          rgba(0, 0, 0, 0.6) 100%
        ),
      /* Right (Horizontal Light) */
        linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.6) 0%,
          transparent 20%,
          rgba(255, 255, 255, 0.7) 45%,
          rgba(255, 255, 255, 0.7) 55%,
          transparent 80%,
          rgba(0, 0, 0, 0.6) 100%
        ),
      /* == TEXTURE LAYERS (4 Sides) == */ /* Top */
        repeating-linear-gradient(45deg, #4a4a4a 0px, #4a4a4a 2px, #5a5a5a 2px, #5a5a5a 4px),
      /* Bottom */ repeating-linear-gradient(45deg, #4a4a4a 0px, #4a4a4a 2px, #5a5a5a 2px, #5a5a5a 4px),
      /* Left */ repeating-linear-gradient(45deg, #4a4a4a 0px, #4a4a4a 2px, #5a5a5a 2px, #5a5a5a 4px),
      /* Right */ repeating-linear-gradient(45deg, #4a4a4a 0px, #4a4a4a 2px, #5a5a5a 2px, #5a5a5a 4px);

    background-repeat: no-repeat;

    /* Identical positioning for Lighting and Texture layers so they overlap correctly */
    background-position: 
      /* -- Lighting -- */ 0 0, 0 100%, 0 0, 100% 0, /* -- Texture -- */ 0 0, 0 100%, 0 0,
      100% 0;

    background-size: 
      /* -- Lighting (Top, Bottom, Left, Right) -- */ 100% var(--outer-pipe-width),
      100% var(--outer-pipe-width), var(--outer-pipe-width) 100%, var(--outer-pipe-width) 100%,
      /* -- Texture (Top, Bottom, Left, Right) -- */ 100% var(--outer-pipe-width), 100% var(--outer-pipe-width),
      var(--outer-pipe-width) 100%, var(--outer-pipe-width) 100%;
  }

  /* INNER GRID MATRIX */
  .grid-matrix {
    display: grid;
    grid-template-columns: repeat(4, var(--button-size));
    grid-gap: var(--gap);
    /* Bottom padding provided by gap/footer separation */
    margin-bottom: var(--padding);
  }

  /* FOOTER ROW */
  .grid-footer {
    height: 110px; /* Specific footer height */
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-top: 20px;
    background: transparent;
    z-index: 5; /* Above background pipes */
  }

  /* SOCKETS */
  .socket {
    position: absolute;
    z-index: 10;
    /* Retro Texture Background (Matches Joints) */
    background: 
      /* Highlight/Shadow Overlay */ linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.4) 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.5) 100%
      ),
      /* Diagonal Texture */ repeating-linear-gradient(45deg, #bbb 0px, #bbb 1px, #999 1px, #999 2px);

    border: 2px solid #444;
    border-radius: 3px;
    box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.3), 2px 2px 5px rgba(0, 0, 0, 0.5);

    /* Center content (Gem) */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Purple Center Gem via Pseudo-element - RECTANGULAR */
  .socket::after {
    content: '';
    width: 14px; /* Wider rectangle */
    height: 6px; /* Narrower height */
    border-radius: 2px; /* Slight rounding */
    background: radial-gradient(circle at center, #ea00ff 0%, #8800aa 60%, #440055 100%);
    box-shadow: 0 0 4px #ea00ff, inset 1px 1px 2px rgba(0, 0, 0, 0.5);
    border: 1px solid #330044;
    opacity: 0.9;
  }

  /* Gem Rotation for Vertical Sockets */
  .socket-l::after,
  .socket-r::after {
    width: 6px;
    height: 14px;
  }

  /* Corner Gem - Square for emphasis - ORANGE */
  .socket-c::after {
    width: 10px;
    height: 10px;
    background: radial-gradient(circle at center, #ffaa00 0%, #cc8800 60%, #664400 100%);
    box-shadow: 0 0 4px #ffaa00, inset 1px 1px 2px rgba(0, 0, 0, 0.5);
    border: 1px solid #442200;
  }

  /* Dimensions - Chunkier (~32px wide perpendicular to pipe) */
  .socket-t,
  .socket-b {
    width: 32px;
    height: 24px;
  }
  .socket-l,
  .socket-r {
    width: 24px;
    height: 32px;
  }
  .socket-c {
    width: 34px;
    height: 34px;
  }

  /* Positions - Recessed deeper due to larger size */
  .socket-t {
    top: -1px;
  }
  .socket-b {
    bottom: -1px;
  }
  .socket-l {
    left: -1px;
  }
  .socket-r {
    right: -1px;
  }

  /* Positional Classes - Recalculated for centering 32px element on 16px pipe (Offset -8px) */
  .socket-pos-1.socket-t,
  .socket-pos-1.socket-b {
    left: calc(var(--pos-1) - 8px);
  }
  .socket-pos-2.socket-t,
  .socket-pos-2.socket-b {
    left: calc(var(--pos-2) - 8px);
  }
  .socket-pos-3.socket-t,
  .socket-pos-3.socket-b {
    left: calc(var(--pos-3) - 8px);
  }

  .socket-pos-1.socket-l,
  .socket-pos-1.socket-r {
    top: calc(var(--pos-1) - 8px);
  }
  .socket-pos-2.socket-l,
  .socket-pos-2.socket-r {
    top: calc(var(--pos-2) - 8px);
  }
  .socket-pos-3.socket-l,
  .socket-pos-3.socket-r {
    top: calc(var(--pos-3) - 8px);
  }
  .socket-pos-4.socket-l,
  .socket-pos-4.socket-r {
    top: calc(var(--pos-4) - 8px);
  }

  /* Corners - Aligned to sit IN the corner (-32px matches outer frame thickness) */
  .socket-tl {
    top: -32px;
    left: -32px;
  }
  .socket-tr {
    top: -32px;
    right: -32px;
  }
  .socket-bl {
    bottom: -32px;
    left: -32px;
  }
  .socket-br {
    bottom: -32px;
    right: -32px;
  }

  /* 
     PLUS-SHAPED JOINTS
     
     Structure:
     .joint (container) centered on intersection.
     ::before = vertical bar
     ::after = horizontal bar
  */
  .joint {
    position: absolute;
    width: 32px;
    height: 32px;
    z-index: 15; /* Top most decoration */
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .joint::before,
  .joint::after {
    content: '';
    position: absolute;
    background: 
      /* Highlight/Shadow */ linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.4) 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.5) 100%
      ),
      /* Texture */ repeating-linear-gradient(45deg, #bbb 0px, #bbb 1px, #999 1px, #999 2px);

    border: 1px solid #444;
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  /* Vertical Bar */
  .joint::before {
    width: 14px;
    height: 28px;
  }
  /* Horizontal Bar */
  .joint::after {
    width: 28px;
    height: 14px;
    background: 
      /* Gem Center */ radial-gradient(
        circle at center,
        #0ff 2px,
        #00f 5px,
        rgba(0, 0, 0, 0.5) 6px,
        transparent 6px
      ),
      /* Highlight/Shadow */
        linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(0, 0, 0, 0.5) 100%),
      /* Texture */ repeating-linear-gradient(45deg, #bbb 0px, #bbb 1px, #999 1px, #999 2px);
  }

  /* Joint Positioning Helpers
     Center of intersection is (Pos H + 8px, Pos V + 8px) approximately.
     Pipe Width 16. Intersection center is PipeCenter.
     Joint Width 32. So Left = PipeCenter - 16.
     
     Existing --pos vars define the START of the pipe (left/top edge).
     Pipe center is --pos + 8px.
     Joint Left = --pos + 8 - 16 = --pos - 8.
  */
  .joint-c1 {
    left: calc(var(--pos-1) - 8px);
  }
  .joint-c2 {
    left: calc(var(--pos-2) - 8px);
  }
  .joint-c3 {
    left: calc(var(--pos-3) - 8px);
  }

  .joint-r1 {
    top: calc(var(--pos-1) - 8px);
  }
  .joint-r2 {
    top: calc(var(--pos-2) - 8px);
  }
  .joint-r3 {
    top: calc(var(--pos-3) - 8px);
  }
  .joint-r4 {
    top: calc(var(--pos-4) - 8px);
  }

  /* Upside Down T shape for last row (remove bottom vertical leg) */
  .joint-r4::before {
    height: 18px;
    top: 2px;
  }
</style>
