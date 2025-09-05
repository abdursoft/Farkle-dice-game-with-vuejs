<script setup>
import Edit from '@/assets/icons/editWhite.svg'
import Dice from '@/assets/icons/dice-look.svg'
import { useRouter } from 'vue-router';

const router = useRouter();

function goLobby(){
    router.push({name:'lobby'})
}
</script>

<template>
    <div class="h-[90vh] w-full max-w-[445px] bg-white py-5 px-2 flex flex-col items-center justify-center gap-10">
        <div class="w-full flex items-center justify-center">
            <div class="w-[200px] h-[200px] rounded-full border-5 border-gray-400 relative p-1">
                <Dice class="w-full h-full" />
                <div class="w-[40px] h-[40px] absolute rounded-full top-10 -right-4 bg-slate-700 p-1 text-white">
                    <Edit class="w-full h-full text-orange stroke-[#fff] cursor-pointer" />
                </div>
            </div>
        </div>
        <div class="w-full my-5 px-5">
            <div>
                <label for="name">Your Name</label>
                <input type="text" class="w-full p-3 rounded-lg border-2 border-gray-400" placeholder="JhonDoe" />
            </div>
            <div class="my-2">
                <label for="email">Email Address</label>
                <input type="email" class="w-full p-3 rounded-lg border-2 border-gray-400"
                    placeholder="jhon_doe@gmail.com" />
            </div>
            <div class="w-full flex items-center justify-center mt-8">
                <button
                    @click="goLobby"
                    class="rounded-[24px] shadow-lg bg-orange-600 uppercase text-white text-2xl py-2 px-4 border-1 border-slate-500 cursor-pointer lilita">Create
                    Account</button>
            </div>
        </div>
    </div>
</template>