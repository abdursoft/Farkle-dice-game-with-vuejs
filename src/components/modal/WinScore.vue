<script setup>
import { reactive } from 'vue';

const emits = defineEmits(['callbackScore']);

const winScore = reactive({
    score:0
})

function setScore(){
    emits('callbackScore',winScore.score);
}

</script>

<template>
    <div class="w-full h-screen bg-[rgba(255,255,255,0.6)] flex items-center justify-center absolute top-0 left-0 inset-0 z-99 px-3">
        <div class="w-[90vw] rounded-lg border-2 bg-orange-400 border-orange-600 p-3 h-[200px] text-center">
            <h3 class="text-2xl border-b-3 border-black lilita">Set Win Score!</h3>
            <div class="my-2">
                <input type="number" class="w-full p-3 rounded-lg border-2 border-white text-white"
                    placeholder="5000" v-model="winScore.score" />
            </div>
            <div class="w-full flex items-center justify-center mt-8">
                <button
                    @click="setScore"
                    class="rounded-[24px] shadow-lg bg-orange-600 uppercase text-white text-2xl py-2 px-4 border-1 border-slate-500 cursor-pointer lilita">Save & Play</button>
            </div>
        </div>
    </div>
</template>