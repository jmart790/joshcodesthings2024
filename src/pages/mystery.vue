<template>
  <div class="mystery-page">
    <div class="back-button">
      <RetroButton @click="$router.push('/stage-select')">&lt; Back</RetroButton>
    </div>
    <div class="pong-shell">
      <div class="scoreboard">
        <div class="score score--red">
          <span>RED</span>
          <strong>{{ playerScore }}</strong>
        </div>
        <div class="status">{{ statusText }}</div>
        <div class="score score--blue">
          <span>BLUE</span>
          <strong>{{ computerScore }}</strong>
        </div>
      </div>

      <div class="arena" @pointermove="handlePointerMove">
        <div class="center-line"></div>
        <div class="paddle paddle--red" :style="{ top: `${(playerY / ARENA_HEIGHT) * 100}%` }"></div>
        <div class="paddle paddle--blue" :style="{ top: `${(computerY / ARENA_HEIGHT) * 100}%` }"></div>
        <div class="ball" :style="{ left: `${(ball.x / ARENA_WIDTH) * 100}%`, top: `${(ball.y / ARENA_HEIGHT) * 100}%` }"></div>

        <div v-if="gameState !== 'playing'" class="game-message">
          <h1>{{ gameState === 'won' ? 'YOU WIN' : gameState === 'lost' ? 'YOU LOSE' : 'PONG' }}</h1>
          <button type="button" @click="startGame">{{ gameState === 'idle' ? 'START' : 'REMATCH' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
  import RetroButton from '../components/shared/RetroButton.vue';

  const WINNING_SCORE = 3;
  const ARENA_WIDTH = 900;
  const ARENA_HEIGHT = 520;
  const PADDLE_WIDTH = 18;
  const PADDLE_HEIGHT = 118;
  const BALL_SIZE = 18;
  const PADDLE_MARGIN = 32;
  const PLAYER_SPEED = 8;
  const COMPUTER_SPEED = 3.6;
  const COMPUTER_REACTION_OFFSET = 26;
  const BALL_START_SPEED = 5.4;

  type GameState = 'idle' | 'playing' | 'won' | 'lost';

  const gameState = ref<GameState>('idle');
  const playerScore = ref(0);
  const computerScore = ref(0);
  const playerY = ref((ARENA_HEIGHT - PADDLE_HEIGHT) / 2);
  const computerY = ref((ARENA_HEIGHT - PADDLE_HEIGHT) / 2);
  const pressedKeys = reactive(new Set<string>());
  const ball = reactive({
    x: (ARENA_WIDTH - BALL_SIZE) / 2,
    y: (ARENA_HEIGHT - BALL_SIZE) / 2,
    vx: BALL_START_SPEED,
    vy: BALL_START_SPEED * 0.45
  });

  let animationFrame = 0;

  const statusText = computed(() => {
    if (gameState.value === 'won') return 'ACCESS CLAIMED';
    if (gameState.value === 'lost') return 'ACCESS DENIED';
    if (gameState.value === 'playing') return 'FIRST TO 3';
    return 'READY';
  });

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const resetBall = (direction: 1 | -1) => {
    ball.x = (ARENA_WIDTH - BALL_SIZE) / 2;
    ball.y = (ARENA_HEIGHT - BALL_SIZE) / 2;
    ball.vx = BALL_START_SPEED * direction;
    ball.vy = BALL_START_SPEED * (Math.random() > 0.5 ? 0.55 : -0.55);
  };

  const resetPositions = () => {
    playerY.value = (ARENA_HEIGHT - PADDLE_HEIGHT) / 2;
    computerY.value = (ARENA_HEIGHT - PADDLE_HEIGHT) / 2;
    resetBall(Math.random() > 0.5 ? 1 : -1);
  };

  const startGame = () => {
    playerScore.value = 0;
    computerScore.value = 0;
    gameState.value = 'playing';
    resetPositions();
  };

  const scorePoint = (side: 'player' | 'computer') => {
    if (side === 'player') {
      playerScore.value += 1;
      if (playerScore.value >= WINNING_SCORE) {
        gameState.value = 'won';
        return;
      }
      resetBall(-1);
      return;
    }

    computerScore.value += 1;
    if (computerScore.value >= WINNING_SCORE) {
      gameState.value = 'lost';
      return;
    }
    resetBall(1);
  };

  const movePlayer = () => {
    if (pressedKeys.has('ArrowUp') || pressedKeys.has('w')) {
      playerY.value -= PLAYER_SPEED;
    }
    if (pressedKeys.has('ArrowDown') || pressedKeys.has('s')) {
      playerY.value += PLAYER_SPEED;
    }

    playerY.value = clamp(playerY.value, 0, ARENA_HEIGHT - PADDLE_HEIGHT);
  };

  const moveComputer = () => {
    const targetY = ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2 - COMPUTER_REACTION_OFFSET;
    const distance = targetY - computerY.value;
    computerY.value += clamp(distance, -COMPUTER_SPEED, COMPUTER_SPEED);
    computerY.value = clamp(computerY.value, 0, ARENA_HEIGHT - PADDLE_HEIGHT);
  };

  const handlePaddleCollision = () => {
    const ballTop = ball.y;
    const ballBottom = ball.y + BALL_SIZE;
    const redPaddleRight = PADDLE_MARGIN + PADDLE_WIDTH;
    const bluePaddleLeft = ARENA_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH;

    const hitsRed =
      ball.x <= redPaddleRight &&
      ball.x >= PADDLE_MARGIN - BALL_SIZE &&
      ballBottom >= playerY.value &&
      ballTop <= playerY.value + PADDLE_HEIGHT;

    if (hitsRed && ball.vx < 0) {
      const hitPosition = (ball.y + BALL_SIZE / 2 - (playerY.value + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.x = redPaddleRight;
      ball.vx = Math.abs(ball.vx) + 0.35;
      ball.vy = hitPosition * 6.5;
    }

    const hitsBlue =
      ball.x + BALL_SIZE >= bluePaddleLeft &&
      ball.x <= ARENA_WIDTH - PADDLE_MARGIN &&
      ballBottom >= computerY.value &&
      ballTop <= computerY.value + PADDLE_HEIGHT;

    if (hitsBlue && ball.vx > 0) {
      const hitPosition = (ball.y + BALL_SIZE / 2 - (computerY.value + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
      ball.x = bluePaddleLeft - BALL_SIZE;
      ball.vx = -Math.abs(ball.vx) - 0.25;
      ball.vy = hitPosition * 6.5;
    }
  };

  const tick = () => {
    if (gameState.value === 'playing') {
      movePlayer();
      moveComputer();

      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y <= 0 || ball.y + BALL_SIZE >= ARENA_HEIGHT) {
        ball.y = clamp(ball.y, 0, ARENA_HEIGHT - BALL_SIZE);
        ball.vy *= -1;
      }

      handlePaddleCollision();

      if (ball.x + BALL_SIZE < 0) {
        scorePoint('computer');
      } else if (ball.x > ARENA_WIDTH) {
        scorePoint('player');
      }
    }

    animationFrame = requestAnimationFrame(tick);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(event.key)) {
      event.preventDefault();
      pressedKeys.add(event.key);
    }

    if (event.key === 'Enter' && gameState.value !== 'playing') {
      startGame();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    pressedKeys.delete(event.key);
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (gameState.value !== 'playing') return;

    const arena = event.currentTarget as HTMLElement;
    const rect = arena.getBoundingClientRect();
    const scale = ARENA_HEIGHT / rect.height;
    playerY.value = clamp((event.clientY - rect.top) * scale - PADDLE_HEIGHT / 2, 0, ARENA_HEIGHT - PADDLE_HEIGHT);
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrame = requestAnimationFrame(tick);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    cancelAnimationFrame(animationFrame);
  });
</script>

<style scoped>
  .mystery-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    box-sizing: border-box;
    color: #f7fbff;
    font-family: 'Press Start 2P', monospace;
  }

  .pong-shell {
    width: min(96vw, 1020px);
  }

  .back-button {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    z-index: 100;
  }

  .scoreboard {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .score {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
  }

  .score--blue {
    justify-content: flex-end;
  }

  .score--red {
    color: #ff4d4d;
  }

  .score--blue {
    color: #3aa7ff;
  }

  .score strong {
    font-size: 2.2rem;
    line-height: 1;
  }

  .status {
    font-size: 0.8rem;
    color: #f8e66d;
    text-align: center;
    text-shadow: 0 0 0.6rem rgba(248, 230, 109, 0.6);
  }

  .arena {
    position: relative;
    width: 100%;
    aspect-ratio: 900 / 520;
    overflow: hidden;
    border: 4px solid #d5e7ff;
    background:
      linear-gradient(90deg, rgba(255, 50, 50, 0.12), transparent 38%, transparent 62%, rgba(50, 150, 255, 0.14)),
      #060914;
    box-shadow:
      0 0 2rem rgba(83, 168, 255, 0.24),
      inset 0 0 2rem rgba(0, 0, 0, 0.8);
    touch-action: none;
  }

  .center-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 4px;
    transform: translateX(-50%);
    background: repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0 24px, transparent 24px 44px);
  }

  .paddle,
  .ball {
    position: absolute;
    will-change: left, top;
  }

  .paddle {
    width: calc(18 / 900 * 100%);
    height: calc(118 / 520 * 100%);
    border-radius: 2px;
  }

  .paddle--red {
    left: calc(32 / 900 * 100%);
    background: linear-gradient(180deg, #ff9b9b, #ff1f3d 55%, #8f0016);
    box-shadow: 0 0 1rem rgba(255, 45, 76, 0.85);
  }

  .paddle--blue {
    right: calc(32 / 900 * 100%);
    background: linear-gradient(180deg, #9ed8ff, #168dff 55%, #003f91);
    box-shadow: 0 0 1rem rgba(45, 151, 255, 0.85);
  }

  .ball {
    width: calc(18 / 900 * 100%);
    aspect-ratio: 1;
    background: #faffff;
    box-shadow:
      0 0 0.7rem #ffffff,
      0 0 1.2rem rgba(104, 221, 255, 0.8);
  }

  .game-message {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    background: rgba(0, 0, 0, 0.58);
    text-align: center;
  }

  .game-message h1 {
    margin: 0;
    font-size: clamp(2rem, 7vw, 5rem);
    color: #f8e66d;
    text-shadow:
      0.25rem 0.25rem 0 #000,
      0 0 1rem rgba(248, 230, 109, 0.5);
  }

  .game-message button {
    border: 0;
    padding: 1rem 1.25rem;
    font: inherit;
    color: #ccf2fd;
    cursor: pointer;
    background: transparent;
    text-shadow: 0.18rem 0.18rem 0 #000;
  }

  .game-message button:hover,
  .game-message button:focus-visible {
    color: #ffcc00;
    outline: none;
  }

  @media (max-width: 760px) {
    .scoreboard {
      grid-template-columns: 1fr 1fr;
    }

    .status {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .score {
      font-size: 0.7rem;
    }

    .score strong {
      font-size: 1.7rem;
    }
  }
</style>
