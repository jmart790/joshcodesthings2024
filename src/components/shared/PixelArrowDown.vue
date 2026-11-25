<template>
  <div class="pixel-arrow-container">
    <!-- Pixel down-arrow in the art gallery's cute style: white-to-blush fill,
         a hot-pink pixel outline (filter dilates the shape) and a hard shadow. -->
    <svg class="pixel-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="cuteArrowFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#fff0f7" />
          <stop offset="100%" stop-color="#ffc2df" />
        </linearGradient>
        <filter id="cuteArrowOutline" x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="grown" />
          <feFlood flood-color="#c2185b" />
          <feComposite in2="grown" operator="in" result="outline" />
          <feOffset in="outline" dx="0" dy="1.5" result="drop" />
          <feFlood flood-color="#7a1040" flood-opacity="0.45" />
          <feComposite in2="drop" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="url(#cuteArrowFill)" filter="url(#cuteArrowOutline)" shape-rendering="crispEdges">
        <rect x="10" y="2" width="4" height="12" />
        <rect x="6" y="10" width="4" height="4" />
        <rect x="14" y="10" width="4" height="4" />
        <rect x="8" y="14" width="4" height="4" />
        <rect x="12" y="14" width="4" height="4" />
        <rect x="10" y="18" width="4" height="4" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
  .pixel-arrow-container {
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation:
      fadeIn 1s ease 300ms forwards,
      bounce 2s infinite 1.3s;
  }

  .pixel-arrow {
    display: block;
    width: 100%;
    height: 100%;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
</style>
