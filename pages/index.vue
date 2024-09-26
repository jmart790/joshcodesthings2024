<template>
  <div class="container">
    <header>
      <div class="title-wrapper">
        <h1 class="title"><span class="first-letter">J</span>osh<span class="first-letter">C</span>odes</h1>
        <p class="title-border"><span class="first-letter">J</span>osh<span class="first-letter">C</span>odes</p>
        <p class="title-border"><span class="first-letter">J</span>osh<span class="first-letter">C</span>odes</p>
      </div>
      <div class="gold-wrapper">
        <div class="title-wrapper gold things">
          <h1 class="title gold"><span class="first-letter">T</span>hings</h1>
          <p class="title-border gold"><span class="first-letter">T</span>hings</p>
          <p class="title-border gold"><span class="first-letter">T</span>hings</p>
        </div>
        <div class="title-wrapper gold com">
          <h1 class="title gold"><span class="first-letter">D</span>ot<span class="first-letter pl">C</span>om</h1>
          <p class="title-border gold"><span class="first-letter">D</span>ot<span class="first-letter pl">C</span>om</p>
          <p class="title-border gold"><span class="first-letter">D</span>ot<span class="first-letter pl">C</span>om</p>
        </div>
      </div>
      <div class="red-bg" />
    </header>
    <div class="menu">
      <button 
        v-for="(item, index) in menuItems" 
        :key="index" 
        :class="['menu-item', { 'selected': index === selectedIndex }]" 
        @click="clickToRoute(index)"
        @mouseover="selectMenuItem(index)"
      >
        {{ item }}
      </button>
      <img src="/YoshX.webp" alt="Character" class="character-image" :class="`position-${selectedIndex}`" />
    </div>
  </div>
</template>


<script setup lang="ts">

const menuItems = ref<string[]>(['GAME START', 'PASSWORD', 'OPTIONS']);
const selectedIndex = ref<number>(0);

const router = useRouter();

const selectMenuItem = (index: number) => {
  selectedIndex.value = index;
};

const navigate = (menuItem: string) => {
  const routes: { [key: string]: string } = {
    'GAME START': '/stage-select',
    'PASSWORD': '/password',
    'OPTIONS': '/options'
  };

  return routes[menuItem] || '/';
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
      const selectedMenuItem = menuItems.value[selectedIndex.value];
      const route = navigate(selectedMenuItem);
      router.push(route);
      break;
  }
};

const clickToRoute = (index: number) => {
  const selectedMenuItem = menuItems.value[index];
  const route = navigate(selectedMenuItem);
  router.push(route);
}

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
  height: 100%;
  background-color: #000119;
}

header {
  position: relative;
  margin-block: 8rem 16rem;
  text-transform: uppercase;
  display: flex;
}

.title-wrapper {
  position: relative;
  text-align: center;
  z-index: 10;
}

.gold-wrapper {
  width: 320px;
  height: 100px;
  margin-left: -9rem;
  z-index: 1;
}

.title-wrapper.gold.things {
  position: absolute;
  transform: rotate(-45deg) skew(57deg, 0deg) scaleX(1.1);
  z-index: 5;
}
.title-wrapper.gold.com {
  position: absolute;
  transform: rotate(45deg) skewX(331deg) translate(-1rem, 1rem);
  z-index: 4;
  white-space: nowrap;
}

.title, .title-border {
  position: relative;
  text-align: center;
  margin-bottom: 80px;
  margin: 0;
  transform: skew(-15deg);
  letter-spacing: 0.03em;
  
  font-family: "Saira", sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: 100px;
  display: inline-block;
  line-height: .9;  
}

.title {
  z-index: 5;
  background-image: linear-gradient(178deg, #235ba0 1%, #3163a4 11%, #4170ac 14%, #426ead 23%, #6388ba 31%, #7294bc 35%, #94adcf 39%, #bccede 47%, #a9bdd8 50%, #16529c 50%, #235ba0 71%, #406fab 78%, #6388ba 83%, #83a0c5 88%, #a8bcd7 95%, #cddae5 98%);
  -webkit-text-stroke: 0.01em #94a0b9;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.title.gold {
  transform: skew(-15deg) translate(-4px, -1px);
  background-image: linear-gradient(275deg, #b56c01 1%, #c07002 11%, #c46e02 14%, #cd7303 23%, #d67f06 31%, #de8c02 35%, #e39d03 39%, #e9ba00 47%, #f4d328 59%, #f8de39 50%, #905204 51%, #513100 78%, #583703 80%, #5a3600 83%, #613901 87%, #724103 90%, #7a4a02, #9c5a00 95%, #a96300 99%);
}
.com .title.gold {
  background-image: linear-gradient(96deg, #b56c01 1%, #c07002 11%, #c46e02 14%, #cd7303 23%, #d67f06 31%, #de8c02 35%, #e39d03 39%, #e9ba00 47%, #f4d328 59%, #f8de39 50%, #905204 51%, #513100 78%, #583703 80%, #5a3600 83%, #613901 87%, #724103 90%, #7a4a02, #9c5a00 95%, #a96300 99%);
}



.title-border {
  --color-background: #000119;
  --stroke-width: calc(1em / 8);
  --font-size: 30vmin;
  --font-weight: 700;
  --letter-spacing: calc(1em / 8);
  position: absolute;
  z-index: 2;
  left: -27px;
  top: 0;
  background-clip: text;
  width: 110%;
  background-image: linear-gradient(178deg, #81849d 1%, #9e9dbe 10%, #9ca1be 20%, #646b7c 30%, #8b90ad 40%, #3b404b 50%, #81849d 51%, #9e9dbe 55%, #9ca1be 60%, #646b7c 70%, #8b90ad 80%, #3b404b 90%);
  color: var(--color-background);
  padding: calc(--stroke-width / 2);
  -webkit-text-stroke-color: transparent;
  -webkit-text-stroke-width: var(--stroke-width);
}
.title-border.gold {
  background-image: linear-gradient(275deg, #d1a952 1%, #c07a09 10%, #f1d22f 20%, #eab625 30%, #efc935 40%, #ebb72b 50%, #fef187 51%, #f5ea8b 55%, #efcb1b 60%, #eecd5a 70%, #f2da5d 80%, #9c640f 90%, #291a03 98%);
}
.com .title-border.gold {
  background-image: linear-gradient(96deg, #d1a952 1%, #c07a09 10%, #f1d22f 20%, #eab625 30%, #efc935 40%, #ebb72b 50%, #fef187 51%, #f5ea8b 55%, #efcb1b 60%, #eecd5a 70%, #f2da5d 80%, #9c640f 90%, #291a03 98%);
}

.title-border:last-of-type {
  z-index: 1;
  text-shadow: 0 0 0.1rem #8ba2d07a, 0 0 0.2rem black,  0 0 1.5rem #1660f37c;
  -webkit-text-stroke: 0.06em rgba(black, 0.5);
}
.title-border.gold:last-of-type {
  text-shadow: 0 0 0.1rem #d1a9526e, 0 0 0.2rem black,  0 0 1.5rem #f2d95d80;
}

.first-letter {
  font-size: 120%;
}

.first-letter.pl {
  padding-left: .8em;
}

.red-bg {
  position: absolute;
  top: 40px;
  left: -32px;
  z-index: 3;
  content: '';
  width: 0;
  height: 0;
  border-right: 665px solid transparent;
  border-left: 86px solid transparent;
  border-top: 97px solid #940001;
  transform: skewX(355deg);
}

.menu {
  --character-height: 120px;
  --menu-item-height: 24px; /* Adjust based on your actual menu item height */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.menu-item {
  position: relative;
  font-family: "Press Start 2P", cursive, Arial, sans-serif;
  font-size: 24px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 1;
  border: none;
  background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.menu-item.selected {
  background: linear-gradient(to bottom, #fe9900 0%, #fe9900 25%, #f9e5bd 50%, #ff9900 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.character-image {
  position: absolute;
  left: -120%; /* Adjust as needed */
  height: var(--character-height);
  transition: transform 0.3s; /* Smooth transition when changing active item */
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
