<template>
  <div class="work-history-page">
    <section class="slider">
      <template v-for="(yoshImage, index) in yoshImages" :key="`slide-${index}`">
          <article class="slide" v-if="index === activeIndex">
            <div class="dialog-container">
              <CharDescriptionCard is-open name="Yosh" :desc="yoshDialogue[activeIndex]" size="sm" is-name-blue />
            </div>
            <div class="dialog-container">
              <CharDescriptionCard
                :is-open="historyManDialogOpen"
                name="History Man"
                :desc="historyManDialogue[activeIndex]"
                size="sm"
              />
            </div>
              <picture class="slide-image left" :class="`left-${index}`">
                <img :src="yoshImage" alt="Yosh Slide Image" />
              </picture>

              <picture class="slide-image right" :class="`right-${index}`">
                <img :src="historyManImages[index]" alt="HistoryMan Slide Image" />
              </picture>
          </article>
      </template>
    </section>
    <div class="buttons">
      <button @click="prev">Prev</button>
      <button @click="next">Next</button>
    </div>
  </div>
</template>

<script setup>
  const yoshImages = [
    '/yoshx_standing.webp',
    '/yoshx_holdingswordhigh.webp',
    '/yoshx_fallingwithsword.webp',
    '/yoshx_crouchingwithsword.webp',
    '/yoshx_clenchingkatapose.webp',
    '/yoshx_shootinginair.webp'
  ];

  const historyManImages = [
    '/historyman_standingfirm.webp',
    '/historyman_readystance.webp',
    '/historyman_shooting.webp',
    '/historyman_bendingover.webp',
    '/historyman_jumping.webp',
    '/historyman_punching.webp'
  ];

  const yoshDialogue = [
    'Alright, History-Man, I’m here to take back what you’ve stolen. Hand over Josh’s work history, and no one gets hurt!',
    'Not bad, but I’m not leaving with just one piece of the puzzle. What else you got on him?',
    'You’re not off the hook yet, History-Man. I need more!',
    "Alright, you've told me about his recent exploits, but where did Josh start in tech?",
    'That’s some solid tech experience. But what built that foundation?',
    'You’ve given me bits and pieces, but I need the full picture. What’s Josh’s story, History-Man? Why should anyone hire him?'
  ];

  const historyManDialogue = [
    'Ah, Yosh, always so direct. Fine, I’ll give you a taste. Let’s start with his time at Sion Central. Josh wasn’t just any developer; he was the Senior Front End Developer who led the charge on a comprehensive design system using Storybook. This wasn’t just about making things pretty—it ensured smooth collaboration across design, development, product, and marketing teams. He even reduced project vulnerabilities from 57 to just 2 and executed a seamless migration from Webpack 4 to Webpack 5. Oh, and don’t forget the end-to-end testing with Cypress. If you’re looking for reliability, Josh was your guy.',
    'Eager, aren’t we? Well, at Juniper Market, Josh wasn’t just building front ends—he was transforming the business. He implemented design layouts using Vue, Nuxt, and Typescript, and improved the app’s search performance by 136%, which led to a 23% increase in conversions. And that’s not all—he led code review sessions, mentored junior developers, and built a design system using Storybook that integrated seamlessly with Contentful CMS. He even architected the user interface for the shopping cart and checkout, making the entire user journey smoother. Sounds like someone who not only codes but drives results, doesn’t it?',
    'Patience, my dear Yosh. Let’s talk about Health Karma. Josh was the front-end mastermind behind their NUXT application, streamlining communication between healthcare providers and consumers. But that’s just the start—he also managed massive amounts of data from thousands of healthcare providers and consumers, working closely with designers to create UX-focused applications. He even led the development of a static-generated blog site to drive traffic to the main application. And don’t forget, he was the brains behind their design system using Vue and Storybook, ensuring a consistent user experience across multiple applications. He was the glue that held their front end together.',
    'Josh got his first taste of the tech world as a Software QA Intern at Claro Enterprise Solutions. But this wasn’t just any internship—Josh was a force to be reckoned with. He took on regressive testing across multiple staging environments, making sure that everything was running smoothly before it went live. He meticulously documented every bug and inconsistency, collaborating with the development team to troubleshoot and resolve issues.',
    'Ah, the true origin story. Before entering the tech world, Josh served his country in the United States Navy as a Petty Officer Second Class. He wasn’t just following orders—he was leading teams. Josh managed the safe and efficient transportation of 2,700 sailors daily and was fully accountable for inspecting and issuing ordnance, ensuring everything was ready for action. His leadership saved the Navy millions in maintenance and parts. The discipline, attention to detail, and leadership he honed in the Navy laid the groundwork for everything he achieved later. Josh’s military background isn’t just a footnote—it’s the bedrock of his success in the tech world.',
    'Alright, Yosh, here it is. Josh isn’t just another developer—he’s a game-changer. From leading at Sion Central, enhancing search and mentoring at Juniper Market, to building systems at Health Karma, Josh has proven he’s the real deal. His journey started with disciplined leadership in the Navy and solidified with QA expertise at Claro. He’s got the skills, the leadership, and the drive to elevate any team he joins. Hiring Josh isn’t just filling a role; it’s adding a powerhouse to your ranks.'
  ];

  const activeIndex = ref(0);
  const historyManDialogOpen = ref(false);
  const next = () => {
    if (activeIndex.value === yoshImages.length - 1) return;
    activeIndex.value += 1;
  };

  const prev = () => {
    if (activeIndex.value === 0) return;
    activeIndex.value -= 1;
  };

  const delayOpen = () => {
    historyManDialogOpen.value = false;
    setTimeout(() => {
      historyManDialogOpen.value = true;
    }, 5000);
  };

  watch(
    () => activeIndex.value,
    () => {
      delayOpen();
    },
    { immediate: true }
  );
</script>

<style scoped>
  .work-history-page {
    background-image: url('/historymanstage.webp');
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top center;
    position: relative;
    overflow: hidden;
  }

  .slider {
    position: relative;
    display: grid;
    width: 90%;
    margin-inline: auto;
    height: 100%;
  }

  .slide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: center;
    align-items: flex-end;
    width: 100%;
    height: 100vh;
    scroll-snap-align: start;
    position: relative;
    /* overflow: hidden; */
  }

  .slide-image {
    display: flex;
    animation: fadeInFromLeft ease-in;
    animation-duration: 300ms;
    animation-fill-mode: forwards;
  }

.slide-image.right {
  animation: fadeInFromRight ease-in;
  animation-duration: 300ms;
  animation-fill-mode: forwards;
}


   @keyframes fadeInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  @keyframes fadeInFromRight {
    from {
      opacity: 0;
      transform: translateX(25%);
      scale: 0.9;
    }
    to {
      opacity: 1;
      transform: translateX(0);
      scale: 1;
    }
  }

  img {
    position: relative;
    display: block;
    margin-inline: auto;
    margin-block: auto 0;
    width: 60%;
    height: auto;
  }
  .slide-image {
    height: 100%;
  }

  .slide-image.left-1 img,
  .slide-image.right-2 img {
    margin-inline: auto 0;
  }

  .slide-image.right-1 img,
  .slide-image.left-2 img,
  .slide-image.right-3 img,
  .slide-image.right-4 img,
  .slide-image.left-5 img,
  .slide-image.right-5 img {
    margin-inline: 0 auto;
  }
  .slide-image.left-2 img,
  /* .slide-image.right-3 img, */
  .slide-image.right-4 img,
  .slide-image.left-5 img {
    margin-block: auto;
  }

  .slide-image.left-1 img,
  .slide-image.right-1 img,
  .slide-image.left-2 img,
  .slide-image.right-2 img,
  .slide-image.left-3 img,
  .slide-image.right-3 img,
  .slide-image.left-5 img,
  .slide-image.right-5 img {
    transform: translateY(40px);
  }
  .slide-image.right-4 img {
    transform: translate(-40%, 12%);
  }

  .dialog-container {
    position: absolute;
    top: 10%;
    left: 2%;
    transform: perspective(1000px) rotateY(23deg) rotateX(348deg);
  }
  .dialog-container:last-of-type {
    top: 10%;
    left: unset;
    right: 2%;
    transform: perspective(1000px) rotateY(-23deg) rotateX(348deg);
    z-index: 10;
  }

  .buttons {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    gap: 1rem;
    z-index: 50;
  }

  .buttons button {
    font-family: 'Press Start 2P', cursive, Arial, sans-serif;
    font-size: 24px;
    margin: 10px 0;
    cursor: pointer;
    transition: all 0.3s;
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
</style>
