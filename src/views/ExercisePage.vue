<template>
  <BaseContainer>
    <div v-if="finished">
      <FinalScreen @restart="router.push('/')" />
    </div>

    <div v-else-if="exercise" class="position-relative">
      <component
        ref="childRef"
        :is="currentComponent"
        :exercise="exercise"
        :current="currentIndex"
        :total="exercises.length"
        @next="goToNextExercise(true)"
        @skip="goToNextExercise(false)"
      />
    </div>

    <div v-else class="text-center py-5">
      <p class="text-danger">Exercise not found.</p>
    </div>
  </BaseContainer>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExerciseImageSelection from "../components/ExerciseImageSelection.vue";
import ExerciseTranslate from "../components/ExerciseTranslate.vue";
import ExerciseSentence from "../components/ExerciseSentence.vue";
import ExerciseFillBlank from "../components/ExerciseFillBlank.vue";
import ExerciseMatch from "../components/ExerciseMatch.vue";
import FinalScreen from "../components/FinalScreen.vue";

const route = useRoute();
const router = useRouter();

const score = ref(0);
const totalAnswered = ref(0);
const startTime = ref(Date.now());
const endTime = ref(0);
const timeElapsed = computed(() => {
  const seconds = Math.floor((endTime.value - startTime.value) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
});

const exercises = [
  {
    id: 1,
    type: "image-selection",
    question: 'Select "Bus"',
    options: [
      { label: "Bus", image: "/bus.png", correct: true },
      { label: "Car", image: "/car.png", correct: false },
      { label: "Train", image: "/train.png", correct: false },
      { label: "Bike", image: "/bike.png", correct: false },
    ],
  },
  {
    id: 2,
    type: "translate",
    question: "Traduza: onibus",
    options: [
      { label: "Bus", correct: true },
      { label: "Car", correct: false },
      { label: "Train", correct: false },
      { label: "Bike", correct: false },
    ],
  },
  {
    id: 3,
    type: "sentence",
    question: "Translate: Eu gosto de aprender",
    correctAnswer: ["I", "like", "to", "learn"],
  },
  {
    id: 4,
    type: "fill-in-blanks",
    question: ["I", null, "to school", "by", null, "."],
    correctAnswers: ["go", "bike"],
    options: ["go", "goes", "bike", "car", "bus", "gone"],
  },
  {
    id: 5,
    type: "match",
    pairs: [
      { left: "Cat", right: "Gato" },
      { left: "Dog", right: "Cachorro" },
      { left: "House", right: "Casa" },
      { left: "Book", right: "Livro" },
      { left: "Car", right: "Carro" },
    ],
  },
];

const currentIndex = computed(() => {
  const id = Number(route.params.id);
  return exercises.findIndex((e) => e.id === id);
});

const exercise = computed(() => {
  const id = Number(route.params.id);
  return exercises.find((e) => e.id === id) || null;
});

const currentComponent = computed(() => {
  if (!exercise.value) return null;
  switch (exercise.value.type) {
    case "image-selection":
      return ExerciseImageSelection;
    case "translate":
      return ExerciseTranslate;
    case "sentence":
      return ExerciseSentence;
    case "fill-in-blanks":
      return ExerciseFillBlank;
    case "match":
      return ExerciseMatch;
    default:
      return null;
  }
});

const finished = computed(() => {
  const id = Number(route.params.id);
  return id > exercises[exercises.length - 1].id;
});

const xpPercentage = computed(() => (score.value / totalAnswered.value) * 100);
const accuracy = computed(() =>
  totalAnswered.value === 0 ? 0 : ((score.value / totalAnswered.value) * 100).toFixed(0)
);

const goToNextExercise = (isCorrect = false) => {
  const currentId = Number(route.params.id);
  const alreadyCounted = currentId <= totalAnswered.value;
  if (!alreadyCounted) {
    totalAnswered.value++;
    if (isCorrect) {
      score.value++;
    }
  }
  const nextId = currentId + 1;
  if (currentIndex.value < exercises.length - 1) {
    router.push(`/exercise/${nextId}`);
  } else {
    endTime.value = Date.now();
    router.push(`/exercise/${nextId}`);
  }
};

onMounted(() => {
  watch(
    finished,
    (val) => {
      if (val) {
        setTimeout(() => {
          launchConfetti();
        }, 300);
      }
    },
    { immediate: true }
  );
});
</script>
