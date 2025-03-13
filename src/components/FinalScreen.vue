<template>
  <div class="container py-5 d-flex justify-content-center align-items-center">
    <div
      class="position-relative text-center d-flex flex-column justify-content-center align-items-center w-100 m-0 p-0 overflow-hidden"
    >
      <canvas
        ref="confettiContainer"
        class="position-absolute top-0 start-0 w-100 h-100"
        style="pointer-events: none; z-index: 0"
      ></canvas>

      <div class="d-flex flex-column">
        <div class="display-1 mb-3" style="z-index: 1">🏆</div>
        <h1 class="fw-bold text-success mb-3" style="z-index: 1">You're all done!</h1>
        <p class="fs-5 text-white text-center mb-3" style="z-index: 1">
          You completed all exercises successfully.
        </p>
        <p class="fs-6 text-white text-center mb-4" style="z-index: 1">
          Keep going — you're making great progress. Every step counts! 🚀
        </p>
      </div>

      <BaseButton
        variant="primary"
        class="px-4 py-2"
        style="max-width: 320px; width: 100%; z-index: 1"
        @click="$emit('restart')"
      >
        Go back to start
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const confettiContainer = ref(null);

const launchConfetti = () => {
  const canvas = confettiContainer.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 100,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10 - 10,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, Math.PI * 2);
      ctx.fill();
    });
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    particles.forEach((p) => {
      p.y += Math.cos(p.d / 10);
      p.x += Math.sin(p.d / 20);
      if (p.y > canvas.height) p.y = 0;
    });
  }

  draw();
};

onMounted(() => {
  launchConfetti();
});
</script>

<style scoped>
canvas {
  position: absolute;
  top: 0;
  left: 0;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
