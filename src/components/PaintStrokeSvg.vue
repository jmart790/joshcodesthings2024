<template>
  <svg class="paint-svg" viewBox="0 0 1025 437" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_3_17)">
      <rect width="1024.6" height="437" fill="transparent" />
      <path
        d="M1029.5 312 C 900 400, 600 500, 226.5 467.5 C 400 350, 800 150, 1010 238.5 C 900 400, 600 500, -14.5 442.5 C 100 350, 600 100, 956.5 174.5 C 800 250, 200 450, 26.5 349.5 C 150 200, 600 50, 854.5 104 C 700 150, 200 300, 107.5 251.5 C 200 150, 600 0, 755 34.5 C 650 80, 200 200, 277.5 118"
        stroke="deeppink"
        stroke-width="120"
        stroke-linecap="round"
        stroke-linejoin="round"
        pathLength="1"
        filter="url(#chalkBrush)"
      />
    </g>
    <defs>
      <clipPath id="clip0_3_17">
        <rect width="1024.6" height="437" fill="white" />
      </clipPath>
      <filter id="chalkBrush" x="0%" y="0%" width="100%" height="100%">
        <!-- Generate grain noise -->
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" result="noise" />
        <!-- Increase contrast of noise to make it stark black/white -->
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  
                  0 1 0 0 0  
                  0 0 1 0 0  
                  0 0 0 15 -2"
          in="noise"
          result="contrastNoise"
        />
        <!-- Use the noise to mask the original graphic (SourceGraphic) -->
        <feComposite operator="in" in="SourceGraphic" in2="contrastNoise" result="textured" />
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.paint-svg {
  mix-blend-mode: hard-light;
  height: 59%;
  grid-area: 1 / 1;
  align-self: flex-end;
  margin-top: 55%;
  z-index: 5;
}

.paint-svg path {
  stroke-dasharray: 1;
  stroke-dashoffset: -1;
  animation: draw both linear;
  animation-timeline: scroll();
  animation-range: 10px 40vh;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
