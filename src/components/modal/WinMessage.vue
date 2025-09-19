<script setup>
import { darkOverlay, overlay, primary, secondary, tertiary } from '@/services/colors';


    const emits = defineEmits(['resetGame']);

    const props = defineProps({
        isWin:{
            Boolean,
            default: false
        },
        winMessage:{
            String,
            default:null
        }
    });

    function playAgain(){
        emits('resetGame',true);
    }

</script>

<template>
    <div v-if="props.isWin" class="w-full h-screen flex items-center justify-center fixed top-0 left-0 inset-0 z-99 px-3">
        <div data-aow="fade-up" class="md:max-w-[40vw] w-full max-w-[420px] rounded-lg border-2 border-orange-600 px-3 h-50 text-center relative text-white py-3" :style="`background: ${darkOverlay}`">
            <h3 class="text-2xl border-b-3 border-black lilita">Game END!</h3>
            <p class="mt-3">{{ winMessage }}</p>
            <div class="absolute flex items-center justify-center gap-2 w-full bottom-5 left-0 px-2">
                <div class="h-1 w-[90px] bg-white"></div>
                <button class="px-3 py-2 bg-orange-600 text-white rounded-lg flex-1 cursor-pointer lilita text-xl" @click="playAgain">Play Again</button>
                <div class="h-1 w-[90px] bg-white"></div>
            </div>
        </div>
    </div>
</template>