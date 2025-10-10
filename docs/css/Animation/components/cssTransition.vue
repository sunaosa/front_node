<template>
    <div style="width: 100%;">
        <div class="operate-btn">
            <a-button type="primary" @click="toggleTimingFunction">切换 当前（{{ timingFunctionMap[timingKey] }})</a-button>
        </div>
        <div class="opacity-transition">
            <div :class="`box ${timingFunctionMap[timingKey]}`">Opacity</div>
        </div>
        <div class="rotate-transition">
            <div :class="`box ${timingFunctionMap[timingKey]}`">Rotate</div>
        </div>
    </div>
</template>

<script setup>
import { Button as AButton } from 'ant-design-vue';
import { ref } from 'vue';

const timingFunctionMap = [
    'ease',
    'linear',
    'ease-in',
    'ease-out',
    'ease-in-out',
];

const timingKey = ref(0);

const toggleTimingFunction = () => {
    if (timingKey.value < timingFunctionMap.length - 1) {
        timingKey.value += 1;
    } else {
        timingKey.value = 0;
    }
}
</script>

<style scoped lang="scss">
.opacity-transition,
.rotate-transition {
    width: 100%;
    .box {
        width: 100px;
        height: 100px;
        background-color: red;
        transform: rotateY(0deg);
        transition: all 1s ease-in;
        padding: 6px;
        margin-bottom: 6px;
    }
    .ease {
        transition-timing-function: ease;
    }
    .linear {
        transition-timing-function: linear;
    }
    .ease-in {
        transition-timing-function: ease-in;
    }
    .ease-out {
        transition-timing-function: ease-out;
    }
    .ease-in-out {
        transition-timing-function: ease-in-out;
    }
}
.opacity-transition .box:hover {
    opacity: 0.2;
}
.rotate-transition .box:hover {
    transform: rotateY(45deg);
}
</style>