<template>
    <div class="w-full max-w-[445px] mx-auto px-2 py-5 relative bg-gray-400">

        <!-- score board  -->
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
            <!-- rows (top -> 0, bottom -> 5). placeholders always shown -->
            <div v-for="(row, rowIndex) in scoringRows" :key="rowIndex" class="relative w-full h-12 mb-3">
                <div class="flex items-center gap-2">
                    <template v-for="pIndex in 6" :key="rowIndex + '_' + pIndex">
                        <!-- we keep placeholders visible always -->
                        <div v-if="!row[pIndex - 1]" class="dice scored placeholder"></div>
                        <div v-else class="dice scored placeholder"></div>
                    </template>
                </div>
            </div>

            <!-- overlay: render all scored dice here in parent coordinates (so they align with rolling dice movement) -->
            <div class="absolute inset-0 pointer-events-none">
                <template v-for="(row, rowIndex) in scoringRows" :key="'overlay_' + rowIndex">
                    <template v-for="(dice, slotIndex) in row"
                        :key="dice?.id ? 'scored_' + dice.id : 'empty_' + slotIndex">
                        <div v-if="dice" class="dice scored"
                            :style="getScoredDiceStyleGlobal(dice, rowIndex, slotIndex)">
                            {{ dice.value }}
                        </div>
                    </template>
                </template>
            </div>

            <!-- rolling area sits above bottom-left of container (we place rolls at absolute coords) -->
            <div class="flex w-full py-7 items-center justify-between gap-1 bg-amber-700 px-2" style="height: 120px;">
                <div v-for="(dice, i) in rollingDice" :key="dice.id" class="dice rolling" :class="{
                    'not-clickable': !isDieClickable(dice),
                    'suggested': suggestedIds.has(dice.id)
                }" :style="getRollingDiceStyle(dice, i)" @click="onDieClick(dice)">
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
import { ref, reactive, computed, onMounted } from "vue";
import { useFarkleStore } from "@/stores/farkleStore";
import UserCard from "../cards/UserCard.vue";
import ScoreRule from "../cards/ScoreRule.vue";
import { useRouter } from "vue-router";

const farkle = useFarkleStore();

/* ---------- Constants ---------- */
const DIE_SIZE = 48;
const GAP = 8;
const SLOT = DIE_SIZE + GAP; // 56
const ROW_MARGIN_PX = 12; // tailwind mb-3 ≈ 12px
const ROW_SPACING = DIE_SIZE + ROW_MARGIN_PX; // 48 + 12 = 60

/* ---------- Game state ---------- */
const players = farkle.users;

const currentPlayer = ref(0); // index into players (0 or 1)

const rollingDice = reactive([]); // dice currently rolled
// scoringRows: each row is an array of dice (variable length, up to 6)
const scoringRows = reactive([[], [], [], [], [], []]); // index 0 = top, 5 = bottom
const currentScoringRow = ref(5); // start filling at bottom
const diceIdCounter = ref(1);

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

function faceCounts(values) {
    const c = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (const v of values) c[v] = (c[v] || 0) + 1;
    return c;
}

/* Full Farkle scoring for a chosen subset */
function calculateScore(valuesInput) {
    const values = valuesInput.map ? valuesInput.map(v => (typeof v === 'number' ? v : v.value)) : [];
    const n = values.length;
    if (n === 0) return 0;
    const counts = faceCounts(values);

    if (n === 6) {
        const isStraight = [1, 2, 3, 4, 5, 6].every(v => counts[v] === 1);
        const threePairs = Object.values(counts).filter(c => c === 2).length === 3;
        const twoTrips = Object.values(counts).filter(c => c === 3).length === 2;
        if (twoTrips) return 2500;
        if (isStraight) return 1500;
        if (threePairs) return 1500;
    }

    let score = 0;
    for (let f = 1; f <= 6; f++) {
        const c = counts[f];
        if (c >= 3) {
            const base = (f === 1) ? 1000 : f * 100;
            const multiplier = Math.pow(2, c - 3);
            score += base * multiplier;
            counts[f] = 0;
        }
    }

    score += (counts[1] || 0) * 100;
    score += (counts[5] || 0) * 50;

    return score;
}

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

    for (let f = 1; f <= 6; f++) {
        if (counts[f] >= 3) counts[f] = 0;
    }

    for (let f = 1; f <= 6; f++) {
        if (counts[f] > 0 && f !== 1 && f !== 5) return false;
    }
    return true;
}

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

function computeBestSuggestion(diceList) {
    const n = diceList.length;
    if (n === 0) return null;
    let best = null;
    const arr = diceList.slice();
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

/* return style for rolling dice (in parent coordinates) */
function getRollingDiceStyle(dice, index) {
    // If flying, animate to global targetX/targetY, else show initial x,y
    const x = (dice.flying && dice.targetX != null) ? dice.targetX : (dice.x != null ? dice.x : index * SLOT);
    const y = (dice.flying && dice.targetY != null) ? dice.targetY : (dice.y != null ? dice.y : 0);

    return {
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.6s cubic-bezier(0.55, -0.6, 0.45, 1.6)',
        position: 'absolute',
        zIndex: 50,
    };
}

/* return style for scored dice in global (parent) coordinates */
function getScoredDiceStyleGlobal(dice, rowIndex, slotIndex) {
    // If dice has explicit targetX/targetY (we set those during commit) use them, else compute from slot
    const x = (dice && dice.targetX != null) ? dice.targetX : (slotIndex * SLOT);
    const y = (dice && dice.targetY != null) ? dice.targetY : (rowIndex * ROW_SPACING);
    return {
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.6s ease-out',
        position: 'absolute',
        zIndex: 30,
        pointerEvents: 'none',
    };
}

/* ---------- Game flow functions ---------- */

function rollDice() {
    if (hotDicePending.value) {
        currentScoringRow.value = 5;
        hotDicePending.value = false;
    } else if (rollCount.value > 0) {
        currentScoringRow.value = Math.max(0, currentScoringRow.value - 1);
    }

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

    suggestedIds.clear();
    bestSuggestion.value = computeBestSuggestion(rollingDice.slice());
    if (!hasAnyScoringCombination(rollingDice)) {
        showFarkle.value = true;
        setTimeout(() => {
            showFarkle.value = false;
            turnScore.value = 0;
            endTurn();
        }, 900);
        return;
    } else {
        if (bestSuggestion.value) {
            for (const id of bestSuggestion.value.ids) suggestedIds.add(id);
        }
    }
}

/* Commit a group of dice into the first available slots of currentScoringRow.
   We set targetX/targetY in global parent coordinates and mark dice.flying = true
*/
function commitGroup(group) {
    if (!group || group.length === 0) return Promise.resolve();

    const rowIndex = currentScoringRow.value;
    const row = scoringRows[rowIndex];

    // find first free slot positions in this row (we push to the end, but ensure gaps are filled)
    const startSlot = row.length; // append to current row
    group.forEach((dice, idx) => {
        const slot = startSlot + idx;
        dice.targetX = slot * SLOT;
        dice.targetY = rowIndex * ROW_SPACING;
        dice.flying = true;
        dice.landed = false;
        // temporarily push the dice reference into the row so overlay can show it (it will be finalized after flying)
        row.push(dice);
    });

    const gained = calculateScore(group.map(d => d.value));
    turnScore.value += gained;
    diceRemaining.value = Math.max(0, diceRemaining.value - group.length);

    // after flight duration remove from rollingDice and set landed true
    return new Promise((resolve) => {
        setTimeout(() => {
            for (const d of group) {
                const idx = rollingDice.findIndex(r => r.id === d.id);
                if (idx >= 0) rollingDice.splice(idx, 1);
                d.flying = false;
                d.landed = true;
            }

            // recompute suggestion
            suggestedIds.clear();
            bestSuggestion.value = computeBestSuggestion(rollingDice.slice());
            if (bestSuggestion.value) {
                for (const id of bestSuggestion.value.ids) suggestedIds.add(id);
            }

            if (rollingDice.length === 0) {
                hotDicePending.value = true;
                diceRemaining.value = 6;
                canRoll.value = true;
                if (farkle.autoRoll && !isRobotTurn()) {
                    setTimeout(() => rollDice(), 350);
                }
            } else {
                canRoll.value = true;
            }

            resolve();
        }, 700); // slightly larger than transition to be safe
    });
}

function isRobotTurn() {
    return farkle.gameMode.value === 'robot' && currentPlayer.value === 1;
}

async function onDieClick(die) {
    if (!isDieClickable(die)) return;
    const special = detectSixDiceSpecial(rollingDice);
    if (special && special.has(die.id)) {
        const group = rollingDice.slice();
        await commitGroup(group);
        return;
    }

    const same = rollingDice.filter(d => d.value === die.value);
    if (same.length >= 3) {
        await commitGroup(same);
        return;
    }

    if (die.value === 1 || die.value === 5) {
        await commitGroup([die]);
        return;
    }
}

function isDieClickable(die) {
    const special = detectSixDiceSpecial(rollingDice);
    if (special) return special.has(die.id);
    const same = rollingDice.filter(d => d.value === die.value);
    if (same.length >= 3) return true;
    return die.value === 1 || die.value === 5;
}

async function takeSuggestion() {
    if (!bestSuggestion.value) return;
    const ids = bestSuggestion.value.ids;
    const group = rollingDice.filter(d => ids.has(d.id));
    if (group.length) {
        await commitGroup(group);
    }
}

function endTurn() {
    // bank points to player
    farkle.setScore(currentPlayer.value, turnScore.value);

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

    // next player
    currentPlayer.value = (currentPlayer.value + 1) % players.length;

    if (isRobotTurn()) {
        setTimeout(() => robotPlayTurn(), 650);
    } else {
        if (farkle.autoRoll) setTimeout(() => rollDice(), 300);
    }
}

/* ---------- Robot AI (unchanged) ---------- */
const robotBankThreshold = 600;

async function robotPlayTurn() {
    if (!isRobotTurn()) return;

    if (rollingDice.length === 0 && canRoll.value) {
        rollDice();
    }

    await wait(450);
    if (!hasAnyScoringCombination(rollingDice)) return;

    const best = computeBestSuggestion(rollingDice.slice());
    if (!best) return;

    const group = rollingDice.filter(d => best.ids.has(d.id));
    if (group.length) {
        await commitGroup(group);
    }

    await wait(500);

    if (turnScore.value < robotBankThreshold && diceRemaining.value > 0) {
        if (canRoll.value) {
            await wait(300);
            rollDice();
            await wait(500);
            return robotPlayTurn();
        } else {
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
        await wait(300);
        endTurn();
    }
}

function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

const router = useRouter();

/* ---------- Init ---------- */
onMounted(() => {
    if (farkle.autoRoll && !isRobotTurn()) {
        setTimeout(() => rollDice(), 200);
    } else if (isRobotTurn()) {
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
    width: 48px;
    height: 48px;
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
