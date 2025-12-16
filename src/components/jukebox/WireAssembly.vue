<template>
  <div class="wire-assembly">
    <!-- Left Ports -->
    <div class="port port-l-1"></div>
    <div class="port port-l-2"></div>

    <svg class="wire-svg" viewBox="0 0 1200 290" preserveAspectRatio="none">
      <!-- Wire 1 (Blue/Grey) - Outer/Lower Track (Connects to Bottom Port) -->
      <!-- Rounder Corners (Radius ~20 Top, ~50 Bottom) -->
      <path
        d="M0,55 Q20,55 20,75 L20,220 Q20,270 70,270 L1130,270 Q1180,270 1180,220 L1180,75 Q1180,55 1200,55"
        fill="none"
        stroke="#2a3b4c"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M0,55 Q20,55 20,75 L20,220 Q20,270 70,270 L1130,270 Q1180,270 1180,220 L1180,75 Q1180,55 1200,55"
        fill="none"
        stroke="#4a5b6c"
        stroke-width="2"
        transform="translate(0, -2)"
        opacity="0.6"
      />

      <!-- Wire 2 (Brown/Orange) - Inner/Upper Track (Connects to Top Port) -->
      <!-- Rounder Corners (Radius ~40 Top, ~38 Bottom) -->
      <path
        d="M0,25 Q40,25 40,65 L40,220 Q40,258 78,258 L1122,258 Q1160,258 1160,220 L1160,65 Q1160,25 1200,25"
        fill="none"
        stroke="#5a3a1a"
        stroke-width="8"
        stroke-linecap="round"
      />
      <path
        d="M0,25 Q40,25 40,65 L40,220 Q40,258 78,258 L1122,258 Q1160,258 1160,220 L1160,65 Q1160,25 1200,25"
        fill="none"
        stroke="#7a5a3a"
        stroke-width="2"
        transform="translate(0, -2)"
        opacity="0.6"
      />
    </svg>

    <!-- Right Ports -->
    <div class="port port-r-1"></div>
    <div class="port port-r-2"></div>
  </div>
</template>

<style scoped>
  /* --- Wires --- */
  .wire-assembly {
    position: absolute;
    bottom: 0px;
    left: 4px;
    right: 4px;
    height: 60%;
    pointer-events: none;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .wire-svg {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: visible;
  }

  .port {
    width: 14px;
    height: 20px;
    background: #333;
    border: 2px solid #222;
    border-radius: 3px;
    position: absolute;
    z-index: 6;
    /* Inset shadow for depth + drop shadow for placement */
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.9), 2px 2px 5px rgba(0, 0, 0, 0.5);
  }

  /* Left Ports */
  .port-l-1 {
    left: -6px;
    top: 24px;
  } /* Aligns with y=25 (Brown) center approx */
  .port-l-2 {
    left: -6px;
    top: 68px;
  } /* Aligns with y=55 (Blue) center approx */

  /* Right Ports */
  .port-r-1 {
    right: -6px;
    top: 24px;
  }
  .port-r-2 {
    right: -6px;
    top: 68px;
  }

  @media (max-width: 1000px) {
    .wire-assembly {
      display: none;
    }
  }
</style>
