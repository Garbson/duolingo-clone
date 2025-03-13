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
      <h4 class="fw-semibold fs-5 mb-4 text-start w-100">Match the pairs</h4>
      <div class="row gx-5 gy-4 justify-content-center">
        <!-- Coluna esquerda -->
        <div class="col-6">
          <div class="d-grid gap-3">
            <transition-group name="fade" tag="div">
              <BaseCard
                v-for="(item, i) in leftItems"
                :key="'l-' + i"
                :selected="selectedLeft === i"
                v-show="!correctPairs.some((p) => p.left === i)"
                class="mb-3 fade-item"
                :class="{
                  'bg-success text-white': correctPairs.some((p) => p.left === i),
                  'bg-danger text-white': incorrectPairs.some((p) => p.left === i),
                }"
                @click="selectLeft(i)"
              >
                <div class="text-center py-2 fw-medium">{{ item }}</div>
              </BaseCard>
            </transition-group>
          </div>
        </div>

        <!-- Coluna direita -->
        <div class="col-6">
          <div class="d-grid gap-3">
            <transition-group name="fade" tag="div">
              <BaseCard
                v-for="(item, i) in rightItems"
                :key="'r-' + i"
                :selected="selectedRight === i"
                v-show="!correctPairs.some((p) => p.right === i)"
                class="mb-3 fade-item"
                :class="{
                  'bg-success text-white': correctPairs.some((p) => p.right === i),
                  'bg-danger text-white': incorrectPairs.some((p) => p.right === i),
                }"
                @click="selectRight(i)"
              >
                <div class="text-center py-2 fw-medium">{{ item }}</div>
              </BaseCard>
            </transition-group>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback -->
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

    <!-- Botão fixo -->
    <div
      v-if="!answerChecked"
      class="fixed-bottom py-3"
      style="background-color: #121212"
    >
      <div class="container px-4">
        <BaseButton
          variant="primary"
          class="w-100"
          :disabled="matchedPairs.length < exercise.pairs.length"
          @click="checkAnswer"
        >
          Check answer
        </BaseButton>
      </div>
    </div>
  </BaseContainer>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  exercise: Object,
  current: Number,
  total: Number,
});

const emit = defineEmits(["next", "skip"]);

const leftItems = ref([]);
const rightItems = ref([]);
const selectedLeft = ref(null);
const selectedRight = ref(null);
const matchedPairs = ref([]);
const matchedIndexes = ref([]);
const correctPairs = ref([]);
const incorrectPairs = ref([]);
const answerChecked = ref(false);
const feedbackMessage = ref("");
const feedbackClass = ref("");

onMounted(() => {
  const shuffledPairs = [...props.exercise.pairs].sort(() => Math.random() - 0.5);
  leftItems.value = shuffledPairs.map((p) => p.left);
  rightItems.value = shuffledPairs.map((p) => p.right).sort(() => Math.random() - 0.5);
});

const selectLeft = (index) => {
  if (matchedIndexes.value.includes(index)) return;
  selectedLeft.value = index;
  tryMatch();
};

const selectRight = (index) => {
  if (matchedPairs.value.some((p) => p.right === index)) return;
  selectedRight.value = index;
  tryMatch();
};

const tryMatch = () => {
  if (selectedLeft.value !== null && selectedRight.value !== null) {
    const leftIdx = selectedLeft.value;
    const rightIdx = selectedRight.value;
    const leftWord = leftItems.value[leftIdx];
    const rightWord = rightItems.value[rightIdx];
    const isMatch = props.exercise.pairs.some(
      (p) => p.left === leftWord && p.right === rightWord
    );

    if (isMatch) {
      matchedPairs.value.push({ left: leftIdx, right: rightIdx });
      matchedIndexes.value.push(leftIdx);
      correctPairs.value.push({ left: leftIdx, right: rightIdx });
      selectedLeft.value = null;
      selectedRight.value = null;
    } else {
      const wrongPair = { left: leftIdx, right: rightIdx };
      matchedPairs.value.push(wrongPair);
      matchedIndexes.value.push(leftIdx);
      incorrectPairs.value.push(wrongPair);
      setTimeout(() => {
        matchedPairs.value = matchedPairs.value.filter(
          (p) => p.left !== wrongPair.left || p.right !== wrongPair.right
        );
        matchedIndexes.value = matchedIndexes.value.filter((i) => i !== wrongPair.left);
        incorrectPairs.value = incorrectPairs.value.filter(
          (p) => p.left !== wrongPair.left || p.right !== wrongPair.right
        );
      }, 1000);
      selectedLeft.value = null;
      selectedRight.value = null;
    }
  }
};

const checkAnswer = () => {
  answerChecked.value = true;
  if (matchedPairs.value.length === props.exercise.pairs.length) {
    feedbackMessage.value = "Correct!";
    feedbackClass.value = "text-success";
  } else {
    feedbackMessage.value = "Oops! Some matches were incorrect.";
    feedbackClass.value = "text-danger";
  }
};

const showCorrectness = (index, side) => {
  const isCorrect = correctPairs.value.some((p) =>
    side === "left" ? p.left === index : p.right === index
  );
  const isIncorrect = incorrectPairs.value.some((p) =>
    side === "left" ? p.left === index : p.right === index
  );
  return isCorrect ? "correct" : isIncorrect ? "incorrect" : "";
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
.slide-up-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-item {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
</style>
