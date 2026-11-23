<template>
  <svg class="gear-svg" viewBox="-512 -512 1024 1024" aria-hidden="true" focusable="false">
    <defs>
      <!-- Metals -->
      <linearGradient id="gear-bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d9a066" />
        <stop offset="0.35" stop-color="#a8723c" />
        <stop offset="0.6" stop-color="#8a5a2b" />
        <stop offset="1" stop-color="#5e3b19" />
      </linearGradient>
      <linearGradient id="gear-bronze-hub" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#e2ad74" />
        <stop offset="0.45" stop-color="#b07a42" />
        <stop offset="1" stop-color="#6b431d" />
      </linearGradient>
      <linearGradient id="gear-steel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#9c9484" />
        <stop offset="0.5" stop-color="#776f61" />
        <stop offset="1" stop-color="#4f483d" />
      </linearGradient>
      <radialGradient id="gear-disc" r="0.5">
        <stop offset="0.45" stop-color="#43382a" />
        <stop offset="1" stop-color="#2a231a" />
      </radialGradient>
      <radialGradient id="gear-hole" r="0.5">
        <stop offset="0.6" stop-color="#2f2b25" />
        <stop offset="1" stop-color="#161411" />
      </radialGradient>
      <radialGradient id="gear-rivet" cx="0.35" cy="0.35" r="0.65">
        <stop offset="0" stop-color="#cfc6b4" />
        <stop offset="0.5" stop-color="#7d7466" />
        <stop offset="1" stop-color="#3b352c" />
      </radialGradient>

      <!-- Wear: fine grain plus low-frequency grime, multiplied over the art. -->
      <filter id="gear-worn" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="grain" />
        <feColorMatrix
          in="grain"
          type="matrix"
          values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 -0.9 1.05"
          result="grainTint"
        />
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="3" result="blotch" />
        <feColorMatrix
          in="blotch"
          type="matrix"
          values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.2  0 0 0 -1.4 0.85"
          result="grime"
        />
        <feBlend in="SourceGraphic" in2="grainTint" mode="multiply" result="grained" />
        <feBlend in="grained" in2="grime" mode="multiply" result="worn" />
        <feComposite in="worn" in2="SourceAlpha" operator="in" />
      </filter>

      <filter id="gear-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="#000" flood-opacity="0.8" />
      </filter>
    </defs>

    <g filter="url(#gear-shadow)">
      <g filter="url(#gear-worn)">
        <!-- Outer bronze ring with 36 teeth (a multiple of 12, so every 30deg step looks identical) -->
        <path :d="outerTeeth" fill="url(#gear-bronze)" stroke="#3a240f" stroke-width="3" stroke-linejoin="round" />
        <path :d="outerTeeth" fill="none" stroke="#e8b97f" stroke-opacity="0.35" stroke-width="2" transform="scale(0.985)" />

        <!-- Chain track -->
        <circle r="452" fill="#1d1a15" />
        <g>
          <rect
            v-for="(a, i) in chainLinks"
            :key="`l${i}`"
            x="-17"
            y="-8"
            width="34"
            height="16"
            rx="8"
            :fill="i % 2 ? '#8a8272' : '#6f685b'"
            stroke="#18150f"
            stroke-width="2"
            :transform="`rotate(${a}) translate(0 -428)`"
          />
          <circle
            v-for="(a, i) in chainLinks"
            :key="`p${i}`"
            r="4.5"
            fill="#c2baa6"
            stroke="#1d1a15"
            stroke-width="1.5"
            :transform="`rotate(${a + 2.5}) translate(0 -428)`"
          />
        </g>

        <!-- Steel rim with rivets -->
        <circle r="408" fill="url(#gear-steel)" stroke="#1d1a15" stroke-width="4" />
        <circle r="400" fill="none" stroke="#b9b09d" stroke-opacity="0.35" stroke-width="2" />
        <circle
          v-for="(a, i) in rivets"
          :key="`r${i}`"
          r="9"
          fill="url(#gear-rivet)"
          stroke="#26211a"
          stroke-width="2"
          :transform="`rotate(${a}) translate(0 -380)`"
        />

        <!-- Inner disc -->
        <circle r="354" fill="url(#gear-disc)" stroke="#1a1610" stroke-width="5" />

        <!-- 12 spokes at 15deg + k*30deg: labels sit at k*30deg, dead center between two spokes -->
        <g v-for="(a, i) in spokes" :key="`s${i}`" :transform="`rotate(${a})`">
          <line x1="178" y1="0" x2="352" y2="0" stroke="#1b1711" stroke-width="7" stroke-linecap="round" />
          <line x1="180" y1="3.5" x2="350" y2="3.5" stroke="#7a6b52" stroke-opacity="0.55" stroke-width="1.5" />
        </g>

        <!-- Center bronze gear -->
        <path :d="hubTeeth" fill="url(#gear-bronze-hub)" stroke="#3a240f" stroke-width="3" stroke-linejoin="round" />
        <circle r="104" fill="none" stroke="#3a240f" stroke-width="3" />
        <circle r="100" fill="none" stroke="#f0c48e" stroke-opacity="0.45" stroke-width="2" />
        <circle r="92" fill="url(#gear-hole)" stroke="#120f0b" stroke-width="4" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
  function gearPath(teeth: number, root: number, tip: number, toothDeg: number, flankDeg: number) {
    const pitch = 360 / teeth;
    const pt = (r: number, deg: number) => {
      const t = ((deg - 90) * Math.PI) / 180;
      return `${(r * Math.cos(t)).toFixed(2)} ${(r * Math.sin(t)).toFixed(2)}`;
    };
    let d = '';
    for (let i = 0; i < teeth; i++) {
      const c = i * pitch;
      const halfTip = toothDeg / 2;
      const halfBase = halfTip + flankDeg;
      d += `${i === 0 ? 'M' : 'L'}${pt(root, c - pitch / 2)} `;
      d += `A${root} ${root} 0 0 1 ${pt(root, c - halfBase)} `;
      d += `L${pt(tip, c - halfTip)} `;
      d += `A${tip} ${tip} 0 0 1 ${pt(tip, c + halfTip)} `;
      d += `L${pt(root, c + halfBase)} `;
      d += `A${root} ${root} 0 0 1 ${pt(root, c + pitch / 2)} `;
    }
    return d + 'Z';
  }

  const outerTeeth = gearPath(36, 462, 500, 3.6, 1.2);
  const hubTeeth = gearPath(12, 158, 186, 12, 4);
  const spokes = Array.from({ length: 12 }, (_, i) => 15 + i * 30);
  const rivets = Array.from({ length: 24 }, (_, i) => i * 15);
  const chainLinks = Array.from({ length: 72 }, (_, i) => i * 5);
</script>

<style scoped>
  .gear-svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }
</style>
