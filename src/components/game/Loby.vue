<template>
    <div class="flex flex-col relative">
        <!-- Main Actions -->
        <div class="flex items-center justify-between mt-20 md:mt-10 gap-3">
            <div class="flex items-center justify-center flex-col">
                <DiceIcon class="w-[55px] h-[55px] bg-white rounded-full p-2 text-white" />
                <small class="text-[9px] md:text-[11px] bg-[#9E5B2B] text-white px-1 md:px-3 py-1 rounded-md md:rounded-full">Your Dice</small>
            </div>

            <div class="w-55 bg-orange-500 relative rounded-[18px] p-3 cursor-pointer">
                <button @click="goPlayerVS('robot')" class="w-full py-1 text-white font-bold cursor-pointer">
                    NEW GAME
                </button>
                <div class="bg-black rounded-full h-5 text-center text-white text-sm">0/2000</div>
            </div>
             <div class="flex items-center justify-center flex-col">
                <Icon icon="streamline-ultimate-color:ads-window" width="40" height="40" />
                <small class="text-[9px] md:text-[11px] bg-[#9E5B2B] text-white px-1 md:px-3 py-1 rounded-md md:rounded-full">No Ads</small>
            </div>
        </div>
        <div class="w-full mx-auto flex items-center justify-center mt-10">
            <button @click="goPlayerVS('pvp')" class="w-65 py-3 rounded-[24px] bg-[#00A2E5] text-white font-bold shadow-lg cursor-pointer">
                PLAY WITH FRIENDS!
            </button>
        </div>

        <!-- Challenges List -->
        <div class="flex flex-col gap-3 mt-6 overflow-y-auto max-h-[70vh] pb-[50px] pt-[10px]">
            <Challenge v-for="challenge in challenges" :key="challenge.id" :user="challenge" />
        </div>
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import Challenge from "./Challenge.vue";
import DiceIcon from "@/assets/icons/dice1.svg"
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useFarkleStore } from "@/stores/farkleStore";

const router = useRouter();
const farkle = useFarkleStore();

const showSettings = ref(true);

function goPlayerVS(mode){
    router.push({name:'playerVs', params:{type:mode}})
}

const challenges = [
    { id: 1, name: "SplendidKoala", status: "yourTurn", avatar: "/avatars/pineapple.png" },
    { id: 2, name: "Jill R.", status: "challenged", avatar: "/avatars/dog.png" },
    { id: 3, name: "SpicyKangaroo", status: "challenged", avatar: "/avatars/cherry.png" },
    { id: 4, name: "SplendidKoala", status: "yourTurn", avatar: "/avatars/pineapple.png" },
    { id: 5, name: "Jill R.", status: "challenged", avatar: "/avatars/dog.png" },
    { id: 6, name: "SpicyKangaroo", status: "challenged", avatar: "/avatars/cherry.png" },
    { id: 7, name: "SplendidKoala", status: "yourTurn", avatar: "/avatars/pineapple.png" },
    { id: 8, name: "Jill R.", status: "challenged", avatar: "/avatars/dog.png" },
    { id: 9, name: "SpicyKangaroo", status: "challenged", avatar: "/avatars/cherry.png" },

]
</script>
