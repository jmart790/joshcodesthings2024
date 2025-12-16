<template>
  <li class="log-item" :class="{ active: isActive }" @click="$emit('click')">
    <div class="thumb-frame">
      <img :src="`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`" alt="thumbnail" class="log-thumb" />
    </div>
    <div class="log-info">
      <span class="log-title">{{ video.title }}</span>
    </div>
  </li>
</template>

<script setup>
  defineProps({
    video: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  });

  defineEmits(['click']);
</script>

<style scoped>
  .log-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
    padding: 4px;
  }

  .log-item:hover {
    background: rgba(0, 91, 181, 0.2);
  }

  .log-item.active {
    opacity: 1;
    background: rgba(0, 64, 128, 0.3);
  }

  .thumb-frame {
    width: 70px;
    height: 50px;
    border: 2px solid #444;
    padding: 2px;
    background: #000;
    flex-shrink: 0;
    position: relative;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  .log-item.active .thumb-frame {
    border-color: transparent; /* Hide base border when active */
  }

  /* Corner Bracket Implementation using gradients for pixel-perfect control */
  .log-item.active .thumb-frame::after {
    content: '';
    position: absolute;
    inset: -4px; /* Extend slightly outside the frame */
    border: none;

    /* Draw 8 lines (2 per corner) to form brackets */
    background: 
    /* Top Left */ linear-gradient(#ffcc00, #ffcc00) top left,
      linear-gradient(#ffcc00, #ffcc00) top left, /* Top Right */ linear-gradient(#ffcc00, #ffcc00) top right,
      linear-gradient(#ffcc00, #ffcc00) top right, /* Bottom Right */ linear-gradient(#ffcc00, #ffcc00) bottom right,
      linear-gradient(#ffcc00, #ffcc00) bottom right, /* Bottom Left */ linear-gradient(#ffcc00, #ffcc00) bottom left,
      linear-gradient(#ffcc00, #ffcc00) bottom left;

    /* Size of the lines: Horizontal (15px wide, 3px tall) vs Vertical (3px wide, 15px tall) */
    background-size: 15px 3px, 3px 15px, /* TL */ 15px 3px, 3px 15px, /* TR */ 15px 3px, 3px 15px, /* BR */ 15px 3px,
      3px 15px; /* BL */

    background-repeat: no-repeat;

    filter: drop-shadow(0 0 2px #ffcc00);
    animation: flashBracket 1s infinite alternate;
  }

  /* Remove the old before/after if present from copy-paste safety */
  .log-item.active .thumb-frame::before {
    display: none;
  }

  @keyframes flashBracket {
    from {
      filter: drop-shadow(0 0 2px #ffcc00);
      opacity: 0.7;
    }
    to {
      filter: drop-shadow(0 0 6px #ffe600);
      opacity: 1;
    }
  }

  .log-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .log-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 50px;
  }

  .log-title {
    color: #aaddff;
    font-family: monospace;
    font-size: 0.75rem;
    line-height: 1.2;
    text-transform: uppercase;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  }

  .log-item.active .log-title {
    color: #fff;
    text-shadow: 0 0 4px #005bb5;
  }
</style>
