<template>
  <div class="p-6">
    <!-- Dice Row -->
    <div class="flex gap-4 mb-6">
      <div
        v-for="(die, index) in dice"
        :key="index"
        @click="toggleSelect(index)"
        :class="[
          'w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer rounded-lg',
          die.selected ? 'bg-green-400' : 'bg-gray-200'
        ]"
      >
        {{ die.value }}
      </div>
    </div>

    <!-- Roll Button -->
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      @click="rollDice"
      :disabled="rollsLeft === 0"
    >
      Roll Dice ({{ rollsLeft }} left)
    </button>

    <!-- Scored Dice -->
    <div class="mt-6">
      <h3 class="font-bold mb-2">Scored Dice:</h3>
      <div class="flex gap-4">
        <div
          v-for="(die, index) in scoredDice"
          :key="index"
          class="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-yellow-300 rounded-lg"
        >
          {{ die.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Game state
const dice = ref(Array.from({ length: 6 }, () => ({ value: randomDie(), selected: false })))
const scoredDice = ref([])
const rollsLeft = ref(3)

// Generate random die (1-6)
function randomDie() {
  return Math.floor(Math.random() * 6) + 1
}

// Roll unselected dice
function rollDice() {
  dice.value = dice.value.map(d => (d.selected ? d : { ...d, value: randomDie() }))
  rollsLeft.value--
}

// Toggle dice selection
function toggleSelect(index) {
  const die = dice.value[index]
  die.selected = !die.selected
  if (die.selected) {
    scoredDice.value.push(die)
    dice.value.splice(index, 1)
  }
}
</script>
