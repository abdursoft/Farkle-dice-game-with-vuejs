<script setup>
import Settings from '@/components/modal/Settings.vue';
import { useAuthStore } from '@/stores/authStore';
import { useFarkleStore } from '@/stores/farkleStore';
import { Icon } from '@iconify/vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const farkle = useFarkleStore();
const authStore = useAuthStore();

function goBack(){
    router.push({name:'home'});
}

function openRoute(name){
    router.push({name:name})
}

onMounted(() => {
    authStore.authCheck();
});
</script>

<template>
    <div class="w-full flex items-center justify-center relative">
        <div class="w-full max-w-[445px] h-screen relative flex flex-col">
        <!-- Top Bar -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-orange-200 to-orange-300 shadow h-[60px] fixed top-0 w-full max-w-[445px] z-9">
            <div class="flex items-center gap-2">
                <img :src="`/avatar/avatar${authStore.authUser?.avatar}.svg`" alt="avatar" class="w-10 h-10 rounded-full border-2 border-white" />
                <div class="flex flex-col">
                    <span class="font-bold text-gray-800">{{ authStore.authUser?.name }}</span>
                    <span class="text-sm">Best {{ authStore.authUser?.highest_score ?? '0' }}</span>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex items-center gap-1 bg-white rounded-lg px-3 py-1 cursor-pointer" @click="goBack">
                    <Icon icon="akar-icons:arrow-back" width="24" height="24" />
                    <span class="text-slate-500">Back</span>
                </div>
                <button class="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer"><Icon icon="qlementine-icons:settings-24" width="24" height="24" @click="farkle.toggleSettings(true)" /></button>
            </div>
        </div>
        <div class="w-full h-full max-w-[445px] bg-gray-200 py-5 px-2 flex flex-col items-center justify-center gap-10 pb-30 mt-[60px] pt-10 mb-[60px] relative">
            <router-view></router-view>
            <!-- settings  -->
            <Settings />
        </div>

        <!-- Bottom Nav -->
        <div class="mt-auto flex justify-around py-2 bg-gradient-to-r from-orange-300 to-orange-400 h-[60px] fixed bottom-0 w-full max-w-[445px] z-9">
            <button><Icon icon="fluent:crown-24-filled" width="34" height="34" class="text-slate-700 cursor-pointer hover:text-white transition" /></button>
            <button><Icon icon="ion:dice-sharp" width="34" height="34" class="text-slate-700 cursor-pointer hover:text-white transition" /></button>
            <button class="w-12 h-12 rounded-full shadow flex items-center justify-center border-1 border-gray-100 p-2 !mb-5"><Icon icon="streamline-flex:home-2-solid" width="54" height="54" class="text-white cursor-pointer hover:text-gray-300" @click="openRoute('home')" /></button>
            <button><Icon icon="uil:statistics" width="34" height="34" class="text-slate-700 cursor-pointer hover:text-white transition" @click="openRoute('history')" /></button>
            <button><Icon icon="solar:gamepad-old-bold" width="34" height="34" class="text-slate-700 cursor-pointer hover:text-white transition" /></button>
        </div>
    </div>
    </div>
</template>
