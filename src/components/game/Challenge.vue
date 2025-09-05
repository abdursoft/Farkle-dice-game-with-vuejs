<template>
  <div class="flex items-center justify-between bg-white p-3 rounded-lg shadow">
    <div class="flex items-center gap-1">
      <img :src="user.avatar" alt="avatar" class="w-12 h-12 rounded-full border" />
      <div>
        <p class="font-semibold text-gray-800 line-clamp-1">{{ user.name }}</p>
        <p v-if="user.status === 'yourTurn'" class="text-[12px] font-semibold text-gray-500">
          Play your first turn!
        </p>
        <p v-else class="text-[11px] text-orange-600 font-semibold">CHALLENGED YOU!</p>
      </div>
    </div>

    <div class="flex gap-2">
      <button class="px-3 py-1 text-sm rounded bg-gray-200 font-semibold cursor-pointer hover:bg-gray-400 transition">CANCEL</button>
      <button class="px-4 py-1 text-sm rounded bg-green-500 text-white font-bold cursor-pointer hover:bg-green-700 transition">PLAY!</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object
})
</script>
