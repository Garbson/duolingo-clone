<template>
  <div class="pb-5 container position-relative">
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

    <!-- Vertically centered answer area -->
    <div class="d-flex flex-column justify-content-center" style="min-height: 60vh">
      <h4 class="fw-semibold fs-5 mb-4 text-start w-100">{{ exercise.question }}</h4>

      <div class="row g-3 justify-content-center">
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
            <div class="text-center fs-5 fw-semibold py-3">{{ option.label }}</div>
          </BaseCard>
        </div>
      </div>
    </div>

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

    <div
      v-if="!answerChecked"
      class="fixed-bottom py-3"
      style="background-color: #121212"
    >
      <div class="container px-4">
        <BaseButton
          variant="primary"
          class="w-100 rounded-xl"
          :disabled="selected === null"
          @click="checkAnswer"
        >
          Check answer
        </BaseButton>
      </div>
    </div>
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
