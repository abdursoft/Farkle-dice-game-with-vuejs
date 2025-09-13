<template>
  <div class="p-6">
    <!-- Dice Row -->
    <div class="flex gap-4 mb-6">
      <div
        v-for="(die, index) in dice"
        :key="die.id"
        @click="selectDie(index)"
        :class="[
          'w-16 h-16 flex items-center justify-center text-2xl font-bold cursor-pointer rounded-lg transition-transform duration-300',
          die.selected ? 'bg-green-400 scale-110' : 'bg-gray-200'
        ]"
      >
        {{ die.value }}
      </div>
    </div>

    <!-- Roll Button -->
    <button
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
      @click="rollDice"
      :disabled="rollsLeft === 0 || dice.length === 0"
    >
      Roll Dice ({{ rollsLeft }} left)
    </button>

    <!-- End Turn Button -->
    <button
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      @click="endTurn"
      :disabled="scoredDice.length === 0"
    >
      End Turn
    </button>

    <!-- Current Score -->
    <div class="mt-4 font-bold">Current Score: {{ currentScore }}</div>
    <div class="font-bold">Total Score: {{ totalScore }}</div>

    <!-- Scored Dice -->
    <div class="mt-6">
      <h3 class="font-bold mb-2">Scored Dice:</h3>
      <transition-group name="fade" tag="div" class="flex gap-4">
        <div
          v-for="(die) in scoredDice"
          :key="die.id"
          class="w-16 h-16 flex items-center justify-center text-2xl font-bold bg-yellow-300 rounded-lg transition-transform duration-500"
        >
          {{ die.value }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Helper to generate unique id for dice
let idCounter = 0
function createDie() {
  return { id: idCounter++, value: Math.floor(Math.random() * 6) + 1, selected: false }
}

// Game state
const dice = ref(Array.from({ length: 6 }, () => createDie()))
const scoredDice = ref([])
const rollsLeft = ref(3)
const currentScore = ref(0)
const totalScore = ref(0)

// Roll dice
function rollDice() {
  dice.value = dice.value.map(d => (d.selected ? d : createDie()))
  rollsLeft.value--
}

// Select a die
function selectDie(index) {
  const die = dice.value[index]
  die.selected = true
  scoredDice.value.push(die)
  dice.value.splice(index, 1)
  calculateScore()
}

// Calculate score (simple version)
function calculateScore() {
  let score = 0
  const counts = {}
  scoredDice.value.forEach(d => {
    counts[d.value] = (counts[d.value] || 0) + 1
  })

  for (const val in counts) {
    const count = counts[val]
    const num = Number(val)
    if (count >= 3) {
      score += num === 1 ? 1000 : num * 100
      const remaining = count - 3
      if (num === 1) score += remaining * 100
      if (num === 5) score += remaining * 50
    } else {
      if (num === 1) score += count * 100
      if (num === 5) score += count * 50
    }
  }

  currentScore.value = score
}

// End Turn
function endTurn() {
  totalScore.value += currentScore.value
  currentScore.value = 0
  dice.value = Array.from({ length: 6 }, () => createDie())
  scoredDice.value = []
  rollsLeft.value = 3
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
