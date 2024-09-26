<template>
  <div class="stage-select">
    <SphereGrid class="sphere-grid" />
    <div class="slider-container">
      <Slider
        :items="characters"
        :activeIndex="activeIndex"
        :positionOffset="positionOffset"
        :isSelected="isSelected"
      />
    </div>
    <div class="char-name">
      <ScrambleText :text="characters[activeIndex].name" />
    </div>
    <div class="buttons">
      <button @click="prev">Prev</button>
      <button @click="next">Next</button>
      <button @click="select">{{ isSelected ? 'Deselect' : 'Select'}}</button>
    </div>
    <div class="char-desc">
      <CharDescriptionCard  :isOpen="isSelected" :name="characters[activeIndex].name" :desc="characters[activeIndex].desc" size="md" @go-to-stage="navToCharPage" :is-name-blue="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const router = useRouter();
const characters = ref([
  {
    id: 1,
    image: '/computerman.webp',
    name: 'History Man',
    isActive: false,
    isSelected: false,
    page: '/work-history',
    desc: `He hoards all of Josh's work history, from the earliest projects to recent accomplishments. Residing in a vast, cloud-based archive filled with endless rows of servers, he claims Josh's achievements as his own, crafting a narrative that credits him with these milestones. In his quest to control the story, he leaves Josh to reclaim his true identity from the digital labyrinth.`
  },
  { 
    id: 2, 
    image: '/artgirl.webp', 
    name: 'Art Girl', 
    isActive: false, 
    isSelected: false,
    page: '/art-gallery',
    desc: `She safeguards Josh's AI-generated masterpieces in a hidden, ever-shifting art gallery. Here, she ensures each piece is displayed in full brilliance while wrestling with the question: If the art was made with AI, is it truly Josh's? As the protector of his creativity, she preserves the beauty that defines his collection, even as the line between creator and creation blurs.`
  },
  {
    id: 3,
    image: '/mirrorman.webp',
    name: 'Reflection Man',
    isActive: false,
    isSelected: false,
    page: '/about-josh',
    desc: `He guards all of Josh's deepest thoughts and secrets, threatening to leak them unless his demands are met. Lurking in a mirrored chamber where every surface reflects Josh's hidden truths, he manipulates this knowledge to his advantage. In this dark, introspective lair, he uses Josh's own secrets against him, making the stakes personal and high.`
  },
  {
    id: 4,
    image: '/projectsman.webp',
    name: 'Construction Man',
    isActive: false,
    isSelected: false,
    page: '/personal-projects',
    desc: `He hoards all of Josh's personal development projects in a construction yard resembling a startup. Amid half-built frameworks and scattered blueprints, he controls everything from fledgling ideas to fully realized applications. This chaotic yet industrious site is where he guards the blueprints and foundations of Josh's work, leaving him to retrieve what has been taken.`
  },
  {
    id: 5,
    image: '/musicman.webp',
    name: 'Music Man',
    isActive: false,
    isSelected: false,
    page: '/juke-box',
    desc: `He controls Josh's AI-generated music, remixing and claiming it as his own in a neon-lit studio filled with high-tech instruments. The studio pulses with rhythms and melodies, challenging the notion of authorship. As the beats echo through the chamber, he questions whether music created with AI truly belongs to Josh, keeping the compositions under his control.`
  },
  {
    id: 6,
    image: '/moshman.webp',
    name: 'Mosh',
    isActive: false,
    isSelected: false,
    page: '/mystery',
    desc: `He obscures the truth about his identity, hiding in the shadows of a lair filled with static screens and distorted reflections. His mission is shrouded in mystery, and his eerie resemblance to Yosh raises unsettling questions. Could they be the same, or is Mosh a dark reflection of the hero? As he moves through the shadows, his true intentions remain an enigma.`
  },
]);

const activeIndex = ref(0);
const isSelected = ref(false);
const positionOffset = ref(1);

const prev = () => {
  positionOffset.value += 1;
  activeIndex.value = (activeIndex.value - 1 + characters.value.length) % characters.value.length;
};

const next = () => {
  positionOffset.value -= 1;
  activeIndex.value = (activeIndex.value + 1) % characters.value.length;
};

const select = () => {
  isSelected.value = !isSelected.value
}

const navToCharPage = () => {
  const route = characters.value[activeIndex.value].page;
  router.push(route);

}
</script>

<style scoped>
.stage-select {
  position: relative;
  background-color: #d2d2d2;
  background: radial-gradient(circle, #d2d2d2, #020c29);
  overflow: hidden;
}
.sphere-grid {
  position: absolute;
  inset: -30% 0 0 0;
  height: 200%;
}

.buttons {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 5;
}

.char-name {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 1rem;
}

.char-desc {
  position: absolute;
  right: 10%;
  bottom: 20%;
  z-index: 100;
  height: 550px;
  width: 500px;
  transform: perspective(1000px) rotateY(-40deg) rotateX(0deg);
  transform-origin: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-container {
  width: 100%;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  position: relative;
  z-index: 2;
}

.buttons button {
  font-family: "Press Start 2P", cursive, Arial, sans-serif;
  font-size: 24px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s;
  line-height: 1;
  border: none;
  filter: drop-shadow(-4px 4px 2px black);
  background: linear-gradient(to bottom, #02a7f9 0%, #47c2ff 25%, #ccf2fd 50%, #00aaff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.buttons button:hover {
  background: linear-gradient(to bottom, #fe9900 0%, #fe9900 25%, #f9e5bd 50%, #ff9900 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.buttons button:last-of-type {
  width: 204px;
  margin-left: 2rem;
}
</style>
