<template>
  <BaseContainer class="pb-5">
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

    <div class="d-flex flex-column justify-content-center" style="min-height: 60vh">
      <div class="fs-5 fw-medium text-white rounded mb-4 min-height-50 text-start w-100">
        <span v-for="(part, index) in exercise.question" :key="index" class="mx-1">
          <template v-if="part === null">
            <span
              class="d-inline-block border-bottom border-2 border-secondary text-white fw-bold px-2 cursor-pointer"
              @click="removeFromBlank(blankIndex(index))"
            >
              {{ filledBlanks[blankIndex(index)] || " " }}
            </span>
          </template>
          <template v-else>
            {{ part }}
          </template>
        </span>
      </div>

      <div class="d-flex flex-wrap gap-2 justify-content-start w-100">
        <BaseCard
          v-for="(option, index) in exercise.options"
          :key="index"
          :selected="selectedOption === index"
          :class="{ 'opacity-50': usedOptions.includes(option) }"
          @click="selectOption(option, index)"
        >
          <div class="text-center py-2 px-3 fw-medium">{{ option }}</div>
        </BaseCard>
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
          class="w-100"
          :disabled="!allBlanksFilled"
          @click="checkAnswer"
        >
          Check answer
        </BaseButton>
      </div>
    </div>
  </BaseContainer>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  exercise: Object,
  current: Number,
  total: Number,
});

const emit = defineEmits(["next", "skip"]);

const filledBlanks = ref(Array(props.exercise.correctAnswers.length).fill(null));
const selectedOption = ref(null);
const usedOptions = ref([]);
const answerChecked = ref(false);
const feedbackMessage = ref("");
const feedbackClass = ref("");

const blankIndexes = computed(() =>
  props.exercise.question
    .map((part, index) => (part === null ? index : null))
    .filter((i) => i !== null)
);

const blankIndex = (index) => blankIndexes.value.indexOf(index);

const allBlanksFilled = computed(
  () =>
    filledBlanks.value.length === props.exercise.correctAnswers.length &&
    filledBlanks.value.every((val) => val !== null)
);

const selectOption = (word, index) => {
  const usedIndex = filledBlanks.value.findIndex((val) => val === word);
  if (usedIndex !== -1) {
    // If the word is already used, remove it from the blank
    removeFromBlank(usedIndex);
  } else {
    // Find first empty blank
    const nextIndex = filledBlanks.value.findIndex((val) => !val);
    if (nextIndex !== -1) {
      filledBlanks.value[nextIndex] = word;
      usedOptions.value.push(word);
      selectedOption.value = index;
    }
  }
};

const checkAnswer = () => {
  answerChecked.value = true;
  const correct = props.exercise.correctAnswers.join(" ");
  const userAnswer = filledBlanks.value.join(" ");
  if (userAnswer === correct) {
    feedbackMessage.value = "Correct!";
    feedbackClass.value = "text-success";
  } else {
    feedbackMessage.value = `Oops! That’s not correct. Correct answer: "${correct}"`;
    feedbackClass.value = "text-danger";
  }
};

const removeFromBlank = (index) => {
  const word = filledBlanks.value[index];
  if (word) {
    usedOptions.value = usedOptions.value.filter((w) => w !== word);
    filledBlanks.value[index] = null;
    selectedOption.value = null;
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

.min-height-50 {
  min-height: 50px;
}
</style>
