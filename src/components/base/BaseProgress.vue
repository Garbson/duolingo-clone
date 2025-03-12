<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-1">
      <small>{{ props.label }}</small>
      <small>{{ props.value }}/{{ props.max }}</small>
    </div>
    <div
      class="progress"
      role="progressbar"
      :aria-valuenow="props.value"
      :aria-valuemin="0"
      :aria-valuemax="props.max"
    >
      <div class="progress-bar bg-primary" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: "Progress",
  },
});

const percent = computed(() => Math.min(100, (props.value / props.max) * 100));
</script>
