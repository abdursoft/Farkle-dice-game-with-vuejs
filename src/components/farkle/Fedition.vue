<template>
  <div class="w-full p-4 relative">
    <!-- Header -->
    <div class="text-xl font-bold mb-4">
      Current Player: {{ currentPlayer.name }} | Turn Score: {{ previewScore }} | Total Score: {{ currentPlayer.score }}
    </div>

    <!-- Scoring Rows -->
    <div class="flex flex-col gap-2 mb-6 relative" style="min-height: 300px;">
      <div
        v-for="(row, rowIndex) in scoringRows"
        :key="rowIndex"
        class="h-12 border border-gray-300 rounded flex items-center px-2 bg-gray-50 relative"
      >
        <div
          v-for="dice in row"
          :key="dice.id"
          class="w-12 h-12 flex items-center justify-center border border-gray-400 rounded bg-white absolute"
          :style="getScoredDiceStyle(dice)"
        >
          {{ dice.value }}
        </div>
      </div>
    </div>

    <!-- Rolling Dice Row -->
    <div class="h-24 flex items-center justify-start gap-2 border border-gray-400 rounded p-2 bg-gray-100 relative">
      <div
        v-for="dice in rollingDice"
        :key="dice.id"
        class="w-12 h-12 flex items-center justify-center border border-gray-500 rounded cursor-pointer"
        :class="{
          'bg-green-300': dice.selected,
          'bg-yellow-200': !dice.selected && isSelectable(dice)
        }"
        :style="getRollingDiceStyle(dice)"
        @click="toggleDiceSelection(dice)"
      >
        {{ dice.value }}
      </div>
    </div>

    <!-- Controls -->
    <div class="mt-6 flex gap-4">
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" @click="rollDice" :disabled="!canRoll">
        Roll Dice
      </button>
      <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" @click="endTurn">
        End Turn
      </button>
      <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" @click="resetGame">
        Reset Game
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";

let diceId = 0;

const players = reactive([
  { name: "Player 1", score: 0 },
  { name: "Player 2", score: 0 },
]);
const currentPlayerIndex = ref(0);
const turnScore = ref(0);
const previewScore = ref(0);

const scoringRows = reactive([[], [], [], [], [], []]);
const rollingDice = reactive([]);
const diceCount = ref(6);
const canRoll = ref(true);

const currentPlayer = computed(() => players[currentPlayerIndex.value]);

function randomDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice() {
  if (!canRoll.value) return;

  const diceToRoll = diceCount.value - scoringRows.flat().length;
  rollingDice.length = 0;
  for (let i = 0; i < diceToRoll; i++) {
    rollingDice.push({
      id: diceId++,
      value: randomDice(),
      selected: false,
      x: i * (48 + 8),
      y: 0,
      targetX: 0,
      targetY: 0,
    });
  }

  // Check Farkle
  if (!rollingDice.some(d => isScoring(d.value))) {
    alert("Farkle! Turn lost.");
    turnScore.value = 0;
    endTurn();
  }

  updatePreviewScore();
}

function isScoring(value) {
  return value === 1 || value === 5;
}

function getScoringCombinations(diceArray) {
  const counts = {};
  diceArray.forEach(d => (counts[d.value] = (counts[d.value] || []).concat(d)));
  const combinations = [];

  // Triplets or more
  Object.values(counts).forEach(group => {
    if (group.length >= 3) combinations.push(group);
  });

  // Single 1s or 5s
  diceArray.forEach(d => {
    if ((d.value === 1 || d.value === 5) && !d.selected) {
      combinations.push([d]);
    }
  });

  return combinations;
}

function isSelectable(dice) {
  const combos = getScoringCombinations(rollingDice);
  return combos.some(group => group.includes(dice));
}

function toggleDiceSelection(dice) {
  if (!isSelectable(dice)) return;

  const combos = getScoringCombinations(rollingDice);
  const group = combos.find(g => g.includes(dice));
  const allSelected = group.every(d => d.selected);

  group.forEach(d => d.selected = !allSelected);

  updatePreviewScore();

  // Assign target positions for each dice in group
  group.forEach(dice => {
    if (dice.selected) {
      for (let rowIndex = 0; rowIndex < scoringRows.length; rowIndex++) {
        const row = scoringRows[rowIndex];
        if (row.length < 6) {
          dice.targetX = row.length * (48 + 8);
          dice.targetY = rowIndex * (48 + 8);
          row.push(dice);
          break;
        }
      }
    }
  });

  // Remove selected dice from rollingDice after animation
  setTimeout(() => {
    for (let d of group) {
      const idx = rollingDice.findIndex(r => r.id === d.id);
      if (idx >= 0) rollingDice.splice(idx, 1);
    }
    turnScore.value += previewScore.value;
    previewScore.value = 0;
    if (!rollingDice.length) diceCount.value = 6; // Hot dice
  }, 500);
}

function calculateScore(diceValues) {
  const counts = {};
  diceValues.forEach(v => (counts[v] = (counts[v] || 0) + 1));
  let score = 0;

  if ([1,2,3,4,5,6].every(v => counts[v] === 1)) return 1500;
  if (Object.values(counts).filter(c => c === 2).length === 3) return 1500;

  Object.entries(counts).forEach(([num, count]) => {
    num = parseInt(num);
    if (count >= 3) {
      let base = num === 1 ? 1000 : num * 100;
      score += base * Math.pow(2, count - 3);
      count -= count;
    }
    if (num === 1) score += (count % 3) * 100;
    if (num === 5) score += (count % 3) * 50;
  });

  return score;
}

function updatePreviewScore() {
  const selectedValues = rollingDice.filter(d => d.selected).map(d => d.value);
  previewScore.value = calculateScore(selectedValues);
}

function endTurn() {
  setTimeout(() => {
    currentPlayer.value.score += turnScore.value;
    turnScore.value = 0;
    previewScore.value = 0;
    currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.length;
    resetTurnDice();
  }, 500);
}

function resetTurnDice() {
  rollingDice.length = 0;
  scoringRows.forEach((row, i) => scoringRows[i] = []);
  diceCount.value = 6;
  canRoll.value = true;
  rollDice();
}

function resetGame() {
  players.forEach(p => p.score = 0);
  currentPlayerIndex.value = 0;
  turnScore.value = 0;
  previewScore.value = 0;
  resetTurnDice();
}

function getRollingDiceStyle(dice) {
  const yOffset = dice.selected ? dice.targetY : dice.y;
  const xOffset = dice.selected ? dice.targetX : dice.x;
  return {
    transform: `translate(${xOffset}px, ${yOffset}px)`,
    transition: 'transform 0.5s cubic-bezier(.42,0,.58,1)',
    position: 'absolute'
  };
}

function getScoredDiceStyle(dice) {
  return {
    transform: `translate(${dice.targetX}px, ${dice.targetY}px)`,
    transition: 'transform 0.5s cubic-bezier(.42,0,.58,1)',
    position: 'absolute'
  };
}

onMounted(() => {
  resetGame();
});
</script>

<style scoped>
.w-12 { width: 48px; height: 48px; }
.w-12:hover { transform: scale(1.2); transition: transform 0.2s; }
.bg-green-300 { background-color: #86efac !important; }
.bg-yellow-200 { background-color: #fef08a !important; }
</style>
