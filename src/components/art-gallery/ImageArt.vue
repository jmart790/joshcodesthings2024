<template>
  <div class="image-art-wrapper">
    <div class="frame cute-frame">
      <img :src="src" :alt="alt" class="art-image" />
    </div>
    <div class="art-info" :class="{ visible: showInfo }">
      <h3 class="art-name">{{ name }}</h3>
      <p class="art-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'Unknown Art'
    },
    desc: {
      type: String,
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: false
    }
  });
</script>

<style scoped>
  .image-art-wrapper {
    position: relative;
    width: 100%;
    height: auto;
  }

  /* look comes from the global .cute-frame (src/styles/cute-frame.css) */
  .frame {
    width: 100%;
    height: auto;
    z-index: 1;
  }

  .art-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
  }

  /* Label: a sticker-style speech bubble that pops in beside the frame, its
     tail pointing at the art. Desktop: right of the art. */
  .art-info {
    --bubble-pink: #ff5fa2;

    position: absolute;
    top: 50%;
    left: 80%;
    z-index: 0;
    width: auto;
    padding: 0.9em 1.4em;
    background: #fff;
    border: 4px solid var(--bubble-pink);
    border-radius: 24px;
    box-shadow:
      0 6px 0 var(--bubble-pink),
      0 12px 20px rgba(90, 20, 60, 0.3);
    color: #7a4a6a;
    text-align: left;
    font-family: 'Saira', sans-serif;
    pointer-events: none;
    opacity: 0;
    transform-origin: left center;
    transform: translateY(-50%) translateX(20px) scale(0.6);
    transition:
      opacity 0.25s ease,
      transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); /* springy pop */
  }

  /* tail: a rotated square on the edge facing the art */
  .art-info::before {
    content: '';
    position: absolute;
    top: 50%;
    left: -14px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-left: 4px solid var(--bubble-pink);
    border-bottom: 4px solid var(--bubble-pink);
    translate: 0 -50%;
    rotate: 45deg;
  }

  .art-info.visible {
    opacity: 1;
    transform: translateY(-50%) translateX(75%) scale(1);
  }

  .art-name {
    margin: 0 0 0.25rem;
    font-size: 3rem;
    font-weight: 800;
    line-height: 1.1;
    color: var(--bubble-pink);
    text-transform: uppercase;
    letter-spacing: 2px;
    white-space: nowrap;
  }

  .art-desc {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.3;
    white-space: nowrap;
  }

  /* Portrait: the art sits right of center (aimed down the hallway), so mirror
     the bubble to the left side, tail pointing right. Capped width and wrapping
     keep long names (Master Splinter) on screen. */
  @media (orientation: portrait) {
    .art-info {
      left: auto;
      right: 100%;
      width: max-content;
      max-width: 60%;
      text-align: right;
      transform-origin: right center;
      transform: translateY(-50%) translateX(0) scale(0.6);
    }

    .art-info::before {
      left: auto;
      right: -14px;
      rotate: -135deg;
    }

    .art-info.visible {
      transform: translateY(-50%) translateX(-36px) scale(1);
    }

    .art-name,
    .art-desc {
      white-space: normal;
    }

    /* longest single word (MICHELANGELO) must fit the 60% cap unbroken */
    .art-name {
      font-size: 2.25rem;
    }
  }

  /* Phones: no room beside the art, so the bubble sits above it (clear of the
     tape), as wide as the art, tail pointing down. */
  @media (orientation: portrait) and (max-width: 767px) {
    .art-info {
      top: auto;
      bottom: calc(100% + 28px);
      left: 0;
      right: 0;
      width: auto;
      max-width: none;
      padding-inline: 0.8em;
      text-align: center;
      transform-origin: center bottom;
      transform: translateY(16px) scale(0.6);
    }

    .art-info::before {
      top: auto;
      bottom: -14px;
      left: 50%;
      right: auto;
      translate: -50% 0;
      rotate: -45deg;
    }

    .art-info.visible {
      transform: none;
    }

    /* MICHELANGELO fits the art's width unbroken */
    .art-name {
      font-size: 2rem;
    }
  }
</style>
