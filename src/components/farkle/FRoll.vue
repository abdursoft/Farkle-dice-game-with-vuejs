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

    <!-- Buttons -->
    <div class="mb-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
        @click="rollDice"
        :disabled="rollsLeft === 0 || dice.length === 0"
      >
        Roll Dice ({{ rollsLeft }} left)
      </button>

      <button
        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        @click="endTurn"
        :disabled="scoredDice.length === 0"
      >
        End Turn
      </button>
    </div>

    <!-- Score Display -->
    <div class="mb-2 font-bold text-lg">
      Current Score: {{ currentScore }} | Total Score: {{ totalScore }}
    </div>

    <div v-if="farkle" class="text-red-600 font-bold mb-2">FARKLE! No scoring dice.</div>

    <!-- Scored Dice -->
    <div class="mt-6">
      <h3 class="font-bold mb-2">Scored Dice:</h3>
      <transition-group name="fade" tag="div" class="flex gap-4">
        <div
          v-for="(die, index) in scoredDice"
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

// Unique die generator
let idCounter = 0
function createDie() {
  return { id: idCounter++, value: Math.floor(Math.random() * 6) + 1, selected: false }
}

// Game State
const dice = ref(Array.from({ length: 6 }, () => createDie()))
const scoredDice = ref([])
const rollsLeft = ref(3)
const currentScore = ref(0)
const totalScore = ref(0)
const farkle = ref(false)

// Roll dice
function rollDice() {
  farkle.value = false
  dice.value = dice.value.map(d => (d.selected ? d : createDie()))
  rollsLeft.value--

  // Check if no scoring dice
  if (!dice.value.some(isScoringDie)) {
    farkle.value = true
    endTurn(true) // reset turn immediately
  }
}

// Check if die is scoring (1 or 5)
function isScoringDie(die) {
  return die.value === 1 || die.value === 5
}

// Select die and calculate score
function selectDie(index) {
  const die = dice.value[index]
  die.selected = true
  scoredDice.value.push(die)
  dice.value.splice(index, 1)
  calculateScore()
}

// Calculate full Farkle score
function calculateScore() {
  let score = 0
  const counts = {}

  scoredDice.value.forEach(d => {
    counts[d.value] = (counts[d.value] || 0) + 1
  })

  // Check three-of-a-kinds and singles
  for (const val in counts) {
    const num = Number(val)
    const count = counts[val]

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
function endTurn(reset = false) {
  if (!reset) totalScore.value += currentScore.value

  currentScore.value = 0
  rollsLeft.value = 3
  dice.value = Array.from({ length: 6 }, () => createDie())
  scoredDice.value = []
  farkle.value = false
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
