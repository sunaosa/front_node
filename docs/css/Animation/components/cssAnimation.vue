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
        
        <!-- Animation Fill Mode Demo -->
        <div class="fill-mode-section">
            <h3 class="section-title">Animation Fill Mode 演示</h3>
            <p class="section-desc">点击按钮观察动画开始前和结束后元素的状态变化</p>
            
            <div class="fill-mode-row">
                <div class="fill-mode-item">
                    <label class="_label">None:</label>
                    <div class="fill-mode-container">
                        <div :class="`_ball fill-mode-none ${fillModeSwitch.none ? '_active' : ''}`"></div>
                        <div class="state-info">
                            <span class="before-state">开始前: 初始状态</span>
                            <span class="after-state">结束后: 回到初始状态</span>
                        </div>
                    </div>
                </div>
                <a-button @click="handleFillModeSwitch('none')" size="small">
                    {{ fillModeSwitch.none ? '重置' : '播放' }}
                </a-button>
            </div>
            
            <div class="fill-mode-row">
                <div class="fill-mode-item">
                    <label class="_label">Forwards:</label>
                    <div class="fill-mode-container">
                        <div :class="`_ball fill-mode-forwards ${fillModeSwitch.forwards ? '_active' : ''}`"></div>
                        <div class="state-info">
                            <span class="before-state">开始前: 初始状态</span>
                            <span class="after-state">结束后: 保持最后一帧</span>
                        </div>
                    </div>
                </div>
                <a-button @click="handleFillModeSwitch('forwards')" size="small">
                    {{ fillModeSwitch.forwards ? '重置' : '播放' }}
                </a-button>
            </div>
            
            <div class="fill-mode-row">
                <div class="fill-mode-item">
                    <label class="_label">Backwards:</label>
                    <div class="fill-mode-container">
                        <div :class="`_ball fill-mode-backwards ${fillModeSwitch.backwards ? '_active' : ''}`"></div>
                        <div class="state-info">
                            <span class="before-state">开始前: 应用第一帧</span>
                            <span class="after-state">结束后: 回到初始状态</span>
                        </div>
                    </div>
                </div>
                <a-button @click="handleFillModeSwitch('backwards')" size="small">
                    {{ fillModeSwitch.backwards ? '重置' : '播放' }}
                </a-button>
            </div>
            
            <div class="fill-mode-row">
                <div class="fill-mode-item">
                    <label class="_label">Both:</label>
                    <div class="fill-mode-container">
                        <div :class="`_ball fill-mode-both ${fillModeSwitch.both ? '_active' : ''}`"></div>
                        <div class="state-info">
                            <span class="before-state">开始前: 应用第一帧</span>
                            <span class="after-state">结束后: 保持最后一帧</span>
                        </div>
                    </div>
                </div>
                <a-button @click="handleFillModeSwitch('both')" size="small">
                    {{ fillModeSwitch.both ? '重置' : '播放' }}
                </a-button>
            </div>
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

const fillModeSwitch = ref({
    none: false,
    forwards: false,
    backwards: false,
    both: false
});

const handleTabSwitch = (param) => {
    ballSwitch.value[param] = !ballSwitch.value[param];
}

const handleFillModeSwitch = (param) => {
    if (fillModeSwitch.value[param]) {
        // 重置动画
        fillModeSwitch.value[param] = false;
    } else {
        // 播放动画
        fillModeSwitch.value[param] = true;
        // 3秒后自动停止动画以观察fill-mode效果
        setTimeout(() => {
            // 注意：这里不重置状态，让用户手动重置以观察效果
        }, 3000);
    }
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
    
    // Animation Fill Mode Demo Styles
    .fill-mode-section {
        margin-top: 40px;
        padding-top: 20px;
        border-top: 2px solid #e6e6e6;
        
        .section-title {
            color: #333;
            font-size: 18px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .section-desc {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
        }
        
        .fill-mode-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            
            .fill-mode-item {
                width: calc(100% - 80px);
                border: 1px solid #ccc;
                padding: 15px;
                display: flex;
                flex-direction: column;
                border-radius: 6px;
                background-color: #fafafa;
                
                ._label {
                    display: inline-block;
                    width: 80px;
                    text-align: left;
                    margin-bottom: 10px;
                    font-weight: 500;
                    color: #333;
                }
                
                .fill-mode-container {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    
                    ._ball {
                        width: 40px;
                        height: 40px;
                        background-color: #ff6b6b;
                        border-radius: 50%;
                        position: relative;
                        // 初始状态：蓝色，在左边
                        background-color: #4dabf7;
                        transform: translateX(0) scale(1);
                        opacity: 0.7;
                    }
                    
                    .state-info {
                        display: flex;
                        flex-direction: column;
                        font-size: 12px;
                        color: #666;
                        margin-left: 20px;
                        
                        .before-state, .after-state {
                            margin-bottom: 4px;
                        }
                        
                        .before-state {
                            color: #52c41a;
                        }
                        
                        .after-state {
                            color: #722ed1;
                        }
                    }
                }
            }
        }
    }
}

// Fill Mode Animation Keyframes
@keyframes fillModeDemo {
    0% {
        transform: translateX(0) scale(1);
        background-color: red;
        opacity: 0.7;
        border-radius: 50%;
    }
    50% {
        transform: translateX(200px) scale(1.5);
        background-color: #ff8787;
        opacity: 1;
        border-radius: 0;
    }
    100% {
        transform: translateX(400px) scale(0.8);
        background-color: #69db7c;
        opacity: 0.9;
        border-radius: 10px;
    }
}

// Fill Mode Classes
.fill-mode-none._active {
    animation: fillModeDemo 3s ease-in-out;
    animation-fill-mode: none;
    animation-delay: 0.5s;
}

.fill-mode-forwards._active {
    animation: fillModeDemo 3s ease-in-out;
    animation-fill-mode: forwards;
    animation-delay: 0.5s;
}

.fill-mode-backwards._active {
    animation: fillModeDemo 3s ease-in-out;
    animation-fill-mode: backwards;
    animation-delay: 0.5s;
}

.fill-mode-both._active {
    animation: fillModeDemo 3s ease-in-out;
    animation-fill-mode: both;
    animation-delay: 0.5s;
}
</style>