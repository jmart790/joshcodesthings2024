<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from './layouts/default.vue'
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

* {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
</style>
