<template>
  <div class="w-full max-w-[445px] mx-auto py-5 relative bg-gray-400 max-h-screen overflow-hidden">

    <!-- score board  -->
    <div class="w-full flex justify-between gap-2">
      <div class="w-[35%]">
        <UserCard />
      </div>
      <div class="w-[65%] relative p-2">
        <ScoreRule />
      </div>
    </div>

    <div class="flex items-center gap-3 my-5 px-2">
      <div>Turn Score: <strong>{{ turnScore }}</strong></div>
      <div>Preview: <strong>{{ previewScore }}</strong></div>
    </div>

    <!-- Scoring area -->
    <div class="relative mb-6 rounded-md">
      <!-- rows (top -> 0, bottom -> 5). We position rows vertically by index -->
      <div v-for="(row, rowIndex) in scoringRows" :key="rowIndex" class="relative w-full h-12 mb-3 px-2">
        <!-- only render dice that have landed -->
        <template v-if="row.length == 0">
          <div class="flex items-center gap-2">
            <template v-for="(place, pIndex) in getDicePlaceholder(rowIndex)" :key="pIndex">
            <div class="dice scored">
              
            </div>
          </template>
          </div>
        </template>
        <template v-else>
          <template v-for="(dice, dIndex) in row" :key="dice.id+'_'+dIndex">
            <div v-if="dice.landed" class="dice scored" data-aos="fade-up" :style="getScoredDiceStyle(dice)">
              {{ dice.value }}
            </div>
          </template>
        </template>
      </div>


      <!-- rolling area sits above bottom-left of container (we place rolls at absolute coords) -->
      <div class="flex w-full items-center gap-2 bg-amber-700 px-2 min-h-[55px]">
        <div v-for="(dice, i) in rollingDice" :key="dice.id" class="dice rolling" :class="{
          'not-clickable': !isDieClickable(dice),
          'suggested': suggestedIds.has(dice.id)
        }" :style="getRollingDiceStyle(dice, i)" @click="onDieClick(dice)">
          <img :src="icon" v-if="iconLoading" alt="">
          <p v-else>{{ dice.value }}</p>
        </div>
      </div>

      <!-- farkle overlay -->
      <transition name="fade">
        <div v-if="showFarkle"
          class="absolute inset-0 z-99 flex items-center justify-center bg-red-50/80 text-red-700 font-black text-3xl rounded">
          FARKLE!
        </div>
      </transition>
    </div>
    <div class="flex items-center justify-center gap-5 mb-4 fade-up px-3">
      <button class="px-5 w-full py-3 rounded bg-orange-600 rounded-[18px] text-white cursor-pointer" @click="endTurn">Collect</button>
      <button class="px-5 cursor-pointer w-full py-3 rounded-[18px] bg-blue-600 text-white disabled:cursor-none disabled:opacity-50"
        :disabled="!canRoll || (farkle.gameMode === 'robot' && currentPlayer === 1)" @click="rollDice">
        Roll Dice
      </button>
    </div>
  </div>
</template>

<script setup>

import { useFarkleStore } from "@/stores/farkleStore";
import { ref, reactive, computed, onMounted } from "vue";
import UserCard from "../cards/UserCard.vue";
import ScoreRule from "../cards/ScoreRule.vue";
import { useRouter } from "vue-router";

import icon from '../../assets/dice-game.gif'

const farkle = useFarkleStore();

/* ---------- Constants ---------- */
const DIE_SIZE = 40;
const GAP = 8;
const SLOT = DIE_SIZE + GAP; // 48

/* ---------- Game state ---------- */
const players = farkle.users;

const currentPlayer = ref(0); // index into players (0 or 1)

const rollingDice = reactive([]); // dice currently rolled
const scoringRows = reactive([[], [], [], [], [], []]); // index 0 = top, 5 = bottom
const currentScoringRow = ref(5); // start filling at bottom
const diceIdCounter = ref(1);

const iconLoading = ref(true);

const turnScore = ref(0);
const previewScore = ref(0);
const rollCount = ref(0);
const canRoll = ref(true);
const showFarkle = ref(false);

/* Suggested dice & best suggestion */
const suggestedIds = reactive(new Set());
const bestSuggestion = ref(null);

/* diceRemaining: how many dice remain to roll in this turn (starts at 6) */
const diceRemaining = ref(6);
const hotDicePending = ref(false);

/* ----- Helper utilities ----- */
const rand1to6 = () => Math.floor(Math.random() * 6) + 1;

function getDicePlaceholder(num){
  let numArray = [];
  for (let i = 0; i <= num; i++) {
    numArray.push(i);
  }
  return numArray;
}

function getRollPlaceholder(num){
  let numArray = [];
  for (let i = 0; i <= num; i++) {
    numArray.push(i);
  }
  return numArray;
}

/* Full Farkle scoring for a chosen subset */
function faceCounts(values) {
  const counts = {}
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1
  }
  return counts
}

function calculateScore(valuesInput) {
  // valuesInput can be array of dice objects or numbers
  const values = valuesInput.map
    ? valuesInput.map(v => (typeof v === 'number' ? v : v.value))
    : []
  const n = values.length
  if (n === 0) return 0
  const counts = faceCounts(values)

  // specials that require all 6 dice
  if (n === 6) {
    const isStraight = [1, 2, 3, 4, 5, 6].every(v => counts[v] === 1)
    const threePairs = Object.values(counts).filter(c => c === 2).length === 3
    const twoTrips = Object.values(counts).filter(c => c === 3).length === 2
    const hasFour = Object.values(counts).includes(4)
    const hasPair = Object.values(counts).includes(2)

    if (twoTrips) return 2500
    if (isStraight) return 1500
    if (threePairs) return 1500
    if (hasFour && hasPair) return 1500
  }

  // fixed scores for big multiples
  if (Object.values(counts).includes(6)) return 3000
  if (Object.values(counts).includes(5)) return 2000
  if (Object.values(counts).includes(4)) return 1000

  let score = 0

  // triples
  for (let f = 1; f <= 6; f++) {
    const c = counts[f] || 0
    if (c >= 3) {
      if (f === 1) score += 1000
      else score += f * 100
      counts[f] -= 3 // consume
    }
  }

  // leftover singles (1s and 5s only)
  score += (counts[1] || 0) * 100
  score += (counts[5] || 0) * 50

  return score
}


/* Check if a subset is fully-scoring (you shouldn't leave non-scoring dice inside subset) */
function isFullyScoring(valuesInput) {
  const values = valuesInput.map ? valuesInput.map(v => (typeof v === 'number' ? v : v.value)) : [];
  const n = values.length;
  if (n === 0) return false;
  const counts = faceCounts(values);

  if (n === 6) {
    const isStraight = [1, 2, 3, 4, 5, 6].every(v => counts[v] === 1);
    const threePairs = Object.values(counts).filter(c => c === 2).length === 3;
    const twoTrips = Object.values(counts).filter(c => c === 3).length === 2;
    if (isStraight || threePairs || twoTrips) return true;
  }

  // remove any 3+ sets
  for (let f = 1; f <= 6; f++) {
    if (counts[f] >= 3) counts[f] = 0;
  }

  // remaining values must be 1s or 5s only
  for (let f = 1; f <= 6; f++) {
    if (counts[f] > 0 && f !== 1 && f !== 5) return false;
  }
  return true;
}

/* any scoring combination available in diceList? */
function hasAnyScoringCombination(diceList) {
  if (!diceList || diceList.length === 0) return false;
  const values = diceList.map(d => d.value);
  const counts = faceCounts(values);

  if (values.includes(1) || values.includes(5)) return true;
  if (Object.values(counts).some(c => c >= 3)) return true;

  if (diceList.length === 6) {
    const isStraight = [1, 2, 3, 4, 5, 6].every(v => counts[v] === 1);
    const threePairs = Object.values(counts).filter(c => c === 2).length === 3;
    const twoTrips = Object.values(counts).filter(c => c === 3).length === 2;
    if (isStraight || threePairs || twoTrips) return true;
  }
  return false;
}

/* compute best fully-scoring subset by brute force (max score, tie-break fewer dice) */
function computeBestSuggestion(diceList) {
  const n = diceList.length;
  if (n === 0) return null;
  let best = null;
  const arr = diceList.slice();
  // iterate all non-empty subsets up to 2^n - 1 (n <= 6 -> 63)
  for (let mask = 1; mask < (1 << n); mask++) {
    const chosen = [];
    const chosenValues = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        chosen.push(arr[i]);
        chosenValues.push(arr[i].value);
      }
    }
    if (!isFullyScoring(chosenValues)) continue;
    const sc = calculateScore(chosenValues);
    if (sc <= 0) continue;
    if (!best || sc > best.score || (sc === best.score && chosen.length < best.values.length)) {
      best = {
        ids: new Set(chosen.map(d => d.id)),
        score: sc,
        values: chosenValues.slice(),
      };
    }
  }
  return best;
}

/* detect 6-dice special combination in current roll: two trips / straight / three pairs */
function detectSixDiceSpecial(diceList) {
  if (diceList.length !== 6) return null;
  const counts = faceCounts(diceList.map(d => d.value));
  const twoTrips = Object.values(counts).filter(c => c === 3).length === 2;
  const isStraight = [1, 2, 3, 4, 5, 6].every(v => counts[v] === 1);
  const threePairs = Object.values(counts).filter(c => c === 2).length === 3;
  if (twoTrips || isStraight || threePairs) {
    return new Set(diceList.map(d => d.id));
  }
  return null;
}

/* ---------- UI Helper: get transform styles ---------- */
function getRollingDiceStyle(dice, index) {
  // rolling dice are positioned relative to bottom-left area; if they have targetX/targetY defined (committing),
  // the rolling element will animate toward the target to show the flight.
  const x = (dice.targetX != null && dice.flying) ? dice.targetX : (dice.x != null ? dice.x : index * SLOT);
  const y = (dice.targetY != null && dice.flying) ? dice.targetY : (dice.y != null ? dice.y : 0);
}

function getScoredDiceStyle(dice) {
  const x = dice.targetX ?? 0;
  const y = dice.targetY ?? 0;
  return {
    transform: `translateY(${y}px)`,
    transform: `translateX(${x}px)`,
    transition: 'transform 0.6s ease-out',
    position: 'absolute',
  };
}

/* ---------- Game flow functions ---------- */

/* rollDice: creates a new roll of 'toRoll' dice. Manages currentScoringRow decrement between rolls. */
function rollDice() {
  // Adjust row on new roll: if hotDicePending, reset row to bottom; else if it's not the first roll decrement row
  if (hotDicePending.value) {
    currentScoringRow.value = 5;
    hotDicePending.value = false;
  } else if (rollCount.value > 0) {
    currentScoringRow.value = Math.max(0, currentScoringRow.value - 1);
  }


  iconLoading.value = true;

  // how many dice to roll this time?
  const toRoll = Math.max(1, Math.min(6, diceRemaining.value));
  rollingDice.length = 0;
  for (let i = 0; i < toRoll; i++) {
    rollingDice.push({
      id: diceIdCounter.value++,
      value: rand1to6(),
      x: i * SLOT,
      y: 0,
      targetX: null,
      targetY: null,
      flying: false,
      landed: false,
    });
  }

  rollCount.value++;
  canRoll.value = false;

  const endLoader = setTimeout(() => {
    iconLoading.value = false;
    clearInterval(endLoader);
  },400);

  // compute suggestion and check farkle
  suggestedIds.clear();
  bestSuggestion.value = computeBestSuggestion(rollingDice.slice());
  if (!hasAnyScoringCombination(rollingDice)) {
    // FARKLE: immediate loss of turn points
    showFarkle.value = true;
    setTimeout(() => {
      showFarkle.value = false;
      turnScore.value = 0;
      // end turn after brief delay
      endTurn();
    }, 900);
    return;
  } else {
    if (bestSuggestion.value) {
      for (const id of bestSuggestion.value.ids) suggestedIds.add(id);
    }
  }
}


/* Commit a group of dice (array of dice objects) to the current scoring row.
   Returns a Promise that resolves after animation and removal is complete. */
function commitGroup(group) {
  if (!group || group.length === 0) return Promise.resolve();

  // place their targetX/targetY and mark them flying; push to scoringRows[currentScoringRow]
  const row = scoringRows[currentScoringRow.value];
  group.forEach((dice, index) => {
    dice.targetX = row.length * SLOT;
    dice.targetY = 0 * 56;
    dice.flying = true;
    dice.landed = false;
    row.push(dice);
  });

  // add score right away to turnScore (preview/commit semantics assumed)
  const gained = calculateScore(group.map(d => d.value));
  turnScore.value += gained;

  // update diceRemaining
  diceRemaining.value = Math.max(0, diceRemaining.value - group.length);

  // after flight duration, remove from rollingDice and set landed = true
  return new Promise((resolve) => {
    setTimeout(() => {
      for (const d of group) {
        const idx = rollingDice.findIndex(r => r.id === d.id);
        if (idx >= 0) rollingDice.splice(idx, 1);
        d.flying = false;
        d.landed = true; // now show in scoringRows
      }

      // recalc suggestion for remaining dice
      suggestedIds.clear();
      bestSuggestion.value = computeBestSuggestion(rollingDice.slice());
      if (bestSuggestion.value) {
        for (const id of bestSuggestion.value.ids) suggestedIds.add(id);
      }

      // If no dice remain -> hot dice (reset next roll to 6)
      if (rollingDice.length === 0) {
        hotDicePending.value = true;
        diceRemaining.value = 6; // reset for next roll
        canRoll.value = true;
        // auto-roll if enabled (but robot uses its own flow)
        if (farkle.autoRoll && !isRobotTurn()) {
          setTimeout(() => rollDice(), 350);
        }
      } else {
        // allow player to roll remaining dice
        canRoll.value = true;
      }

      resolve();
    }, 650); // match CSS transition (600ms) + small buffer
  });
}

/* Check if it's robot's turn */
function isRobotTurn() {
  return farkle.gameMode.value === 'robot' && currentPlayer.value === 1;
}

/* When the user clicks a die (or robot does), commit appropriate group:
   - If 6-dice special exists -> commit all six
   - If 3+ of a kind for that face exists -> commit all those
   - Otherwise single 1 or 5
*/
async function onDieClick(die) {
  if (!isDieClickable(die)) return;
  // detect 6-dice special
  const special = detectSixDiceSpecial(rollingDice);
  if (special && special.has(die.id)) {
    const group = rollingDice.slice(); // all six
    await commitGroup(group);
    return;
  }

  // check same-face multiples
  const same = rollingDice.filter(d => d.value === die.value);
  if (same.length >= 3) {
    await commitGroup(same);
    return;
  }

  // single 1 or 5
  if (die.value === 1 || die.value === 5) {
    await commitGroup([die]);
    return;
  }
}

/* is die clickable? */
function isDieClickable(die) {
  // If there is a special 6-dice combo, only those dice are clickable
  const special = detectSixDiceSpecial(rollingDice);
  if (special) return special.has(die.id);

  // if there are 3+ of same face, those dice clickable
  const same = rollingDice.filter(d => d.value === die.value);
  if (same.length >= 3) return true;

  // else single 1 or 5
  return die.value === 1 || die.value === 5;
}

/* 'Take suggestion' commits bestSuggestion in one go */
async function takeSuggestion() {
  if (!bestSuggestion.value) return;
  const ids = bestSuggestion.value.ids;
  const group = rollingDice.filter(d => ids.has(d.id));
  if (group.length) {
    await commitGroup(group);
  }
}

/* End turn: bank points to current player, reset for next player, handle robot flow */
function endTurn() {
  // bank points to player
  farkle.setScore(currentPlayer.value, turnScore.value)

  // reset turn-local state
  turnScore.value = 0;
  previewScore.value = 0;
  rollCount.value = 0;
  rollingDice.length = 0;
  for (let i = 0; i < scoringRows.length; i++) scoringRows[i] = [];
  currentScoringRow.value = 5;
  diceRemaining.value = 6;
  suggestedIds.clear();
  bestSuggestion.value = null;
  canRoll.value = true;
  hotDicePending.value = false;
  showFarkle.value = false;

  iconLoading.value = true;

  // next player
  currentPlayer.value = (currentPlayer.value + 1) % players.length;

  // robot auto-play if mode set
  if (isRobotTurn()) {
    // robot's turn should run after a short delay
    setTimeout(() => robotPlayTurn(), 650);
  } else {
    // if farkle.autoRoll enabled, roll for next human
    if (farkle.autoRoll) setTimeout(() => rollDice(), 300);
  }
  iconLoading.value = false;
}

/* ---------- Robot AI ---------- */
/* Simple heuristics:
   - On each roll, compute bestSuggestion (max score subset).
   - Commit suggestion.
   - Decide to roll again if turnScore < threshold (e.g., 600) and there are remaining dice.
   - If no scoring combos -> farkle (handled by rollDice).
*/
const robotBankThreshold = 600;

async function robotPlayTurn() {
  // only act if robot's turn
  if (!isRobotTurn()) return;

  // start turn by rolling if needed
  if (rollingDice.length === 0 && canRoll.value) {
    rollDice();
  }

  // wait for roll to "settle" visually (rollDice sets suggestions)
  await wait(450);

  // if no scoring combos, farkle will have triggered endTurn inside rollDice
  if (!hasAnyScoringCombination(rollingDice)) return;

  // compute best suggestion
  const best = computeBestSuggestion(rollingDice.slice());
  if (!best) {
    // no suggestion -> probably handled as no scoring combos
    return;
  }

  // commit the best suggestion
  const group = rollingDice.filter(d => best.ids.has(d.id));
  if (group.length) {
    await commitGroup(group);
  }

  // wait small time after commit
  await wait(500);

  // decide whether to continue or bank
  if (turnScore.value < robotBankThreshold && diceRemaining.value > 0) {
    // roll again if allowed
    if (canRoll.value) {
      await wait(300);
      rollDice();
      // continue the robot loop
      await wait(500);
      return robotPlayTurn();
    } else {
      // wait until canRoll becomes true (commitGroup sets it)
      const poll = setInterval(async () => {
        if (canRoll.value) {
          clearInterval(poll);
          await wait(200);
          rollDice();
          await wait(400);
          return robotPlayTurn();
        }
      }, 150);
    }
  } else {
    // bank points
    await wait(300);
    endTurn();
  }
}

/* small helper to pause */
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

const router = useRouter();

/* ---------- Initialization ---------- */
onMounted(() => {
  // start the game with auto-roll if desired
  if (farkle.autoRoll && !isRobotTurn()) {
    setTimeout(() => rollDice(), 200);
  } else if (isRobotTurn()) {
    // if starting with robot turn, start robot
    setTimeout(() => robotPlayTurn(), 300);
  }

    if(farkle.users.length === 0){
      router.push({name:'playerVs'});
    }
});
</script>

<style scoped>
/* dice base */
.dice {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1f2937;
  border-radius: 8px;
  background: white;
  font-weight: 700;
  font-size: 18px;
  user-select: none;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

/* rolling dice: parabolic-feel transition */
.dice.rolling {
  background: #fef3c7;
  cursor: pointer;
  transition: transform 0.6s cubic-bezier(0.55, -0.6, 0.45, 1.6);
  z-index: 50;
}

.dice.placeholder {
  border: 2px dashed #ccc;
  background: transparent;
}


.dice.rolling.suggested {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12), 0 8px 20px rgba(59, 130, 246, 0.18);
}

.dice.rolling.not-clickable {
  opacity: 0.45;
  cursor: not-allowed;
}

/* scored dice: gentle land */
.dice.scored {
  background: #e0f2fe;
  transition: transform 0.6s ease-out;
  z-index: 30;
}

/* small fade for Farkle overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
