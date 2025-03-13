<template>
  <BaseContainer class="pb-5">
    <!-- Header com progresso e skip -->
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

    <!-- Área centralizada com conteúdo da resposta -->
    <div
      class="d-flex flex-column justify-content-center align-items-center"
      style="min-height: 60vh"
    >
      <!-- Pergunta -->
      <h4 class="fw-semibold fs-5 mb-4 text-start w-100">{{ exercise.question }}</h4>

      <!-- Frase montada -->
      <div class="bg-dark text-white rounded p-3 mb-3 min-height-50 text-center w-100">
        <span v-if="selectedWords.length">
          <span
            v-for="(word, i) in selectedWords"
            :key="i"
            class="me-2 cursor-pointer text-white fw-medium"
            @click="removeWord(i)"
          >
            {{ word }}
          </span>
        </span>
        <span v-else class="text-secondary">Click the words to build your answer</span>
      </div>

      <!-- Palavras embaralhadas -->
      <div class="d-flex flex-wrap gap-2 justify-content-start mb-4 w-100">
        <BaseCard
          v-for="(word, index) in shuffledWords"
          :key="index"
          :selected="false"
          :class="{ 'opacity-50': selectedIndexes.includes(index) }"
          @click="selectWord(word, index)"
        >
          <div class="text-center py-2 px-3 fw-medium">{{ word }}</div>
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
          :disabled="selectedWords.length === 0"
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

const selectedWords = ref([]);
const selectedIndexes = ref([]);
const answerChecked = ref(false);
const feedbackMessage = ref("");
const feedbackClass = ref("");
const shuffledWords = ref([]);

onMounted(() => {
  shuffledWords.value = [...props.exercise.correctAnswer].sort(() => Math.random() - 0.5);
});

const selectWord = (word, index) => {
  const existingIndex = selectedIndexes.value.indexOf(index);
  if (existingIndex !== -1) {
    // Deselect word
    selectedIndexes.value.splice(existingIndex, 1);
    selectedWords.value.splice(existingIndex, 1);
  } else {
    // Select word
    selectedIndexes.value.push(index);
    selectedWords.value.push(word);
  }
};

const checkAnswer = () => {
  answerChecked.value = true;
  const joined = selectedWords.value.join(" ");
  const correct = props.exercise.correctAnswer.join(" ");
  if (joined === correct) {
    feedbackMessage.value = "Correct!";
    feedbackClass.value = "text-success";
  } else {
    feedbackMessage.value = `Oops! That’s not correct. Correct answer: "${correct}"`;
    feedbackClass.value = "text-danger";
  }
};

const removeWord = (indexToRemove) => {
  const removedWord = selectedWords.value[indexToRemove];
  selectedWords.value.splice(indexToRemove, 1);
  for (let i = 0; i < selectedIndexes.value.length; i++) {
    const idx = selectedIndexes.value[i];
    if (shuffledWords.value[idx] === removedWord) {
      selectedIndexes.value.splice(i, 1);
      break;
    }
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
