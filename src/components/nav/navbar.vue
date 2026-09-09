<script setup>
import { primary, secondary } from '@/services/colors';
import { useAuthStore } from '@/stores/authStore';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

console.log('Auth User in Navbar:', authStore.authUser.name);

function openRoute(name) {
  router.push({ name: name });
}
</script>


<template>
  <!-- Bottom Nav -->
  <div
    class="w-full"
    :v-show="authStore.authUser?.id"
    :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`"
  >
    <div class="max-w-[445px] w-full mx-auto flex justify-around py-2 h-[60px]">
      <button>
        <Icon
          icon="fluent:crown-24-filled"
          width="34"
          height="34"
          class="text-gray-400 cursor-pointer hover:text-white transition"
          @click="openRoute('credit')"
        />
      </button>
      <button>
        <Icon
          icon="ion:dice-sharp"
          width="34"
          height="34"
          @click="openRoute('reffer')"
          class="text-gray-400 cursor-pointer hover:text-white transition"
        />
      </button>
      <button
        class="w-12 h-12 rounded-full shadow flex items-center justify-center border border-gray-100 p-2 !mb-5"
        @click="openRoute('lobby')"
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
</template>
