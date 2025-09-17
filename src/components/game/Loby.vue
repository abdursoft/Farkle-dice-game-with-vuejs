<template>
    <div class="flex flex-col relative">
        <!-- Main Actions -->
        <div class="flex items-center justify-between mt-20 md:mt-10 gap-3">
            <div class="flex items-center justify-center flex-col">
                <DiceIcon class="w-[55px] h-[55px] bg-white rounded-full p-2 text-white" />
                <small
                    class="text-[9px] md:text-[11px] bg-[#9E5B2B] text-white px-1 md:px-3 py-1 rounded-md md:rounded-full">Your
                    Dice</small>
            </div>

            <div class="w-55 relative rounded-[18px] p-3 cursor-pointer" :style="`background: ${primaryLight}`">
                <button @click="goPlayerVS('robot')" class="w-full py-1 text-white font-bold cursor-pointer">
                    NEW GAME
                </button>
                <div class="bg-black rounded-full h-5 text-center text-white text-sm">0/2000</div>
            </div>
            <div class="flex items-center justify-center flex-col">
                <Icon icon="streamline-ultimate-color:ads-window" width="40" height="40" />
                <small
                    class="text-[9px] md:text-[11px] bg-[#9E5B2B] text-white px-1 md:px-3 py-1 rounded-md md:rounded-full">No
                    Ads</small>
            </div>
        </div>
        <div class="w-full mx-auto flex items-center justify-center mt-10">
            <button @click="farkle.toggleFriends()"
                class="w-65 py-3 rounded-[24px] text-white font-bold shadow-lg cursor-pointer"
                :style="`background: ${tertiary}`">
                PLAY WITH FRIENDS!
            </button>
        </div>

        <!-- Challenges List -->
        <div class="flex flex-col gap-3 mt-6 overflow-y-auto max-h-[70vh] pb-[50px] pt-[10px]">
            <Challenge v-for="challenge in challenges" :key="challenge.id" :user="challenge" />
        </div>

        <!-- open friends list  -->
        <Friends />
    </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import Challenge from "./Challenge.vue";
import DiceIcon from "@/assets/icons/dice1.svg"
import { useRouter } from "vue-router";
import Friends from "../modal/Friends.vue";
import { useFarkleStore } from "@/stores/farkleStore";
import { primaryLight, tertiary } from "@/services/colors";

// import { getEcho } from '@/plugins/Echo';
import { onMounted, ref, watch, watchEffect } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getEcho } from "@/plugins/Echo";

const challengesRef = ref([]);

const authStore = useAuthStore();

const router = useRouter();
const farkle = useFarkleStore();

farkle.resetUsers();

function goPlayerVS(mode) {
    router.push({ name: 'playerVs', params: { type: mode } })
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

watch(
    () => authStore.authUser, // source
    async (newValue, oldValue) => { // callback
        if (newValue) {
            console.log('Auth user changed:', newValue);
            await fetchChallenges();
        }
    }
);

async function fetchChallenges() {
    const token = localStorage.getItem('dicToken');
    const userId = authStore.authUser.id;

    if (!token) return;

    const echo = getEcho(token);

    echo.private(`user.challenge.${userId}`)
        .listen('ChallengeEvent', (event) => {
            console.log('Challenge received:', event);
        });

}
</script>
