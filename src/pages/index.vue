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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #101115;
    overflow: hidden;
    background-image: radial-gradient(circle at center, transparent 60%, #000000b1 100%),
      linear-gradient(rgba(19, 202, 58, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(19, 202, 58, 0.1) 1px, transparent 1px);
    background-size: 100% 100%, 40px 40px, 40px 40px;
    background-position: center;
  }

  .menu {
    --character-height: 250px;
    --menu-item-height: 24px; /* Adjust based on your actual menu item height */
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .menu-item {
    position: relative;
    z-index: 100;
  }

  .character-image {
    position: absolute;
    left: -140%; /* Adjust as needed */
    height: var(--character-height);
    transition: transform 0.3s; /* Smooth transition when changing active item */
    filter: drop-shadow(0px 0px 60px #ffffff9d);
  }

  @keyframes waveTravel {
    0% {
      left: -120%;
      height: var(--character-height);
    }
    100% {
      left: 700%;
      height: calc(var(--character-height) * 2);
    }
  }

  .wave-image {
    position: absolute;
    left: -120%;
    height: var(--character-height);
    animation: waveTravel 2s linear forwards;
    z-index: 5; /* Ensure it's behind menu items but visible */
  }

  .position-0 {
    transform: translateY(calc(-50% + 0 * (var(--menu-item-height) + 20px)));
  }

  .position-1 {
    transform: translateY(calc(-50% + 1 * (var(--menu-item-height) + 20px)));
  }

  .position-2 {
    transform: translateY(calc(-50% + 2 * (var(--menu-item-height) + 20px)));
  }
</style>
