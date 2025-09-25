<template>
    <div class="css-container">
        <div class="row">
            <div class="item">
                <label class="_label">Linear:</label>
                <div :class="`_ball linear ${ballSwitch.linear ? '_play' : '_paused'}`">
                </div>
            </div>
            <a-button @click="handleTabSwitch('linear')">
                {{ ballSwitch.linear ? 'Pause' : 'Play' }}
            </a-button>
        </div>
        <div class="row">
            <div class="item">
                <label class="_label">Ease:</label>
                <div :class="`_ball ease ${ballSwitch.ease ? '_play' : '_paused'}`">
                </div>
            </div>
            <a-button @click="handleTabSwitch('ease')">
                {{ ballSwitch.ease ? 'Pause' : 'Play' }}
            </a-button>
        </div>
        <div class="row">
            <div class="item">
                <label class="_label">Ease Out:</label>
                <div :class="`_ball ease-out ${ballSwitch.easeOut ? '_play' : '_paused'}`">
                </div>
            </div>
            <a-button @click="handleTabSwitch('easeOut')">
                {{ ballSwitch.easeOut ? 'Pause' : 'Play' }}
            </a-button>
        </div>
        <div class="row">
            <div class="item">
                <label class="_label">Ease In:</label>
                <div :class="`_ball ease-in ${ballSwitch.easeIn ? '_play' : '_paused'}`">
                </div>
            </div>
            <a-button @click="handleTabSwitch('easeIn')">
                {{ ballSwitch.easeIn ? 'Pause' : 'Play' }}
            </a-button>
        </div>
        <div class="row">
            <div class="item">
                <label class="_label">Ease In Out:</label>
                <div :class="`_ball ease-in-out ${ballSwitch.easeInOut ? '_play' : '_paused'}`">
                </div>
            </div>
            <a-button @click="handleTabSwitch('easeInOut')">
                {{ ballSwitch.easeInOut ? 'Pause' : 'Play' }}
            </a-button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { Button as AButton } from 'ant-design-vue';

const ballSwitch = ref({
    linear: true,
    ease: true,
    easeOut: true,
    easeIn: true,
    easeInOut: true
});

const handleTabSwitch = (param) => {
    ballSwitch.value[param] = !ballSwitch.value[param];
}
</script>
<style lang="scss" scoped>
@keyframes roll {
    0% {
        margin-left: 0px;
    }
    50% {
        margin-left: calc(100% - 130px)
    }
    100% {
        margin-left: 0px;
    }
}
.css-container {
    display: flex;
    gap: 20px;
    flex-direction: column;
    .row {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
            width: calc(100% - 80px);
            border: 1px solid #ccc;
            padding: 5px;
            display: flex;
            align-items: center;
            ._label {
                display: inline-block;
                width: 80px;
                text-align: right;
                margin-right: 10px;
            }
            ._ball {
                
                width: 30px;
                height: 30px;
                background-color: #409eff;
                border-radius: 15px;
                animation: roll 10s;
                animation-iteration-count: infinite;
            }
            .linear {
                animation-timing-function: linear;
            }
            .ease {
                animation-timing-function: ease;
            }
            .ease-out {
                animation-timing-function: ease-out;
            }
            .ease-in-out {
                animation-timing-function: ease-in-out;
            }
            .ease-in {
                animation-timing-function: ease-in;
            }
            ._play {
                animation-play-state: running;
            }
            ._paused {
                animation-play-state: paused;
            }
        }
    }
}
</style>