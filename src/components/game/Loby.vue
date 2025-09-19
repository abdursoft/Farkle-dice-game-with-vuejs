<template>
    <div class="flex flex-col relative">
        <!-- Main Actions -->
        <div class="flex items-center justify-between mt-20 md:mt-10 gap-3 px-3">
            <div class="flex items-center justify-center flex-col">
                <DiceIcon class="w-[55px] h-[55px] bg-white rounded-full p-2 text-white" />
                <small
                    class="text-[9px] md:text-[11px] bg-[#9E5B2B] text-white px-1 md:px-3 py-1 rounded-md md:rounded-full">Your
                    Dice</small>
            </div>

            <div class="w-60 relative rounded-[18px] p-3 cursor-pointer" :style="`background: ${primaryLight}`">
                <button @click="goPlayerVS('robot')" class="w-full py-1 text-white font-bold cursor-pointer">
                    PLAY WITH ROBOT
                </button>
                <div class="bg-black rounded-full h-5 text-center text-white text-sm">0/2000</div>
            </div>
            <div class="flex items-center justify-center flex-col">
                <Icon icon="streamline-ultimate-color:ads-window" width="50" height="50" class="bg-white rounded-full p-2 text-white" />
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
    </div>
    <!-- Challenges List -->
    <div class="flex flex-col gap-3 mt-6 overflow-y-auto max-h-[70vh] pb-[50px] pt-[10px]">
        <Challenge v-for="challenge in challengesRef" :key="challenge.id" :challenge="challenge" :user="challenge.challenger" @onPlay="onPlayEvent" />
    </div>

    <!-- open friends list  -->
    <Friends @setChallengeID="setChallengePlayer"/>
    
    <!-- win score setter  -->
    <WinScore v-if="isScore" @callbackScore="setGameScore" @toggleShow="toggleScoreSet" />
</template>

<script setup>
import { Icon } from "@iconify/vue";
import Challenge from "./Challenge.vue";
import DiceIcon from "@/assets/icons/dice1.svg"
import { useRouter } from "vue-router";
import Friends from "../modal/Friends.vue";
import { useFarkleStore } from "@/stores/farkleStore";
import { primaryLight, tertiary } from "@/services/colors";

import { onBeforeUnmount, onMounted, ref, watch, watchEffect } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { getEcho } from "@/plugins/Reverb";
import WinScore from "../modal/WinScore.vue";

const challengesRef = ref([]);

const authStore = useAuthStore();
let channel = null

const router = useRouter();
const farkle = useFarkleStore();

farkle.resetUsers();

const isScore = ref(false);
const challengeID = ref(null);

function toggleScoreSet(value){
    isScore.value = value;
}

function setChallengePlayer(id){
    challengeID.value = id;
    isScore.value = true;
}

async function setGameScore(score){
    farkle.setWinScore(score);
    farkle.setAuthUser(authStore.authUser);
    isScore.value = false;
    const friend = await authStore.getFriend(challengeID.value);
    if(friend.status === 200){
        farkle.addUser(authStore.authUser?.name,authStore.authUser?.id,authStore.authUser?.avatar);
        farkle.addUser(friend.data.friend.name, friend.data.friend.id,friend.data.friend.avatar);

        const challenge = await farkle.challengeFriend(authStore.friend?.id, farkle.winScore);

        if(challenge.status === 201){
            router.push({name:'playerVs', params:{type:'pvp', playerId:challengeID.value}})
        }
    }
}


function goPlayerVS(mode) {
    router.push({ name: 'playerVs', params: { type: mode } })
}

watch(
    () => authStore.authUser, // source
    async (newValue, oldValue) => { // callback
        if (newValue) {
            farkle.setAuthUser(authStore.authUser)
            const chals = await farkle.getChallenges();
            if(chals.status === 200){
                challengesRef.value = chals.data;
            }
            await fetchChallenges();
        }
    }
);

async function fetchChallenges() {
    const token = localStorage.getItem('dicToken');
    const userId = authStore.authUser.id;

    if (!token) return;

    const echo = getEcho();

    channel = echo.private(`user.challenge.${userId}`)
        .listen('ChallengeEvent', (event) => {
            challengesRef.value.push(event.challenge)
            console.log('Challenge received:', event);
        });

}

async function onPlayEvent(challenge){
    const accept = await farkle.acceptChallenge(challenge.id);
    if(accept.status === 200){
        farkle.setWinScore(challenge.challenge_score);
        farkle.addUser(challenge.challenger.name,challenge.challenger.id,challenge.challenger.avatar);
        farkle.addUser(challenge.challengee.name,challenge.challengee.id,challenge.challengee.avatar);
        farkle.setGameRoundID(challenge.gameround.id);

        router.push({name:'test'})
    }
}
    
onBeforeUnmount(() => {
  if (channel) {
    channel.stopListening('ChallengeEvent')
    channel.unsubscribe()
  }
})
</script>
