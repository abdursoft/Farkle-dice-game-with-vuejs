<script setup>
import { primary, secondary } from '@/services/colors';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async() => {
  const auth = await authStore.authCheck(false);
  if(auth?.status === 200){
    if(route.name !== 'playerVs'){
      router.push({name:'lobby'});
    }
  }
});
</script>

<template>
  <div class="w-full flex items-center justify-center min-h-screen" :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`">
    <div class="h-[95vh] w-full max-w-[430px] bg-white py-5 flex flex-col items-center justify-center gap-10 rounded-md" :style="`background: linear-gradient(175deg, ${primary} 0%, ${secondary} 80%)`">
        <router-view></router-view>
    </div>
  </div>
</template>
