<template>
  <div class="container">
    <GameTitle />
    <div class="menu">
      <RetroButton
        v-for="(item, index) in menuItems"
        :key="index"
        :selected="index === selectedIndex"
        @click="clickToRoute(index)"
        @mouseover="selectMenuItem(index)"
      >
        {{ item }}
      </RetroButton>
      <img
        v-if="showWave"
        src="/yoshsprites/sprite wave.webp"
        alt="Wave Projectile"
        class="wave-image"
        :class="`position-${selectedIndex}`"
      />
      <img
        :src="`/yoshsprites/${currentSprite}`"
        alt="Character"
        class="character-image"
        :class="`position-${selectedIndex}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import GameTitle from '../components/home/GameTitle.vue';
  import RetroButton from '../components/shared/RetroButton.vue';

  const menuItems = ref<string[]>(['GAME START', 'PASSWORD', 'OPTIONS']);
  const selectedIndex = ref<number>(0);
  const currentSprite = ref<string>('sprite 1.webp');
  const showWave = ref<boolean>(false);

  const router = useRouter();

  const selectMenuItem = (index: number) => {
    selectedIndex.value = index;
  };

  const navigate = (menuItem: string) => {
    const routes: { [key: string]: string } = {
      'GAME START': '/stage-select',
      PASSWORD: '/password',
      OPTIONS: '/options'
    };

    return routes[menuItem] || '/';
  };

  const animateAndNavigate = async (index: number) => {
    const selectedMenuItem = menuItems.value[index];
    const route = navigate(selectedMenuItem);

    // Animation sequence: 1 -> 7 -> 1
    for (let i = 1; i <= 7; i++) {
      currentSprite.value = `sprite ${i}.webp`;
      if (i === 6) {
        showWave.value = true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    // Reset to 1
    currentSprite.value = 'sprite 1.webp';

    // Wait for wave animation to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showWave.value = false;

    router.push(route);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        selectedIndex.value = (selectedIndex.value - 1 + menuItems.value.length) % menuItems.value.length;
        break;
      case 'ArrowDown':
        selectedIndex.value = (selectedIndex.value + 1) % menuItems.value.length;
        break;
      case 'Enter':
        animateAndNavigate(selectedIndex.value);
        break;
    }
  };

  const clickToRoute = (index: number) => {
    animateAndNavigate(index);
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
</script>

<style scoped>
  .container {
    --container-padding-block: 1rem;
    --cta-button-font-size: 24px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    min-height: 100dvh;
    padding: var(--container-padding-block) 1rem;
    overflow: hidden;
  }

  .menu {
    --character-height: 250px;
    --button-font-size: var(--cta-button-font-size);
    --menu-item-height: var(--button-font-size);
    --menu-row-gap: 20px;
    --character-left: -140%;
    --wave-start: -120%;
    --wave-end: 700%;
    --button-margin-block: 10px;
    --character-glow: 0 0 60px #ffffff9d;
    --menu-margin-top: 0;

    position: relative;
    flex-direction: column;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: var(--menu-margin-top);
    animation: fade-in 0.8s ease-out 1.6s both;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .menu-item {
    position: relative;
    z-index: 100;
  }

  .character-image {
    position: absolute;
    left: var(--character-left);
    height: var(--character-height);
    transition: transform 0.3s; /* Smooth transition when changing active item */
    filter: drop-shadow(var(--character-glow));
  }

  @keyframes waveTravel {
    0% {
      left: var(--wave-start);
      height: var(--character-height);
    }
    100% {
      left: var(--wave-end);
      height: calc(var(--character-height) * 2);
    }
  }

  .wave-image {
    position: absolute;
    left: var(--wave-start);
    height: var(--character-height);
    animation: waveTravel 2s linear forwards;
    z-index: 5; /* Ensure it's behind menu items but visible */
  }

  .position-0 {
    transform: translateY(calc(-50% + 0 * (var(--menu-item-height) + var(--menu-row-gap))));
  }

  .position-1 {
    transform: translateY(calc(-50% + 1 * (var(--menu-item-height) + var(--menu-row-gap))));
  }

  .position-2 {
    transform: translateY(calc(-50% + 2 * (var(--menu-item-height) + var(--menu-row-gap))));
  }

  .menu :deep(.retro-button) {
    font-size: var(--button-font-size);
    margin-block: var(--button-margin-block);
  }

  /* desktop: mirrors --breakpoint-desktop */
  @media (max-width: 1200px) {
    .menu {
      --character-height: 190px;
      --menu-row-gap: 18px;
      --character-left: -118%;
      --wave-start: -104%;
      --wave-end: 520%;
      --button-margin-block: 9px;
    }
  }

  /* tablet: mirrors --breakpoint-tablet */
  @media (max-width: 720px) {
    .container {
      --container-padding-block: 1.5rem;
      --cta-button-font-size: clamp(14px, 4vw, 20px);
    }

    .menu {
      --character-height: 135px;
      --menu-row-gap: 16px;
      --character-left: -88%;
      --wave-start: -78%;
      --wave-end: 390%;
      --button-margin-block: 8px;
      --character-glow: 0 0 36px #ffffff9d;
      --menu-margin-top: 0.5rem;
    }
  }

  /* mobile: mirrors --breakpoint-mobile */
  @media (max-width: 480px) {
    .menu {
      --character-height: 112px;
      --character-left: -76%;
      --wave-start: -68%;
      --wave-end: 330%;
    }
  }

  /* short-screen: mirrors --breakpoint-short-screen */
  @media (max-height: 620px) {
    .menu {
      --character-height: 120px;
      --button-margin-block: 6px;
    }
  }
</style>
