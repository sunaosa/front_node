<template>
    <canvas width="1000" height="400" style="width: 100%;" ref="canvasRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { CanvasDemo } from './canvasDemo';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let canvasInstance: CanvasDemo | null = null;

onMounted(() => {
    if (canvasRef.value) {
        canvasInstance = new CanvasDemo(canvasRef.value);
        // 启动动画
        canvasInstance.animate();
    }
})

onUnmounted(() => {
    if (canvasInstance) {
        canvasInstance.stop();
    }
})
</script>

<style scoped>

</style>