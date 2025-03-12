<template>
  <BaseContainer>
    <h4 class="fw-semibold fs-5 mb-4 text-center">{{ exercise.question }}</h4>
    <div class="row g-3">
      <div
        class="col-6 col-md-3"
        v-for="(option, index) in exercise.options"
        :key="index"
      >
        <BaseCard :selected="selected === index" @click="selectOption(index)">
          <img
            :src="option.image"
            :alt="option.label"
            class="img-fluid mb-2 imgQuestions"
          />
          <div class="text-center">{{ option.label }}</div>
        </BaseCard>
      </div>
    </div>
    <div class="mt-4 text-center">
      <BaseButton
        variant="primary"
        :disabled="selected === null"
        @click="$emit('next')"
        block
      >
        Next
      </BaseButton>
    </div>
  </BaseContainer>
</template>

<script setup>
import { ref } from "vue";

defineProps(["exercise"]);
defineEmits(["next"]);

const selected = ref(null);

const selectOption = (index) => {
  selected.value = index;
};
</script>
<style scoped>
.imgQuestions {
  height: 120px;
  object-fit: contain;
  width: 100%;
}

@media (max-width: 576px) {
  .imgQuestions {
    height: 100px;
  }
}
</style>
