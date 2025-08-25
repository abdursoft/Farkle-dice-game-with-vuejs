<script setup>
import icon from '../assets/dice-game.gif'

const props = defineProps({
  dice: Array,
  selectedDice: Array,
  icon:false,
  hide:false
})
</script>

<template>
  <div class="flex gap-2 justify-center w-full md:w-auto order-1 md:order-2">
    <div
      v-for="(die, i) in dice"
      :key="i"
      class="w-12 h-12 flex items-center justify-center border rounded-xl cursor-pointer"
      :class="selectedDice.includes(i) ? 'bg-yellow-200 border-yellow-500' : 'bg-white border-gray-400'"
      @click="$emit('toggle-select', i)"
    >
      <img :src="icon" v-if="props.icon" alt="">
      <span class="text-xl font-bold" v-else>{{ die }}</span>
    </div>
  </div>
  <div class="flex justify-center order-3 md:order-3">
    <button v-if="!props.hide" class="px-4 py-2 bg-purple-500 text-white rounded-xl" @click="$emit('roll')">Roll 🎲</button>
    <button v-if="props.hide" class="px-4 py-2 bg-green-500 text-white rounded-xl" @click="$emit('restart')">Restart</button>
  </div>
</template>