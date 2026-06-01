<template>
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
</template>

<style scoped>
  header {
    --title-font-size: 100px;
    --title-margin-block: 8rem 16rem;
    --gold-width: 320px;
    --gold-height: 100px;
    --gold-margin-left: -9rem;
    --border-left: -27px;
    --red-bg-top: 40px;
    --red-bg-left: -32px;
    --red-bg-border-right: 665px;
    --red-bg-border-left: 86px;
    --red-bg-border-top: 97px;
    --com-translate-x: -1rem;
    --com-translate-y: 1rem;
    --pl-padding: 0.8em;

    position: relative;
    margin-block: var(--title-margin-block);
    text-transform: uppercase;
    display: flex;
  }

  .title-wrapper {
    position: relative;
    text-align: center;
    z-index: 10;
  }

  /* Main Title Animation */
  .title-wrapper:not(.gold) {
    animation: flicker-in-angle 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
  }

  .gold-wrapper {
    width: var(--gold-width);
    height: var(--gold-height);
    margin-left: var(--gold-margin-left);
    z-index: 1;
  }

  .title-wrapper.gold.things {
    position: absolute;
    transform: rotate(-45deg) skew(57deg, 0deg) scaleX(1.1);
    z-index: 5;
    animation: bar-to-x-things 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.8s backwards;
  }

  .title-wrapper.gold.com {
    position: absolute;
    transform: rotate(45deg) skewX(331deg) translate(var(--com-translate-x), var(--com-translate-y));
    z-index: 4;
    white-space: nowrap;
    animation: bar-to-x-com 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.8s backwards;
  }

  /* Keyframes */
  @keyframes flicker-in-angle {
    0% {
      opacity: 0;
      transform: translateX(-150px) skewX(30deg) scale(1.2);
      filter: blur(10px);
    }
    10% {
      opacity: 1;
      transform: translateX(-120px) skewX(20deg);
      filter: blur(0);
    }
    20% {
      opacity: 0;
      transform: translateX(-100px) skewX(10deg);
    }
    30% {
      opacity: 1;
      transform: translateX(-80px) skewX(0deg);
    }
    40% {
      opacity: 0;
    }
    50% {
      opacity: 1;
      transform: translateX(-40px);
    }
    70% {
      opacity: 1;
      transform: translateX(10px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bar-to-x-things {
    0% {
      /* Overlapping vertical bar state */
      transform: rotate(90deg) skew(0deg, 0deg) scaleX(1) translateX(50px);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      /* Final state */
      transform: rotate(-45deg) skew(57deg, 0deg) scaleX(1.1);
      opacity: 1;
    }
  }

  @keyframes bar-to-x-com {
    0% {
      /* Overlapping vertical bar state */
      transform: rotate(90deg) skew(0deg, 0deg) translateX(50px);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      /* Final state */
      transform: rotate(45deg) skewX(331deg) translate(var(--com-translate-x), var(--com-translate-y));
      opacity: 1;
    }
  }

  .title,
  .title-border {
    position: relative;
    text-align: center;
    margin-bottom: 80px;
    margin: 0;
    transform: skew(-15deg);
    letter-spacing: 0.03em;

    font-family: 'Saira', sans-serif;
    font-weight: 900;
    font-style: italic;
    font-size: var(--title-font-size);
    display: inline-block;
    line-height: 0.9;
  }

  .title {
    z-index: 5;
    background-image: linear-gradient(
      178deg,
      #235ba0 1%,
      #3163a4 11%,
      #4170ac 14%,
      #426ead 23%,
      #6388ba 31%,
      #7294bc 35%,
      #94adcf 39%,
      #bccede 47%,
      #a9bdd8 50%,
      #16529c 50%,
      #235ba0 71%,
      #406fab 78%,
      #6388ba 83%,
      #83a0c5 88%,
      #a8bcd7 95%,
      #cddae5 98%
    );
    -webkit-text-stroke: 0.01em #94a0b9;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .title.gold {
    transform: skew(-15deg) translate(-4px, -1px);
    background-image: linear-gradient(
      275deg,
      #b56c01 1%,
      #c07002 11%,
      #c46e02 14%,
      #cd7303 23%,
      #d67f06 31%,
      #de8c02 35%,
      #e39d03 39%,
      #e9ba00 47%,
      #f4d328 59%,
      #f8de39 50%,
      #905204 51%,
      #513100 78%,
      #583703 80%,
      #5a3600 83%,
      #613901 87%,
      #724103 90%,
      #7a4a02,
      #9c5a00 95%,
      #a96300 99%
    );
  }
  .com .title.gold {
    background-image: linear-gradient(
      96deg,
      #b56c01 1%,
      #c07002 11%,
      #c46e02 14%,
      #cd7303 23%,
      #d67f06 31%,
      #de8c02 35%,
      #e39d03 39%,
      #e9ba00 47%,
      #f4d328 59%,
      #f8de39 50%,
      #905204 51%,
      #513100 78%,
      #583703 80%,
      #5a3600 83%,
      #613901 87%,
      #724103 90%,
      #7a4a02,
      #9c5a00 95%,
      #a96300 99%
    );
  }

  .title-border {
    --color-background: #000119;
    --stroke-width: calc(1em / 8);
    --font-size: 30vmin;
    --font-weight: 700;
    --letter-spacing: calc(1em / 8);
    position: absolute;
    z-index: 2;
    left: var(--border-left);
    top: 0;
    background-clip: text;
    width: 110%;
    background-image: linear-gradient(
      178deg,
      #81849d 1%,
      #9e9dbe 10%,
      #9ca1be 20%,
      #646b7c 30%,
      #8b90ad 40%,
      #3b404b 50%,
      #81849d 51%,
      #9e9dbe 55%,
      #9ca1be 60%,
      #646b7c 70%,
      #8b90ad 80%,
      #3b404b 90%
    );
    color: var(--color-background);
    padding: calc(--stroke-width / 2);
    -webkit-text-stroke-color: transparent;
    -webkit-text-stroke-width: var(--stroke-width);
  }
  .title-border.gold {
    background-image: linear-gradient(
      275deg,
      #d1a952 1%,
      #c07a09 10%,
      #f1d22f 20%,
      #eab625 30%,
      #efc935 40%,
      #ebb72b 50%,
      #fef187 51%,
      #f5ea8b 55%,
      #efcb1b 60%,
      #eecd5a 70%,
      #f2da5d 80%,
      #9c640f 90%,
      #291a03 98%
    );
  }
  .com .title-border.gold {
    background-image: linear-gradient(
      96deg,
      #d1a952 1%,
      #c07a09 10%,
      #f1d22f 20%,
      #eab625 30%,
      #efc935 40%,
      #ebb72b 50%,
      #fef187 51%,
      #f5ea8b 55%,
      #efcb1b 60%,
      #eecd5a 70%,
      #f2da5d 80%,
      #9c640f 90%,
      #291a03 98%
    );
  }

  .title-border:last-of-type {
    z-index: 1;
    text-shadow:
      0 0 0.1rem #8ba2d07a,
      0 0 0.2rem black,
      0 0 1.5rem #1660f37c;
    -webkit-text-stroke: 0.06em rgba(black, 0.5);
  }
  .title-border.gold:last-of-type {
    text-shadow:
      0 0 0.1rem #d1a9526e,
      0 0 0.2rem black,
      0 0 1.5rem #f2d95d80;
  }

  .first-letter {
    font-size: 120%;
  }

  .first-letter.pl {
    padding-left: var(--pl-padding);
  }

  .red-bg {
    position: absolute;
    top: var(--red-bg-top);
    left: var(--red-bg-left);
    z-index: 3;
    content: '';
    width: 0;
    height: 0;
    border-right: var(--red-bg-border-right) solid transparent;
    border-left: var(--red-bg-border-left) solid transparent;
    border-top: var(--red-bg-border-top) solid #940001;
    transform: skewX(355deg);
    /* Animation for the red spike background as well to match */
    animation: spike-in 0.4s cubic-bezier(0.25, 1, 0.5, 1) 0.1s backwards;
  }

  @keyframes spike-in {
    0% {
      transform: skewX(355deg) scaleX(0);
      opacity: 0;
    }
    100% {
      transform: skewX(355deg) scaleX(1);
      opacity: 1;
    }
  }

  /* desktop: mirrors --breakpoint-desktop */
  @media (max-width: 1200px) {
    header {
      --title-font-size: 72px;
      --title-margin-block: 4rem 8rem;
      --gold-width: 230px;
      --gold-height: 120px;
      --gold-margin-left: -6.5rem;
      --border-left: -20px;
      --red-bg-top: 29px;
      --red-bg-left: -24px;
      --red-bg-border-right: 480px;
      --red-bg-border-left: 62px;
      --red-bg-border-top: 70px;
    }
  }

  /* tablet: mirrors --breakpoint-tablet */
  @media (max-width: 720px) {
    header {
      --title-font-size: 44px;
      --title-margin-block: 2rem 5rem;
      --gold-width: 145px;
      --gold-height: 70px;
      --gold-margin-left: -4rem;
      --border-left: -12px;
      --red-bg-top: 18px;
      --red-bg-left: -16px;
      --red-bg-border-right: 300px;
      --red-bg-border-left: 38px;
      --red-bg-border-top: 43px;
      --com-translate-x: -0.5rem;
      --com-translate-y: 0.5rem;
      --pl-padding: 0.55em;
    }
  }

  /* short-screen: mirrors --breakpoint-short-screen */
  @media (max-height: 620px) {
    header {
      --title-margin-block: 1.5rem 4rem;
    }
  }

</style>
