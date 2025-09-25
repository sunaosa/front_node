<template>
    <div class="css-container">
        <div class="item">
            <label class="_label">Linear:</label>
            <div class="_ball linear">
            </div>
        </div>
        <div class="item">
            <label class="_label">Ease:</label>
            <div class="_ball ease">
            </div>
        </div>
        <div class="item">
            <label class="_label">Ease Out:</label>
            <div class="_ball ease-out">
            </div>
        </div>
        <div class="item">
            <label class="_label">Ease In Out:</label>
            <div class="_ball ease-in-out">
            </div>
        </div>
    </div>
</template>
<script setup>
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
    .item {
        width: 100%;
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
            animation: roll 3s;
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
    }
}
</style>