<template>
  <button
    :class="[
      'btn',
      block ? 'w-100' : '',
      size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '',
      `btn-${variant}`,
    ]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click')"
    class="rounded-4"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: "button" },
  variant: { type: String, default: "primary" },
  size: { type: String, default: "" },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});

defineEmits(["click"]);
</script>
