<template>
  <BaseContainer class="pb-5">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div style="width: 100%">
        <div class="d-flex justify-content-between mb-1">
          <strong class="small">Lesson {{ current + 1 }} of {{ total }}</strong>
          <BaseButton variant="outline-light" size="sm" @click="$emit('skip')">
            Skip
          </BaseButton>
        </div>
        <BaseProgress :value="current + 1" :max="total" />
      </div>
    </div>

    <!-- Question -->
    <h4 class="fw-semibold fs-5 mb-4 text-center">{{ exercise.question }}</h4>

    <!-- Options -->
    <div class="row g-3">
      <div
        class="col-6 col-md-3"
        v-for="(option, index) in exercise.options"
        :key="index"
      >
        <BaseCard
          :selected="selected === index"
          :correct="answerChecked && option.correct"
          :incorrect="answerChecked && selected === index && !option.correct"
          @click="selectOption(index)"
        >
          <img
            :src="option.image"
            :alt="option.label"
            class="img-fluid mb-2 imgQuestions"
          />
          <div class="text-center">{{ option.label }}</div>
        </BaseCard>
      </div>
    </div>
  </BaseContainer>

  <!-- Feedback block with transition -->
  <transition name="slide-up">
    <div
      v-if="answerChecked"
      class="feedback-footer shadow-lg bg-dark text-center text-white px-4 py-3"
    >
      <p :class="feedbackClass" class="fw-semibold fs-5 m-0 mb-2">
        {{ feedbackMessage }}
      </p>
      <BaseButton variant="primary" class="w-100" @click="$emit('next')">
        Next
      </BaseButton>
    </div>
  </transition>

  <!-- Default check button -->
  <div v-if="!answerChecked" class="fixed-bottom py-3 px-4">
    <BaseButton
      variant="primary"
      class="w-100"
      :disabled="selected === null"
      @click="checkAnswer"
    >
      Check answer
    </BaseButton>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  exercise: Object,
  current: Number,
  total: Number,
});

const emit = defineEmits(["next", "skip"]);

const selected = ref(null);
const answerChecked = ref(false);
const feedbackMessage = ref("");
const feedbackClass = ref("");

const selectOption = (index) => {
  selected.value = index;
};

const checkAnswer = () => {
  answerChecked.value = true;

  const correctOption = props.exercise.options.find((o) => o.correct);
  if (selected.value !== null && props.exercise.options[selected.value].correct) {
    feedbackMessage.value = "Correct!";
    feedbackClass.value = "text-success";
  } else {
    feedbackMessage.value = `Oops! That’s not correct. The correct answer was "${correctOption.label}".`;
    feedbackClass.value = "text-danger";
  }
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

.feedback-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px 16px 0 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
