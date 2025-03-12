<template>
  <div class="body">
    <router-view />
  </div>
</template>

<script setup>
// No logic needed here since router-view will render everything
</script>
<style>
.body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  margin: 0;
  height: 100vh;
}
</style>
