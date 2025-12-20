<template>
  <div class="retro-card">
    <div class="card-inner">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
  .retro-card {
    /* Outer container with drop shadow */
    position: relative;
    width: 100%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
    margin-bottom: 2rem;
  }

  .card-inner {
    /* RPG Box Style */
    background-color: rgba(0, 0, 20, 0.85); /* Deep dark blue/black, semi-transparent */
    border: 4px solid #fff; /* Outer white border */
    border-radius: 6px;
    box-shadow: inset 0 0 0 4px #000; /* Inner black stroke for depth */
    padding: 1.5rem; /* Space for content */

    color: #fff;
    font-family: inherit; /* Inherit font from parent */
  }
</style>
