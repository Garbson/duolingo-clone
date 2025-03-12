<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-1">
      <small>{{ label }}</small>
      <small>{{ value }}/{{ max }}</small>
    </div>
    <div
      class="progress"
      role="progressbar"
      :aria-valuenow="value"
      :aria-valuemin="0"
      :aria-valuemax="max"
    >
      <div class="progress-bar bg-primary" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: Number,
  max: Number,
  label: { type: String, default: "Progress" },
});

const percent = computed(() => Math.min(100, (value / max) * 100));
</script>
