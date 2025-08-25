<script setup>
import { computed, onMounted, ref } from 'vue'
import DiceRoller from './DiceRoller.vue'
import ScoreBoard from './ScoreBoard.vue'
import { useGameStore } from '@/stores/gameStore'
import router from '@/router';

const game = useGameStore();

const currentPlayer = ref(0)
const dice = ref([1, 2, 3, 4, 5, 6])
const selectedDice = ref([])
const roundPoints = ref(0)
const icon = ref(false);
const roleCount = ref(0);

function rollDice() {
  roleCount.value += 1;
  if (roleCount.value >= 4) {
    bankPoints();
  }
  console.log(roleCount.value)
  icon.value = true;
  setTimeout(() => {
    if (icon) {
      setTimeout(() => icon.value = false, 500);
    }
  }, 1000);
  dice.value = dice.value.map(() => Math.floor(Math.random() * 6) + 1)
}

function toggleSelect(index) {
  if (selectedDice.value.includes(index)) {
    selectedDice.value = selectedDice.value.filter(i => i !== index)
  } else {
    selectedDice.value.push(index)
  }
}

function scoreDice(diceArr) {
  let score = 0
  const counts = {}
  diceArr.forEach(d => counts[d] = (counts[d] || 0) + 1)

  const values = Object.values(counts)

  // Special rules
  if (diceArr.length === 6) {
    // Straight (1-6)
    if ([1, 2, 3, 4, 5, 6].every(v => counts[v] === 1)) {
      return 1500
    }
    // Three pairs
    if (values.filter(v => v === 2).length === 3) {
      return 1500
    }
    // Two triplets
    if (values.filter(v => v === 3).length === 2) {
      return 2500
    }
  }

  // Standard rules
  Object.entries(counts).forEach(([die, count]) => {
    die = parseInt(die)
    if (die === 1) {
      score += count >= 3 ? 1000 * Math.pow(2, count - 3) : count * 100
    } else if (die === 5) {
      score += count >= 3 ? 500 * Math.pow(2, count - 3) : count * 50
    } else if (count >= 3) {
      score += die * 100 * Math.pow(2, count - 3)
    }
  })

  return score
}

function keepSelection() {
  const keptDice = selectedDice.value.map(i => dice.value[i])
  const score = scoreDice(keptDice)
  roundPoints.value += score
  selectedDice.value = []
  bankPoints();
  roleCount.value = 0;
  rollDice()
}

function bankPoints() {
  game.setUserScore(currentPlayer.value, roundPoints.value)
  roundPoints.value = 0
  currentPlayer.value = (currentPlayer.value + 1) % game.users.length
  roleCount.value = 0;
  !game.winState ? rollDice() : null;
}

function resetGame() {
  game.restartGame();
}

onMounted(() => {
  console.log(game.playable)
  if (game.playable) {
    rollDice();
    return;
  }
  router.push({ name: 'home' })
})

</script>

<template>
  <div class="bg-white p-6 rounded-2xl shadow-lg w-[600px]">
    <h1 class="text-3xl font-bold text-center">🎲 Farkle</h1>
    <h6 class="text-sm text-center">A random roll base dice game</h6>
    <h6 class="text-xl text-center mb-5">Win Score, {{ game.winScore }}</h6>

    <ScoreBoard :players="game.users" :current-player="currentPlayer" />

    <div class="mt-4 flex gap-4 justify-center flex-wrap md:flex-no-wrap">
      <button class="px-4 py-2 bg-blue-500 text-white rounded-xl order-2 md:order-1" @click="keepSelection">Keep</button>
      <DiceRoller :hide="game.winState" :dice="dice" :selected-dice="selectedDice" @roll="rollDice" @restart="resetGame"
        :icon="icon" @toggle-select="toggleSelect" />
    </div>
    <h1 class="text-green-600 text-base md:text-xl font-bold text-center mt-2 border-1 border-green-800 rounded-md p-3"
      v-if="game.winMessage">{{ game.winMessage }}</h1>

  </div>
</template>
