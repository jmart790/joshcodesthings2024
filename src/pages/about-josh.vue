<template>
  <div class="about-me-page">
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
    background-image: url('/public/mirrorman_bg.webp');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    overflow: hidden;
  }
  .about-me-page__carousel {
    margin-left: 40%;
  }
  .back-button {
    position: absolute;
    top: 2rem;
    left: 2rem;
    z-index: 100;
  }
</style>
