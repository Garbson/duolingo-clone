<template>
  <BaseContainer>
    <component
      :is="currentComponent"
      :exercise="exercise"
      :current="currentIndex"
      :total="exercises.length"
      @next="goToNextExercise"
      @skip="goToNextExercise"
    />
  </BaseContainer>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import ExerciseImageSelection from "../components/ExerciseImageSelection.vue";

const route = useRoute();
const router = useRouter();

// Mock exercise data (can be moved to a separate file later)
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
  // Add more exercises here
];

const currentIndex = computed(() => {
  const id = Number(route.params.id);
  return exercises.findIndex((e) => e.id === id);
});

// Find current exercise based on route param
const exercise = computed(() => {
  const id = Number(route.params.id);
  return exercises.find((e) => e.id === id);
});

const currentComponent = computed(() => {
  if (!exercise.value) return null;
  switch (exercise.value.type) {
    case "image-selection":
      return ExerciseImageSelection;
    default:
      return null;
  }
});

// Navigate to next exercise by ID
const goToNextExercise = () => {
  const nextId = Number(route.params.id) + 1;
  router.push(`/exercise/${nextId}`);
};
</script>
