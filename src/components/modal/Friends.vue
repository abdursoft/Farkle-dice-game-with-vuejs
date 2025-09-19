<script setup>
import { primary, primaryLight, tertiary } from '@/services/colors';
import { useAuthStore } from '@/stores/authStore';
import { useFarkleStore } from '@/stores/farkleStore';
import { Icon } from '@iconify/vue';
import { reactive, ref, watchEffect } from 'vue';
import { onBeforeRouteLeave, useRouter } from 'vue-router';

const router = useRouter();
const farkle = useFarkleStore();
const authStore = useAuthStore();
const isLoading = ref(false);

const emits = defineEmits(['setChallengeID']);

const user = reactive({
    name: ''
})

function toggleFriends() {
    farkle.toggleFriends(false);
}

onBeforeRouteLeave((to, from) => {
    if(farkle.openFriends){
        toggleFriends();
    }
})

async function searchFriends(){
    if(user.name.length < 3) return;
    isLoading.value = true;
    await authStore.searchFriends(user.name);
    isLoading.value = false;
}
</script>

<template>
    <div class="w-full h-screen flex items-center justify-center fixed top-0 left-0 inset-0 z-[99] px-3"
        v-if="farkle.openFriends">
        <div class="md:max-w-[40vw] w-full max-w-[420px] rounded-lg border-2 border-orange-600 px-3 h-auto text-center relative" :style="`background: ${primary}`">
            <div class="px-7">
                <h3 class="text-2xl text-white lilita rounded-br-md rounded-bl-md" :style="`background:${tertiary}`">Friends!</h3>
            </div>
            <div class="px-4 w-full mt-5 text-white">
                <div class="w-full flex items-center justify-between gap-3">
                    <input type="text" class="flex-1 p-2 rounded-lg border-1 border-gray-400" v-model="user.name" placeholder="Friend name..." />
                    <Icon icon="iconoir:search" width="44" height="44" class="cursor-pointer p-2 rounded-full hover:bg-gray-800" @click="searchFriends" />
                </div>
                <div class="mt-5 w-full rounded-md min-h-65 max-h-80 overflow-y-auto relative" :style="`background: ${primaryLight}`">
                    <div class="flex items-center justify-center h-full w-full absolute text-center" v-if="isLoading" >
                        <Icon icon="svg-spinners:6-dots-rotate" width="44" height="44" />
                    </div>
                    <template v-else>
                        <div v-for="(friend, index) of authStore.friends" :key="index" class="w-full flex items-center justify-between p-2 border-b-2 border-gray-300">
                            <div class="flex items-center gap-2 flex-1">
                                <img :src="`/avatar/avatar${index+1}.svg`" alt="avatar" class="w-10 h-10 rounded-full border-2 border-white" />
                                <div class="flex flex-col items-start gap-1">
                                    <p class="font-bold text-white line-clamp-1 text-left">{{ friend.name.slice(0,10) }}</p> 
                                    <small class="text-sm text-white text-[13px]">#{{ friend.token }}</small>
                                </div>
                            </div>
                            <button class="px-3 py-1 rounded-md bg-green-600 text-white w-[100px] cursor-pointer" @click="emits('setChallengeID',friend.token)">Challenge</button>
                        </div>
                    </template>
                </div>
            </div>
            <div class="text-center w-full mt-5 flex items-center justify-between gap-1 px-4 text-white">
                <p>Player ID: #{{ authStore.authUser?.token }}</p>
                <p>App v1.0.0</p>
            </div>
            <Icon icon="system-uicons:cross-circle" width="28" height="28" class="absolute top-1 right-1 cursor-pointer text-white"
                @click="toggleFriends" />
        </div>
    </div>
</template>