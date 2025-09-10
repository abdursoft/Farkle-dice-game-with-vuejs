<script setup>
import { useFarkleStore } from '@/stores/farkleStore';


    const farkle = useFarkleStore();
</script>

<template>
    <div class="w-full flex justify-between gap-1 rounded-md my-2 px-1">
        <div v-for="(user,index) in farkle.users" :key="index" class="w-1/2 relative h-full">
            <div class="w-full text-center flex items-center justify-center flex-col bg-amber-700 rounded-tl-[20px] rounded-tr-[20px]">
                <img src="/images/dice1.png" alt="You" class="w-[30px] h-[30px] rounded-full -top-15">
                <h3 class="text-[11px] text-white">{{ user.name }}</h3>
                <h3 class="text-[12px] text-white font-bold">{{ user.score }}</h3>
            </div>
            <div class="mt-3 bg-amber-800 px-2 overflow-hidden rounded-bl-md rounded-br-md">
                <template v-for="(turn,tIndex) in user.turns" :key="tIndex" >
                    <div v-if="tIndex <= 6" class="border-b-1 border-gray-200 flex items-center text-white justify-between">
                        <p class="turn text-[11px] font-semibold">{{ tIndex + 1 }}</p>
                        <p class="score text-[11px] font-semibold">{{ turn }}</p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>