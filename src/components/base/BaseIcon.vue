<template>
  <i :class="`fa-solid fa-${name}`" :style="{ color, fontSize: size }"></i>
</template>

<script setup>
defineProps({
  name: { type: String, required: true },
  size: { type: String, default: "1em" },
  color: { type: String, default: "" },
});
</script>
