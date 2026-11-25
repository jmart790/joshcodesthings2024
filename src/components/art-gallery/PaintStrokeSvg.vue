<template>
  <svg class="paint-svg" viewBox="0 0 1025 437" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#strokeClip)">
      <!-- A thick marker-style zigzag (modeled on the Photopea sketch): flat
           solid paint with soft, slightly grainy edges. Round joins make each
           sharp turn a rounded marker end. Drawn by scroll (pathLength 1); butt
           caps so nothing shows before the draw starts. -->
      <path
        class="stroke"
        :d="d"
        stroke="deeppink"
        stroke-width="110"
        stroke-linecap="butt"
        stroke-linejoin="round"
        pathLength="1"
        filter="url(#softMarker)"
      />
      <!-- the heart the stroke starts from (under the scroll arrow); centered on (277.5, 118) -->
      <path :d="HEART" fill="deeppink" transform="translate(277.5 118)" />
    </g>
    <defs>
      <!-- top is open so the first pass isn't sliced; the bottom edge is the seam
           with the paint drips below -->
      <clipPath id="strokeClip">
        <rect x="-300" y="-300" width="1700" height="737" />
      </clipPath>
      <!-- soft marker edge: a fine grain roughens the outline, then a light blur feathers it -->
      <!-- region in user space: a % region is measured from the path's centerline
           box, which leaves out half the stroke width and sliced the top pass -->
      <filter id="softMarker" filterUnits="userSpaceOnUse" x="-300" y="-300" width="1700" height="1000">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" seed="3" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="6" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
    </defs>
  </svg>
</template>

<script setup lang="ts">
  // Drawn end -> start (the scroll draw reveals from the path's end), so read the
  // points backwards: from the heart at (277.5, 118) right and slightly up, a
  // rounded turn, then legs that drop going left and rise going right, turning
  // on screen near the left (x 300, so their rounded ends show) and past the
  // right edge, ending in a full-width pass
  // along the bottom into the paint drips (same deeppink). Keep the end point
  // at (277.5, 118): art-gallery.vue's portrait layout places the heart from it.
  // Only about x 190-740 of the SVG shows on a portrait tablet (180-925 on
  // desktop); the stroke is ~20% of that window wide, like the sketch.
  const d = 'M1150 470 L -150 385 L 1150 250 L 300 300 L 1150 160 L 300 210 L 660 88 L 277.5 118';

  // heart centered on its origin, 150 x 135
  const HEART =
    'M0 67.5 C -45 32.5 -75 7.5 -75 -22.5 C -75 -52.5 -50 -67.5 -30 -67.5 C -15 -67.5 -5 -59.5 0 -47.5 C 5 -59.5 15 -67.5 30 -67.5 C 50 -67.5 75 -52.5 75 -22.5 C 75 7.5 45 32.5 0 67.5 Z';
</script>

<style scoped>
  .paint-svg {
    height: 59%;
    grid-area: 1 / 1;
    align-self: flex-end;
    margin-top: 55%;
    z-index: 5;
    overflow: visible; /* the top pass and heart poke above the box */
    min-width: 0; /* visible overflow would otherwise widen the grid column to the SVG */
  }

  .paint-svg .stroke {
    stroke-dasharray: 1;
    stroke-dashoffset: -1;
    animation: draw both linear;
    animation-timeline: scroll();
    /* done by 25vh of scroll: the bottom pass is painted before the drips below
       scroll into view (portrait reaches them at ~32vh, desktop at ~54vh) */
    animation-range: 10px 25vh;
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
