<script setup>
import WinSVG from '@/assets/icons/win.svg'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import VS from '@/assets/images/vs.png'
import Dice5 from '@/assets/icons/white/dice5.svg'
import Dice2 from '@/assets/icons/white/dice2.svg'
import Progress from '../partials/Progress.vue';
import { useFarkleStore } from '@/stores/farkleStore';
import { computed, onMounted, ref } from 'vue';
import WinScore from '../modal/WinScore.vue';
import { useAuthStore } from '@/stores/authStore';
import { primaryLight } from '@/services/colors';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isPVP = ref(false);
const isPlayable = ref(false);

const props = defineProps({
    mode:{
        String,
        default:'pvp'
    },
    roll:{
        Boolean,
        default: true
    }
})

const farkle = useFarkleStore();

function challengeGame(){
    if(isPlayable.value){
        router.push({ name: 'test' })
    }
}

async function setGameScore(value){
    farkle.setWinScore(value);
    
    const challenge = await farkle.challengeFriend(authStore.friend?.id, farkle.winScore);
    console.log(challenge);

    if(challenge.status === 201){
        router.push({name:'test'});
    }
}


function openGame() {
    farkle.setGameMode(route.params?.type);
    farkle.setAutoRoll(props.roll);
    farkle.setWinScore(2000)
    if(!isPVP.value){
        farkle.addUser('Robot', 'robot');
        challengeGame();
    }
}

onBeforeRouteLeave((to, from) => {
  // Example: detect back navigation with custom logic
  if (window.history.state?.back) {
    farkle.resetUsers();
  }
})

onMounted(async () => {
    isPVP.value = route.params.type === 'pvp' ? true : false;
    const friend = await authStore.getFriend(route.params?.playerId);
    console.log(friend);
    if(friend.status === 200){
        isPlayable.value = true;
        farkle.addUser(authStore.authUser?.name,authStore.authUser?.id,authStore.authUser?.avatar);
        farkle.addUser(friend.data.friend.name, friend.data.friend.id,friend.data.friend.avatar);
    }

});
</script>

<template>
    <!-- game lobby initiate  -->
    <div class="h-[90vh] w-full max-w-[445px] py-5 flex flex-col items-center justify-center gap-10 relative" :style="`background: ${primaryLight}`">
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
                    <div class="flex items-center justify-center flex-col gap-2" v-for="(user, index) in farkle.users" :key="index">
                        <img :src="`/avatar/avatar${user.avatar}.svg`" class="w-[100px] h-[100px] rounded-full border-1 border-gray-200" />
                        <h2 class="text-xl lilita text-white">{{ index == 0 ? 'You' : user.name?.slice(0,8) }}</h2>
                    </div>
                </div>
            </div>
            <div class="w-full flex items-center justify-center mt-15">
                <div class="flex items-center justify-center flex-col gap-2">
                    <img :src="VS" class="w-[60px] h-[60px] rounded-full border-1 border-gray-200 p-2" />
                </div>
            </div>
            <!-- dice queue  -->
            <div class="w-full px-15 -mt-5">
                <div class="w-full flex items-center justify-between">
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Dice5 class="w-[100px] h-[100px] p-3" />
                    </div>
                    <div class="flex items-center justify-center flex-col gap-2">
                        <Dice2 class="w-[100px] h-[100px] p-3" />
                    </div>
                </div>
            </div>

            <!-- progress loader  -->
            <Progress @end-progress="openGame" title="Farkle initializing" />

            <!-- win score setter  -->
            <WinScore v-if="isPVP" @callbackScore="setGameScore" />
        </div>
    </div>
</template>