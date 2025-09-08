<template>
  <div class="w-full max-w-[445px] mx-auto px-2 py-5 relative bg-gray-400">

    <!-- score board -->
    <div class="w-full flex justify-between gap-2 absolute top-0 left-0">
      <div class="w-[35%]">
        <UserCard />
      </div>
      <div class="w-[65%] relative p-2">
        <ScoreRule />
      </div>
    </div>

    <div class="flex items-center gap-3 my-5 mt-[200px]">
      <div>Turn Score: <strong>{{ turnScore }}</strong></div>
      <div>Preview: <strong>{{ previewScore }}</strong></div>
    </div>

    <!-- Scoring area -->
    <div class="relative mb-6 h-[480px] rounded-md">
      <div v-for="(row, rowIndex) in scoringRows" :key="rowIndex" class="relative w-full h-12 mb-3">
        <div class="flex items-center gap-2">
          <div
            v-for="(place, pIndex) in getDicePlaceholder(rowIndex)"
            :key="pIndex"
            ref="placeholders"
            class="dice placeholder"
            :data-row="rowIndex"
            :data-col="pIndex"
          ></div>
        </div>
        <template v-for="(dice, dIndex) in row" :key="dice.id+'_'+dIndex">
          <div
            class="dice scored"
            :style="getScoredDiceStyle(dice)"
          >
            {{ dice.value }}
          </div>
        </template>
      </div>

      <!-- rolling area -->
      <div class="flex w-full py-7 items-center justify-between gap-1 bg-amber-700 px-2" style="height: 120px;">
        <div
          v-for="(dice, i) in rollingDice"
          :key="dice.id"
          class="dice rolling"
          :class="{
            'not-clickable': !isDieClickable(dice),
            'suggested': suggestedIds.has(dice.id)
          }"
          :style="getRollingDiceStyle(dice, i)"
          @click="onDieClick(dice)"
        >
          {{ dice.value }}
        </div>
      </div>

      <!-- farkle overlay -->
      <transition name="fade">
        <div v-if="showFarkle"
          class="absolute inset-0 flex items-center justify-center bg-red-50/80 text-red-700 font-black text-3xl rounded">
          FARKLE!
        </div>
      </transition>
    </div>

    <div class="flex items-center gap-3 mb-4">
      <button class="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50"
        :disabled="!canRoll || (farkle.gameMode === 'robot' && currentPlayer === 1)" @click="rollDice">
        Roll Dice
      </button>
      <button class="px-3 py-1 rounded bg-green-600 text-white" @click="endTurn">End Turn</button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import UserCard from "../cards/UserCard.vue";
import ScoreRule from "../cards/ScoreRule.vue";
import { useRouter } from "vue-router";
import { useFarkleStore } from "@/stores/farkleStore";

const farkle = useFarkleStore();

/* ---------- Constants ---------- */
const DIE_SIZE = 48;
const GAP = 8;
const SLOT = DIE_SIZE + GAP;

/* ---------- Game state ---------- */
const players = farkle.users;
const currentPlayer = ref(0);
const rollingDice = reactive([]);
const scoringRows = reactive([[], [], [], [], [], []]);
const currentScoringRow = ref(5);
const diceIdCounter = ref(1);

const turnScore = ref(0);
const previewScore = ref(0);
const rollCount = ref(0);
const canRoll = ref(true);
const showFarkle = ref(false);
const suggestedIds = reactive(new Set());
const bestSuggestion = ref(null);
const diceRemaining = ref(6);
const hotDicePending = ref(false);

/* ---------- Placeholder positions ---------- */
const placeholders = ref([]);
const placeholderPositions = ref({}); // rowIndex -> colIndex -> {x, y}

onMounted(async () => {
  await nextTick();
  placeholders.value = document.querySelectorAll(".dice.placeholder");
  placeholders.value.forEach(el => {
    const rect = el.getBoundingClientRect();
    const row = el.dataset.row;
    const col = el.dataset.col;
    if (!placeholderPositions.value[row]) placeholderPositions.value[row] = {};
    placeholderPositions.value[row][col] = { x: rect.left, y: rect.top };
  });

  // start auto-roll if desired
  if (farkle.autoRoll && !isRobotTurn()) rollDice();
  else if (isRobotTurn()) setTimeout(() => robotPlayTurn(), 300);
});

/* ---------- Helpers ---------- */
const rand1to6 = () => Math.floor(Math.random() * 6) + 1;

function getDicePlaceholder(num){
  let arr = [];
  for (let i = 0; i <= num+1; i++) arr.push(i);
  return arr;
}

function faceCounts(values) {
  const counts = {}
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  return counts
}

// Full scoring rules
function calculateScore(valuesInput) {
  const values = valuesInput.map(v => typeof v === 'number' ? v : v.value);
  const n = values.length;
  if (n === 0) return 0;
  const counts = faceCounts(values);

  if (n === 6) {
    const isStraight = [1,2,3,4,5,6].every(v => counts[v] === 1);
    const threePairs = Object.values(counts).filter(c=>c===2).length===3;
    const twoTrips = Object.values(counts).filter(c=>c===3).length===2;
    const hasFour = Object.values(counts).includes(4);
    const hasPair = Object.values(counts).includes(2);
    if (twoTrips) return 2500;
    if (isStraight) return 1500;
    if (threePairs) return 1500;
    if (hasFour && hasPair) return 1500;
  }

  if (Object.values(counts).includes(6)) return 3000;
  if (Object.values(counts).includes(5)) return 2000;
  if (Object.values(counts).includes(4)) return 1000;

  let score = 0;
  for (let f=1;f<=6;f++){
    const c = counts[f]||0;
    if (c>=3){
      score += f===1?1000:f*100;
      counts[f]-=3;
    }
  }

  // leftover singles
  score += (counts[1]||0)*100;
  score += (counts[5]||0)*50;

  return score;
}

function getTargetCoordinates(rowIndex, colIndex) {
  const rowEl = document.getElementById(`row-${rowIndex}`);
  const rowRect = rowEl.getBoundingClientRect();
  const placeholder = placeholderPositions.value[rowIndex][colIndex];
  
  return {
    x: placeholder.x - rowRect.left,
    y: placeholder.y - rowRect.top
  };
}


async function flyDiceToSlot(dice, rowIndex, colIndex) {
  const { x, y } = getTargetCoordinates(rowIndex, colIndex);
  dice.targetX = x;
  dice.targetY = y;
  dice.flying = true;

  return new Promise(resolve => {
    setTimeout(() => {
      dice.flying = false;
      dice.landed = true;
      resolve();
    }, 600); // match CSS transition duration
  });
}


/* ---------- Dice flying helpers ---------- */
function getRollingDiceStyle(dice, index) {
  return {
    position: 'absolute',
    transform: dice.flying
      ? `translate(${dice.targetX - dice.startX}px, ${dice.targetY - dice.startY}px)`
      : `translate(${dice.startX ?? index * SLOT}px, ${dice.startY ?? 0}px)`,
    transition: dice.flying ? 'transform 0.6s ease-out' : 'none',
    zIndex: dice.flying ? 100 : 50,
  }
}

function getScoredDiceStyle(dice) {
  return {
    position: 'absolute',
    transform: `translate(${dice.targetX ?? 0}px, ${dice.targetY ?? 0}px)`,
    transition: 'transform 0.6s ease-out',
    zIndex: 30,
  }
}

/* ---------- Core Game Flow ---------- */
function rollDice() {
  if (hotDicePending.value) {
    currentScoringRow.value = 5;
    hotDicePending.value = false;
  } else if (rollCount.value>0){
    currentScoringRow.value = Math.max(0, currentScoringRow.value-1);
  }

  const toRoll = Math.max(1, Math.min(6, diceRemaining.value));
  rollingDice.length = 0;

  for (let i=0;i<toRoll;i++){
    rollingDice.push({
      id: diceIdCounter.value++,
      value: rand1to6(),
      startX: i*SLOT,
      startY: 0,
      targetX: null,
      targetY: null,
      flying: false,
      landed: false
    });
  }

  rollCount.value++;
  canRoll.value = false;

  suggestedIds.clear();
  bestSuggestion.value = computeBestSuggestion(rollingDice.slice());
  if (!hasAnyScoringCombination(rollingDice)){
    showFarkle.value = true;
    setTimeout(()=> {
      showFarkle.value=false;
      turnScore.value=0;
      endTurn();
    },900);
    return;
  } else {
    if (bestSuggestion.value){
      for (const id of bestSuggestion.value.ids) suggestedIds.add(id);
    }
  }
}

/* ---------- Commit dice group to row with flying animation ---------- */
function commitGroup(group){
  if (!group || group.length===0) return Promise.resolve();
  const row = scoringRows[currentScoringRow.value];

  group.forEach((dice, index)=>{
    // find the first empty slot in the row
    const colIndex = row.length;

    const rowEl = placeholders.value[0].closest('.relative'); // the row container
    const rowRect = rowEl.getBoundingClientRect();

    const targetPlaceholder = placeholderPositions.value[currentScoringRow.value][colIndex];
    
    // compute X/Y relative to row container
    dice.targetX = targetPlaceholder.x - rowRect.left;
    dice.targetY = targetPlaceholder.y - rowRect.top;

    dice.flying = true;
    row.push(dice);
  });

  const gained = calculateScore(group.map(d=>d.value));
  turnScore.value += gained;
  diceRemaining.value = Math.max(0,diceRemaining.value-group.length);

  return new Promise(resolve=>{
    setTimeout(()=>{
      group.forEach(dice=>{
        const idx = rollingDice.findIndex(r=>r.id===dice.id);
        if (idx>=0) rollingDice.splice(idx,1);
        dice.flying=false;
        dice.landed=true;
      });
      resolve();
    },600);
  });
}


/* ---------- Handle die click ---------- */
async function onDieClick(die){
  if (!isDieClickable(die)) return;
  // commit single 1 or 5
  await commitGroup([die]);
}

/* ---------- Check clickable ---------- */
function isDieClickable(die){
  return die.value===1||die.value===5;
}

/* ---------- Suggestion logic (simplified for now) ---------- */
function hasAnyScoringCombination(diceList){
  return diceList.some(d=>d.value===1||d.value===5);
}

function computeBestSuggestion(diceList){
  const best = diceList.filter(d=>d.value===1||d.value===5);
  if (best.length===0) return null;
  return { ids: new Set(best.map(d=>d.id)), values: best.map(d=>d.value), score: calculateScore(best.map(d=>d.value))};
}

/* ---------- End Turn ---------- */
function endTurn(){
  farkle.setScore(currentPlayer.value, turnScore.value);
  turnScore.value=0;
  previewScore.value=0;
  rollCount.value=0;
  rollingDice.length=0;
  for (let i=0;i<scoringRows.length;i++) scoringRows[i]=[];
  currentScoringRow.value=5;
  diceRemaining.value=6;
  suggestedIds.clear();
  bestSuggestion.value=null;
  canRoll.value=true;
  hotDicePending.value=false;
  showFarkle.value=false;
  currentPlayer.value = (currentPlayer.value + 1)%players.length;
}

/* ---------- Robot helper ---------- */
function isRobotTurn(){
  return farkle.gameMode.value==='robot' && currentPlayer.value===1;
}
</script>

<style scoped>
.dice {
  width: 48px;
  height: 48px;
  display:flex;
  align-items:center;
  justify-content:center;
  border:2px solid #1f2937;
  border-radius:8px;
  font-weight:700;
  font-size:18px;
  user-select:none;
  box-shadow:0 6px 12px rgba(0,0,0,0.08);
  position:absolute;
}

.dice.rolling { background:#fef3c7; cursor:pointer; }
.dice.rolling.not-clickable { opacity:0.45; cursor:not-allowed; }
.dice.rolling.suggested { box-shadow:0 0 0 4px rgba(59,130,246,0.12),0 8px 20px rgba(59,130,246,0.18); }

.dice.scored { background:#e0f2fe; transition: transform 0.6s ease-out; z-index:30; }

.dice.placeholder { border:2px dashed #ccc; background:transparent; position:relative; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity:0; }
</style>
