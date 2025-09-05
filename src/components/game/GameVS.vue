<script setup>
import WinSVG from '@/assets/icons/win.svg'
import { useRouter } from 'vue-router';
import Avatar from '@/assets/avatar/avatar1.svg'
import Player from '@/assets/avatar/avatar2.svg'
import VS from '@/assets/images/vs.png'
import Dice5 from '@/assets/icons/dice5.svg'
import Dice2 from '@/assets/icons/dice2.svg'
import Progress from '../partials/Progress.vue';

const router = useRouter();


function openGame() {
    router.push({ name: 'lobby' })
}
</script>

<template>
    <!-- game lobby initiate  -->
    <div class="h-[90vh] w-full max-w-[445px] py-5 flex flex-col bg-[#A35028] items-center justify-center gap-10">
        <div class="w-full flex items-center justify-center flex-col relative">
            <div class="w-[80px] h-[80px] rounded-full p-1 text-white  absolute -top-20 z-9">
                <WinSVG class="w-full h-full z-9" />
            </div>
            <div class="w-80 border-5 rounded-[18px] border-gray-400 relative p-3 -mt-5 bg-[#F6EFDD]">
                <h3 class="text-xl md:text-3xl lilita text-center text-gray-800">First to reach <br />2500 points win!
                </h3>
            </div>
        </div>
        <div class="container">
            <!-- players queue  -->
            <div class="w-full mt-5 px-5">
                <div class="w-full flex items-center justify-between">
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Avatar class="w-[100px] h-[100px] rounded-full border-1 border-gray-200" />
                        <h2 class="text-xl lilita text-white">You</h2>
                    </div>
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Player class="w-[100px] h-[100px] rounded-full border-1 border-gray-200" />
                        <h2 class="text-xl lilita text-white">Ota Mendi</h2>
                    </div>
                </div>
            </div>
            <div class="w-full flex items-center justify-center -mt-5">
                <div class="flex items-center justify-center flex-col gap-2">
                    <img :src="VS" class="w-[60px] h-[60px] rounded-full border-1 border-gray-200 p-2" />
                </div>
            </div>
            <!-- dice queue  -->
            <div class="w-full px-5 -mt-5">
                <div class="w-full flex items-center justify-between">
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Dice5 class="w-[100px] h-[100px] p-3" />
                    </div>
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Dice2 class="w-[100px] h-[100px] p-3" />
                    </div>
                </div>
            </div>
        </div>

        <!-- progress loader  -->
         <Progress @end-progress="openGame" title="Farkle initializing" />
    </div>
</template>