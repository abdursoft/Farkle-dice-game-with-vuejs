<script setup>
import Settings from '@/components/modal/Settings.vue';
import { primary, secondary, tertiary } from '@/services/colors';
import { useAuthStore } from '@/stores/authStore';
import { useFarkleStore } from '@/stores/farkleStore';
import { Icon } from '@iconify/vue';
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const farkle = useFarkleStore();
const authStore = useAuthStore();

function goBack() {
  router.push({ name: 'home' });
}

function openRoute(name) {
  router.push({ name: name });
}

onBeforeMount(async() => {
  const auth = await authStore.authCheck(false);
  if(auth?.status === 200){
    router.push({name:'lobby'});
  }
});
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-between relative">

    <!-- Top Bar -->
    <div
      class="w-full"
      :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`"
    >
      <div class="max-w-[445px] w-full mx-auto flex items-center justify-between p-4 h-[60px] text-white shadow" v-if="authStore.authUser?.id">
        <div class="flex items-center gap-2">
          <img
            :src="`/avatar/avatar${authStore.authUser?.avatar}.svg`"
            alt="avatar"
            class="w-10 h-10 rounded-full border-2 border-white"
          />
          <div class="flex flex-col">
            <span class="font-bold text-white">{{ authStore.authUser?.name }}</span>
            <span class="text-sm">Best {{ authStore.authUser?.highest_score ?? '0' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div
            class="flex items-center gap-1 bg-white rounded-lg px-3 py-1 cursor-pointer"
            @click="goBack"
          >
            <Icon icon="akar-icons:arrow-back" width="24" height="24" class="text-black" />
            <span class="text-slate-500">Back</span>
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

    <!-- Bottom Nav -->
    <div
      class="w-full"
      :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`"
    >
      <div class="max-w-[445px] w-full mx-auto flex justify-around py-2 h-[60px]">
        <button>
          <Icon
            icon="fluent:crown-24-filled"
            width="34"
            height="34"
            class="text-gray-400 cursor-pointer hover:text-white transition"
          />
        </button>
        <button>
          <Icon
            icon="ion:dice-sharp"
            width="34"
            height="34"
            class="text-gray-400 cursor-pointer hover:text-white transition"
          />
        </button>
        <button
          class="w-12 h-12 rounded-full shadow flex items-center justify-center border border-gray-100 p-2 !mb-5"
          @click="openRoute('home')"
        >
          <Icon
            icon="streamline-flex:home-2-solid"
            width="54"
            height="54"
            class="text-white cursor-pointer hover:text-gray-300"
          />
        </button>
        <button @click="openRoute('history')">
          <Icon
            icon="uil:statistics"
            width="34"
            height="34"
            class="text-gray-400 cursor-pointer hover:text-white transition"
          />
        </button>
        <button>
          <Icon
            icon="solar:gamepad-old-bold"
            width="34"
            height="34"
            class="text-gray-400 cursor-pointer hover:text-white transition"
          />
        </button>
      </div>
    </div>

  </div>
</template>
