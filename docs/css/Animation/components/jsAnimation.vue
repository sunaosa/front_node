<template>
    <div class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        <div class="progress-text">{{ progress }}%</div>
        <button @click="start">开始</button>
        <button @click="reset">重置</button>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const progress = ref(0)
let animationId = null

function animate() {
    if (progress.value < 100) {
        progress.value += 1
        animationId = requestAnimationFrame(animate)
    } else {
        animationId = null
    }
}

function start() {
    if (animationId) return
    animate()
}

function reset() {
    progress.value = 0
    if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
    }
}
</script>

<style scoped>
.progress-container {
    width: 300px;
    margin: 40px auto;
    text-align: center;
}
.progress-bar {
    height: 24px;
    background: #42b983;
    width: 0;
    border-radius: 4px;
}
.progress-text {
    margin: 10px 0;
}
button {
    margin: 0 5px;
    padding: 6px 16px;
    cursor: pointer;
}
</style>