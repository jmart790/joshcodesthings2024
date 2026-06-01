<template>
  <div class="about-me-page">
    <div class="about-me-page__background" aria-hidden="true">
      <div class="about-me-page__stars"></div>
      <img class="about-me-page__planet about-me-page__planet--sun" src="/sun isolate.webp" alt="" />
      <img class="about-me-page__planet about-me-page__planet--earth" src="/earth isolate.webp" alt="" />
      <div class="about-me-page__mirror-man-wrap">
        <img class="about-me-page__mirror-man" src="/mirror man isolate.webp" alt="" />
      </div>
      <img class="about-me-page__moon" src="/moon bg isolate.webp" alt="" />
    </div>
    <div class="back-button">
      <RetroButton @click="$router.push('/')">&lt; Back</RetroButton>
    </div>
    <AboutCube :slides="slides" class="about-me-page__carousel" />
  </div>
</template>

<script setup lang="ts">
  import AboutCube, { type Slide } from '@/components/about-josh/AboutCube.vue';
  import RetroButton from '../components/shared/RetroButton.vue';

  const slides: Slide[] = [
    {
      title: 'The Foundation',
      text: 'A proud Navy veteran, Josh spent six years traveling the globe aboard an aircraft carrier. This formative experience instilled in him unwavering discipline, a deep appreciation for the power of diverse teams, and the tenacity to deliver results during critical crunch times, regardless of the obstacles.',
      icon: '/public/retro-icon_ship.webp'
    },
    {
      title: 'The Transition',
      text: 'Following his military service, Josh dove headfirst into the world of technology through continuing education and an intensive bootcamp. It was during this pivot that he discovered a genuine passion for front-end development, realizing he loved the process of bringing creative concepts to life through code.',
      icon: '/public/retro-icon_computer.webp'
    },
    {
      title: 'The Drive',
      text: 'Josh is motivated by building "cool," interesting things that solve real problems. His goal is to master User Experience (UX) challenges to make digital interactions smoother for everyone. He is currently looking to expand into open-source projects, aiming to build applications that tangibly improve everyday lives.',
      icon: '/public/retro-icon_idea.webp'
    },
    {
      title: 'The Enthusiast',
      text: 'When he steps away from the keyboard, Josh is a man of varied interests. He is a self-proclaimed coffee snob always hunting for the perfect roast, a dedicated plant parent tending to his indoor jungle, an avid hiker exploring new trails, and a world traveler seeking his next adventure.',
      icon: '/public/retro-icon_plant.webp'
    },
    {
      title: 'The Retro Gamer',
      text: 'A true retro game enthusiast at heart, Josh holds a special nostalgia for the pixelated classics of his childhood. His ultimate professional dream is to combine his coding skills with this passion to develop an indie game inspired by legendary titles like Mega Man X.',
      icon: '/public/retro-icon_helmet.webp'
    },
    {
      title: 'The Anchor',
      text: 'While passionate about code and creativity, Josh’s most significant achievements are found at home. Above all else, he is incredibly proud to be a dedicated father to two beautiful children and a loving partner to their mother, finding his deepest inspiration in his family.',
      icon: '/public/retro-icon_family.webp'
    }
  ];
</script>

<style scoped>
  .about-me-page {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #050510; /* Dark background to make glass pop */
    /* background-image: radial-gradient(circle at 20% 40%, rgba(0, 100, 255, 0.2) 0%, transparent 40%),
      radial-gradient(circle at 80% 60%, rgba(0, 255, 200, 0.1) 0%, transparent 40%); */
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
  }

  .about-me-page__background {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .about-me-page__stars,
  .about-me-page__stars::before,
  .about-me-page__stars::after {
    position: absolute;
    inset: 0;
    content: '';
    background-repeat: repeat;
    pointer-events: none;
  }

  .about-me-page__stars {
    z-index: 0;
    background-image:
      radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 1px, transparent 1.6px),
      radial-gradient(circle, rgba(180, 224, 255, 0.9) 0 1.5px, transparent 2.2px),
      radial-gradient(circle, rgba(255, 255, 255, 0.7) 0 0.75px, transparent 1.3px),
      radial-gradient(circle, rgba(120, 190, 255, 0.75) 0 1.25px, transparent 2px);
    background-position:
      3rem 2rem,
      9rem 6rem,
      15rem 4rem,
      21rem 10rem;
    background-size:
      7rem 8rem,
      11rem 10rem,
      13rem 9rem,
      17rem 14rem;
    opacity: 0.65;
  }

  .about-me-page__stars::before {
    background-image:
      radial-gradient(circle, rgba(255, 255, 255, 0.85) 0 2px, transparent 2.8px),
      radial-gradient(circle, rgba(210, 235, 255, 0.85) 0 1px, transparent 1.7px),
      radial-gradient(circle, rgba(255, 255, 255, 0.65) 0 0.75px, transparent 1.2px),
      radial-gradient(circle, rgba(112, 179, 255, 0.75) 0 1.5px, transparent 2.4px);
    background-position:
      5rem 9rem,
      12rem 3rem,
      19rem 13rem,
      26rem 5rem;
    background-size:
      19rem 17rem,
      9rem 11rem,
      15rem 13rem,
      23rem 19rem;
    opacity: 0.25;
    animation: stars-twinkle-bright 8.5s ease-in-out infinite;
    animation-delay: -2.5s;
  }

  .about-me-page__stars::after {
    background-image:
      radial-gradient(circle, rgba(255, 255, 255, 1) 0 2.4px, transparent 3.2px),
      radial-gradient(circle, rgba(145, 205, 255, 0.9) 0 1.8px, transparent 2.7px),
      radial-gradient(circle, rgba(255, 255, 255, 0.75) 0 1px, transparent 1.8px);
    background-position:
      7rem 12rem,
      18rem 7rem,
      28rem 16rem;
    background-size:
      29rem 23rem,
      21rem 18rem,
      25rem 21rem;
    opacity: 0.2;
    animation: stars-twinkle-soft 11s ease-in-out infinite;
    animation-delay: -6s;
  }

  .about-me-page__planet {
    position: absolute;
    z-index: 1;
    display: block;
    object-fit: contain;
    user-select: none;
    will-change: transform;
  }

  .about-me-page__planet--sun {
    top: 8%;
    right: 8%;
    width: min(26vw, 320px);
    filter: drop-shadow(0 0 1.5rem rgba(255, 146, 44, 0.7)) drop-shadow(0 0 4rem rgba(255, 111, 0, 0.45));
    animation: hover-sun 7s ease-in-out infinite;
  }

  .about-me-page__planet--earth {
    right: 25%;
    top: 8%;
    width: min(50vw, 660px);
    animation: hover-earth 8s ease-in-out infinite;
  }

  .about-me-page__moon {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    width: 100%;
    max-height: 45vh;
    object-fit: cover;
    object-position: bottom center;
    filter: drop-shadow(0 0 1.25rem rgba(255, 255, 255, 0.5)) drop-shadow(0 0 3rem rgba(205, 230, 255, 0.3));
    user-select: none;
  }

  .about-me-page__mirror-man-wrap {
    position: absolute;
    left: 5%;
    bottom: 1vh;
    z-index: 2;
    width: min(50vw, 800px);
    filter: drop-shadow(-0.25rem -0.25rem 0.85rem rgba(255, 255, 255, 0.311));
  }

  .about-me-page__mirror-man-wrap::after {
    content: '';
    position: absolute;
    left: -12%;
    right: 35%;
    bottom: -12rem;
    height: 20rem;
    border-radius: 51%;
    background: rgba(0, 0, 0, 0.65);
    filter: blur(0.75rem);
    transform: skewX(-54deg) scaleX(-1.25);
    transform-origin: center;
    z-index: -1;
  }

  .about-me-page__mirror-man-wrap::before {
    content: '';
    position: absolute;
    left: 80%;
    top: 31%;
    width: 18%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(185, 226, 255, 0.95) 0%,
      rgba(40, 154, 255, 0.9) 24%,
      rgba(0, 76, 255, 0.55) 54%,
      rgba(0, 76, 255, 0) 76%
    );
    filter: blur(0.1rem);
    transform: translate(-50%, -50%) scale(0.88);
    animation: staff-glow-pulse 4s ease-in-out infinite;
    mix-blend-mode: screen;
    pointer-events: none;
    z-index: 2;
  }

  .about-me-page__mirror-man {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    filter: drop-shadow(-0.4rem 0.6rem 0.35rem rgba(0, 0, 0, 0.35));
    user-select: none;
  }

  .about-me-page__carousel {
    margin-left: 40%;
    position: relative;
    z-index: 1;
  }
  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 100;
  }

  @keyframes hover-sun {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(0.5rem, -0.75rem, 0);
    }
  }

  @keyframes hover-earth {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }
    50% {
      transform: translate3d(-0.4rem, 0.8rem, 0);
    }
  }

  @keyframes staff-glow-pulse {
    0%,
    100% {
      opacity: 0.55;
      transform: translate(-50%, -50%) scale(0.82);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.08);
    }
  }

  @keyframes stars-twinkle {
    0%,
    18%,
    100% {
      opacity: 0.45;
      filter: brightness(0.75) drop-shadow(0 0 0 rgba(180, 220, 255, 0));
    }
    28% {
      opacity: 1;
      filter: brightness(1.7) drop-shadow(0 0 0.35rem rgba(180, 220, 255, 0.65));
    }
    38% {
      opacity: 0.5;
      filter: brightness(0.85) drop-shadow(0 0 0 rgba(180, 220, 255, 0));
    }
  }

  @keyframes stars-twinkle-bright {
    0%,
    36%,
    64%,
    100% {
      opacity: 0.18;
      filter: brightness(0.65) drop-shadow(0 0 0 rgba(170, 215, 255, 0));
    }
    44% {
      opacity: 0.9;
      filter: brightness(1.85) drop-shadow(0 0 0.4rem rgba(170, 215, 255, 0.7));
    }
    52% {
      opacity: 0.24;
      filter: brightness(0.7) drop-shadow(0 0 0 rgba(170, 215, 255, 0));
    }
  }

  @keyframes stars-twinkle-soft {
    0%,
    58%,
    88%,
    100% {
      opacity: 0.14;
      filter: brightness(0.7) drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
    66% {
      opacity: 0.82;
      filter: brightness(1.75) drop-shadow(0 0 0.35rem rgba(255, 255, 255, 0.55));
    }
    74% {
      opacity: 0.18;
      filter: brightness(0.75) drop-shadow(0 0 0 rgba(255, 255, 255, 0));
    }
  }
</style>
