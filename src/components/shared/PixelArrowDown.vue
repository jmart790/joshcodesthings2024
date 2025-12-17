<template>
  <div class="pixel-arrow-container">
    <svg class="pixel-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="retroGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#02a7f9" />
          <stop offset="25%" stop-color="#47c2ff" />
          <stop offset="50%" stop-color="#ccf2fd" />
          <stop offset="100%" stop-color="#00aaff" />
        </linearGradient>
        <filter id="retroShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="-2" dy="2" stdDeviation="0.5" flood-color="black" />
        </filter>
      </defs>
      <g filter="url(#retroShadow)">
        <path d="M11 4H13V14H11V4Z" fill="url(#retroGradient)" />
        <path d="M11 14H13V16H11V14Z" fill="url(#retroGradient)" />
        <path d="M9 14H11V16H9V14Z" fill="url(#retroGradient)" />
        <path d="M13 14H15V16H13V14Z" fill="url(#retroGradient)" />
        <path d="M9 16H11V18H9V16Z" fill="url(#retroGradient)" />
        <path d="M13 16H15V18H13V16Z" fill="url(#retroGradient)" />
        <path d="M11 18H13V20H11V18Z" fill="url(#retroGradient)" />

        <rect x="10" y="2" width="4" height="12" fill="url(#retroGradient)" />
        <rect x="6" y="10" width="4" height="4" fill="url(#retroGradient)" />
        <rect x="14" y="10" width="4" height="4" fill="url(#retroGradient)" />
        <rect x="8" y="14" width="4" height="4" fill="url(#retroGradient)" />
        <rect x="12" y="14" width="4" height="4" fill="url(#retroGradient)" />
        <rect x="10" y="18" width="4" height="4" fill="url(#retroGradient)" />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
  .pixel-arrow-container {
    width: 75px;
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: fadeIn 1s ease 300ms forwards, bounce 2s infinite 1.3s;
  }

  .pixel-art-arrow {
    width: 4px;
    height: 4px;
    background: white;
    box-shadow: 0px -16px 0 white, 0px -12px 0 white, 0px -8px 0 white, 0px -4px 0 white, 0px 0px 0 white,
      -4px 0px 0 white, 4px 0px 0 white, -8px 0px 0 white, 8px 0px 0 white, 0px -12px 0 white, 0px -8px 0 white,
      0px -4px 0 white, 0px 0px 0 white, -4px 0px 0 white, 4px 0px 0 white, -8px 4px 0 white, 8px 4px 0 white,
      -4px 4px 0 white, 4px 4px 0 white, 0px 4px 0 white, 0px 8px 0 white, -4px 8px 0 white, 4px 8px 0 white,
      0px 12px 0 white;
  }

  .pixel-arrow-container svg {
    width: 100%;
    height: 100%;
    display: none;
  }

  .pixel-art-arrow {
    width: 6px;
    height: 6px;
    background: transparent;
    box-shadow: 0 -18px 0 white, 0 -12px 0 white, 0 -6px 0 white, 0 0 0 white, -6px 0 0 white, -12px -6px 0 white,
      6px 0 0 white, 12px -6px 0 white, 0 6px 0 white;
  }

  .pixel-art-arrow {
    width: 4px;
    height: 4px;
    background: white;
    box-shadow: 0 -20px 0 white, 0 -16px 0 white, 0 -12px 0 white, 0 -8px 0 white, 0 -4px 0 white, 0 0 0 white,
      -4px 0 0 white, 4px 0 0 white, -8px -4px 0 white, 8px -4px 0 white;
  }

  .pixel-arrow-container svg {
    display: block;
    filter: none;
  }
  .pixel-art-arrow {
    display: none;
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
