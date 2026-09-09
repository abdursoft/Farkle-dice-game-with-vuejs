<script setup>
import Settings from '@/components/modal/Settings.vue';
import Navbar from '@/components/nav/navbar.vue';
import { getEcho, initEcho } from '@/plugins/Reverb';
import { primary, secondary, tertiary } from '@/services/colors';
import { useAuthStore } from '@/stores/authStore';
import { useFarkleStore } from '@/stores/farkleStore';
import { Icon } from '@iconify/vue';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const farkle = useFarkleStore();
const authStore = useAuthStore();
const isAuth = ref(false)

function goBack() {
  window.history.back();
}


onBeforeMount(async() => {
  const auth = await authStore.authCheck();
  if(auth?.status === 200){
    isAuth.value = true;
    router.push({name:'lobby'});
  }
});

onMounted(() => {
  const token = localStorage.getItem('dicToken');
  const echo = getEcho();
  if(!echo){
    console.log('Echo not found!');
    initEcho(token);
    console.log('Echo successfully initialized')
  }
  farkle.getSfx();
});
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-between relative">

    <!-- Top Bar -->
    <div
      class="w-full"
      :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`"
    >
      <div class="max-w-[445px] w-full mx-auto flex items-center justify-between p-4 h-[60px] text-white shadow">
        <div class="flex items-center gap-2">
          <img
            :src="`/avatar/avatar${authStore.authUser?.avatar}.svg`"
            alt="avatar"
            class="w-10 h-10 rounded-full border-2 border-white"
          />
          <div class="flex flex-col">
            <span class="font-bold text-white">{{ authStore.authUser?.name.slice(0,13) }}</span>
            <span class="text-sm">Best {{ authStore.authUser?.highest_score ?? '0' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-1 bg-white rounded-lg px-3 py-1 cursor-pointer"
            @click="goBack"
          >
            <Icon icon="akar-icons:arrow-back" width="24" height="24" class="text-black" />
            <span class="text-slate-500">{{ $t('back') }}</span>
          </div>
          <button
            class="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer"
            @click="farkle.toggleSettings(true)"
          >
            <Icon icon="qlementine-icons:settings-24" width="24" height="24" class="text-black" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col relative overflow-auto px-2 pt-[20px] pb-[20px]"
      :style="`background: linear-gradient(175deg, ${primary} 0%, ${tertiary} 80%)`"
    >
      <div class="max-w-[445px] w-full mx-auto flex-1 flex flex-col">
        <router-view class="flex-1" />
        <Settings />
      </div>
    </div>

    <Navbar />

    <!-- Auth checking -->
    <div class="h-full w-full absolute flex items-center justify-center text-white font-bold bg-slate-900" v-show="!isAuth">
      <h2>Auth Checking ....</h2>
    </div>
  </div>
</template>
