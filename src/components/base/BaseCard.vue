<template>
  <div
    class="p-3 rounded text-center border"
    :class="{
      'border-primary': selected,
      'border-success bg-success bg-opacity-25': correct,
      'border-danger bg-danger bg-opacity-25': incorrect,
    }"
    role="button"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script setup>
/**
 * BaseCard
 * Reusable card component styled using Bootstrap utility classes.
 * Props:
 * - selected: boolean – highlights with primary border
 * - correct: boolean – shows green success feedback
 * - incorrect: boolean – shows red error feedback
 */
defineProps({
  selected: Boolean,
  correct: Boolean,
  incorrect: Boolean,
});

defineEmits(["click"]);
</script>
