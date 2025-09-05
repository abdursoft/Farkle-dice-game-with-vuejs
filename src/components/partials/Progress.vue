<template>
    <div class="w-full p-2 flex flex-col items-center justify-center gap-3" v-if="loading">
        <div class="w-full max-w-[320px] overflow-hidden h-6 rounded-[15px] bg-gray-400 z-50 relative">
            <div class="h-6 bg-orange-400 transition-all duration-300" :style="{ width: progress + '%' }"></div>
            <span class="text-center text-white font-bold absolute top-0 left-0 w-full h-full">{{ progress }}%</span>
        </div>
        <h3 class="text-base uppercase lilita font-[300] text-center">{{ props.title }}...</h3>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const emits = defineEmits(['endProgress']);

const props = defineProps({
    title:{
        String,
        default:'Loading'
    }
});

const loading = ref(true);
const progress = ref(0);
let interval = null;

const startLoading = () => {
    progress.value = 0;
    loading.value = true;

    interval = setInterval(() => {
        if (progress.value < 90) {
            progress.value += 5; // simulate progress
        }
    }, 200);
};

const finishLoading = () => {
    progress.value = 100;
    setTimeout(() => {
        loading.value = false;
        clearInterval(interval);
        emits('endProgress',loading.value);
    }, 500);
};

onMounted(() => {
    startLoading();

    // Simulate page/data load (replace with your API calls or router hooks)
    setTimeout(() => {
        finishLoading();
    }, 5000);
});

onBeforeUnmount(() => {
    clearInterval(interval);
});
</script>
