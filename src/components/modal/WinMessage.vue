<script setup>

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
    <div v-if="props.isWin" class="w-full h-full bg-[rgba(255,255,255,0.6)] flex items-center justify-center absolute top-0 left-0 inset-0 z-99 px-3">
        <div class="w-[90vw] rounded-lg border-2 bg-orange-400 border-orange-600 p-3 h-[200px] text-center relative">
            <h3 class="text-2xl border-b-3 border-black lilita">You Win!</h3>
            <p class="mt-3">{{ winMessage }}</p>
            <div class="absolute flex items-center justify-center gap-2 w-full -bottom-5 left-0 px-2">
                <div class="h-1 w-[90px] bg-white"></div>
                <button class="px-3 py-2 bg-orange-600 text-white rounded-lg flex-1 cursor-pointer lilita text-xl" @click="playAgain">Play Again</button>
                <div class="h-1 w-[90px] bg-white"></div>
            </div>
        </div>
    </div>
</template>