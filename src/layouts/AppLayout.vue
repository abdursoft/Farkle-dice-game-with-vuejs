<script setup>
import { primary, secondary } from '@/services/colors';


</script>

<template>
  <div class="w-full flex items-center justify-center min-h-screen" :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`">
    <div class="h-[90vh] w-full max-w-[430px] bg-white py-5 flex flex-col items-center justify-center gap-10 rounded-md" :style="`background: linear-gradient(175deg, ${primary} 0%, ${secondary} 80%)`">
        <router-view></router-view>
    </div>
  </div>
</template>
