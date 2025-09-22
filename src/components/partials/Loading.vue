<script setup>
import { ref } from 'vue';
import Progress from './Progress.vue';
import Dice from '@/assets/icons/dice-look.svg';
import Account from './Account.vue';

const isProgress = ref(true);

function progress(value){
    isProgress.value = value;
}
</script>

<template>
    <div class="h-[95vh] w-full max-w-[445px] py-5 px-2 flex flex-col items-center justify-center gap-10">
        <!-- logo area  -->
        <div class="w-full flex items-center justify-center flex-col gap-1 py-10">
            <Dice class="w-[100px] h-[100px] delay-300" :class="{'animate-spin':isProgress}" />
            <h1 class="text-4xl font-bold lilita text-orange-600">FARKLE</h1>
        </div>

        <!-- loading area  -->
        <Progress @endProgress="progress" />

        <!-- account area  -->
        <Account v-if="!isProgress" />

        <!-- version area  -->
        <p class="text-sm absolute bottom-5 left-0 w-full text-center text-white">version 1.0.0</p>
    </div>
</template>