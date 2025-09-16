<script setup>
import { primary, primaryLight, tertiary } from '@/services/colors';
import { Icon } from '@iconify/vue';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['callbackScore']);
const router = useRouter();

const winScore = reactive({
    score:0
})

function setScore(){
    emits('callbackScore',winScore.score);
}

</script>

<template>
    <div class="w-full h-screen flex items-center justify-center absolute top-0 left-0 inset-0 z-99 px-3">
        <div class="w-[90vw] rounded-lg border-2 border-orange-600 p-3 h-[200px] text-center text-white" :style="`background: ${primary}`">
            <div class="w-full flex items-center gap-3 border-b-3 border-black">
                <Icon icon="line-md:arrow-left" width="24" height="24" class="cursor-pointer" @click="router.push({'name':'lobby'})" />
                <h3 class="text-2xl lilita">Set Win Score!</h3>
            </div>
            <div class="my-2">
                <input type="number" class="w-full p-3 rounded-lg border-2 border-white text-white"
                    placeholder="5000" v-model="winScore.score" />
            </div>
            <div class="w-full flex items-center justify-center mt-8">
                <button
                    @click="setScore"
                    class="rounded-[24px] shadow-lg uppercase text-white text-2xl py-2 px-4 border-1 border-slate-500 cursor-pointer lilita" :style="`background: ${primaryLight}`">Save & Play</button>
            </div>
        </div>
    </div>
</template>