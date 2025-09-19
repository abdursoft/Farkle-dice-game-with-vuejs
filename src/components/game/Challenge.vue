<template>
  <div class="flex items-center justify-between p-3 rounded-lg shadow" :style="`background: ${primaryLight}`">
    <div class="flex items-center gap-2">
      <img :src="`avatar/avatar${user?.avatar}.svg`" alt="avatar" class="w-12 h-12 rounded-full border" />
      <div>
        <p class="font-semibold text-white line-clamp-1">{{ user?.name.slice(0,15) }}</p>
        <p class="text-[11px] text-orange-600 font-semibold">CHALLENGED YOU!</p>
      </div>
    </div>

    <div class="flex gap-2">
      <button class="px-3 py-1 text-sm rounded bg-gray-200 font-semibold cursor-pointer hover:bg-gray-400 transition">CANCEL</button>
      <button @click="emits('onPlay',challenge)" class="px-4 py-1 text-sm rounded bg-green-500 text-white font-bold cursor-pointer hover:bg-green-700 transition">PLAY!</button>
    </div>
  </div>
</template>

<script setup>
import { primaryLight, tertiary } from '@/services/colors';
const emits = defineEmits(['onPlay'])
defineProps({
  user: Object,
  challenge:Object
})
</script>
