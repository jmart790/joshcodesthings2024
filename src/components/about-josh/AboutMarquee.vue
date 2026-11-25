<template>
  <div class="about-marquee" aria-hidden="true">
    <div class="about-marquee__stage">
      <div
        v-for="(col, ci) in columns"
        :key="ci"
        class="about-marquee__col"
        :class="{ 'about-marquee__col--reverse': col.reverse }"
        :style="{ '--duration': col.duration + 's', '--delay': col.delay + 's', '--scroll-distance': '50%' }"
      >
        <div class="about-marquee__track" :ref="(el) => setTrackEl(el as HTMLElement | null, ci)">
          <article v-for="(card, i) in col.cards" :key="i" class="glass-card">
            <div class="glass-card__head">
              <img v-if="card.icon" :src="card.icon" :alt="card.title" class="glass-card__icon" />
              <h3 class="glass-card__title">{{ card.title }}</h3>
            </div>
            <p class="glass-card__text">{{ card.text }}</p>
          </article>
        </div>
      </div>
    </div>
    <div class="about-marquee__fade about-marquee__fade--top"></div>
    <div class="about-marquee__fade about-marquee__fade--bottom"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted } from 'vue';

  export interface Slide {
    title: string;
    text: string;
    icon?: string;
  }

  const props = withDefaults(
    defineProps<{
      slides: Slide[];
      columnCount?: number;
      repeat?: number;
    }>(),
    {
      slides: () => [],
      columnCount: 5,
      repeat: 3
    }
  );

  // Multiplies the about-me slides per column, rotating the start point and
  // duplicating the run so the vertical scroll loops with no visible seam.
  const columns = computed(() => {
    const base = props.slides;
    if (!base.length) return [];

    return Array.from({ length: props.columnCount }, (_, ci) => {
      const offset = ci % base.length;
      const rotated = [...base.slice(offset), ...base.slice(0, offset)];
      const run = Array.from({ length: props.repeat }, () => rotated).flat();

      return {
        cards: [...run, ...run],
        reverse: ci % 2 === 1,
        duration: 26 + ci * 5,
        delay: -(ci * 4)
      };
    });
  });

  // The loop animates to translateY(-50%), which normally resolves against
  // the track's *current* height. A hovered card growing to reveal its
  // full text would change that height and throw off every other card's
  // position mid-scroll. So instead we measure each track's natural
  // (unhovered) half-height once and drive the loop off a fixed pixel
  // distance via --scroll-distance, which a single card's hover-expand
  // never touches.
  const trackEls: (HTMLElement | null)[] = [];

  const setTrackEl = (el: HTMLElement | null, ci: number) => {
    trackEls[ci] = el;
  };

  const measureTracks = () => {
    for (const el of trackEls) {
      if (!el) continue;
      el.style.setProperty('--scroll-distance', `${el.scrollHeight / 2}px`);
    }
  };

  onMounted(async () => {
    await nextTick();
    measureTracks();
    window.addEventListener('resize', measureTracks);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', measureTracks);
  });
</script>

<style scoped>
  .about-marquee {
    position: absolute;
    inset: -10%;
    z-index: 1;
    overflow: hidden;
    pointer-events: none;
    perspective: 1400px;
  }

  .about-marquee__stage {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: row;
    gap: 1.25rem;
    padding: 2rem;
    /* preserve-3d is required: flattening the stage breaks the cards'
       backdrop-filter (clipping, flicker, blank frosted cards). */
    transform-style: preserve-3d;
    transform: rotateX(18deg) rotateY(-14deg) rotateZ(9deg) scale(1.15);
  }

  .about-marquee__col {
    flex: 1 0 220px;
    height: 100%;
    overflow: hidden;
    /* Under the preserve-3d tilt, Chrome hit-tests this overflow:hidden column
       ahead of its own cards wherever the plane tilts toward the viewer, so
       hover died on the lower/right cards. Let the track take the pointer. */
    pointer-events: none;
  }

  .about-marquee__track {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;
    pointer-events: auto;
    animation: about-marquee-scroll var(--duration) linear infinite;
    animation-delay: var(--delay);
  }

  .about-marquee__track:hover {
    animation-play-state: paused;
  }

  .about-marquee__col--reverse .about-marquee__track {
    animation-direction: reverse;
  }

  @keyframes about-marquee-scroll {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-1 * var(--scroll-distance, 50%)));
    }
  }

  .glass-card {
    flex-shrink: 0;
    width: 100%;
    padding: 1.1rem 1.25rem;
    border-radius: 1.1rem;
    color: #eafcff;
    background: linear-gradient(160deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.04) 60%, rgba(120, 200, 255, 0.06) 100%);
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 0 24px rgba(120, 200, 255, 0.08);
    backdrop-filter: blur(14px) saturate(150%);
    -webkit-backdrop-filter: blur(14px) saturate(150%);
    cursor: default;
    transition: background 0.35s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .glass-card:hover {
    background: linear-gradient(160deg, rgba(4, 8, 18, 0.78) 0%, rgba(4, 8, 18, 0.62) 60%, rgba(10, 30, 55, 0.5) 100%);
    border-color: rgba(174, 254, 255, 0.85);
    box-shadow:
      0 8px 30px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      0 0 18px rgba(174, 254, 255, 0.55),
      0 0 4px rgba(174, 254, 255, 0.8);
  }

  .glass-card__head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.5rem;
  }

  .glass-card__icon {
    width: 28px;
    height: 28px;
    object-fit: contain;
    image-rendering: pixelated;
    filter: drop-shadow(0 0 4px rgba(110, 220, 217, 0.5));
    flex-shrink: 0;
  }

  .glass-card__title {
    margin: 0;
    font-family: 'Press Start 2P', cursive, monospace;
    font-size: 0.72rem;
    line-height: 1.4;
    text-transform: uppercase;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.6);
  }

  .glass-card__text {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 500;
    line-height: 1.55;
    color: rgba(234, 252, 255, 0.85);
  }

  .about-marquee__fade {
    position: absolute;
    inset-inline: 0;
    z-index: 1;
    height: 22%;
    pointer-events: none;
  }

  .about-marquee__fade--top {
    top: 0;
    background: linear-gradient(to bottom, #050510, transparent);
  }

  .about-marquee__fade--bottom {
    bottom: 0;
    background: linear-gradient(to top, #050510, transparent);
  }

  /* Tablet and below: same pixel distance on a smaller, more zoomed-in screen
     reads as faster, so stretch every column's loop. Raise to slow further. */
  @media (max-width: 1024px) {
    .about-marquee__track {
      animation-duration: calc(var(--duration) * 1.75);
    }
  }

  @media (max-width: 768px) {
    .about-marquee__stage {
      transform: rotateX(16deg) rotateY(-10deg) rotateZ(6deg) scale(1.3);
    }
    .about-marquee__col {
      flex-basis: 150px;
    }
    .glass-card {
      padding: 0.85rem 0.9rem;
    }
    .glass-card__title {
      font-size: 0.6rem;
    }
    .glass-card__text {
      font-size: 0.78rem;
    }
  }

  /* Phones: two wide columns that fill the screen (the rest hide) instead of
     five narrow ones, so cards read as two clear rotating columns and wider
     cards wrap into fewer, shorter lines. Inline padding keeps both columns
     on screen after the tilt. */
  @media (max-width: 480px) {
    .about-marquee__stage {
      padding: 2rem 12%;
      transform: rotateX(14deg) rotateY(-8deg) rotateZ(5deg) scale(1.05);
    }
    .about-marquee__col {
      flex-basis: 0;
    }
    .about-marquee__col:nth-child(n + 3) {
      display: none;
    }
  }
</style>
