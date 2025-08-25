<script setup>
defineProps({
  players: Array,
  currentPlayer: Number
})
</script>

<template>
  <div class="flex justify-between mb-6 w-full">
    <div
      v-for="(player, i) in players"
      :key="i"
      class="p-4 rounded-xl border md:w-1/2 w-[160px] text-center"
      :class="i === currentPlayer ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-300'"
    >
      <h2 class="text-xl font-bold line-clamp-1">{{ player.name }}</h2>
      <p class="text-2xl">{{ player.score }}</p>
    </div>
  </div>
</template>