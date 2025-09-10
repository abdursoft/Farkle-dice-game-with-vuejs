<template>
    <div class="p-4 w-full mx-auto bg-white rounded-2xl shadow-md">
        <!-- Header -->
        <div class="flex items-center mb-6">
            <img class="w-16 h-16 rounded-full border-2 border-orange-400" src="" alt="Avatar" />
            <div class="ml-4">
                <h2 class="font-bold text-lg">{{ username }}</h2>
                <div class="flex gap-4 text-sm">
                    <span>LEVEL: {{ level }}</span>
                    <span>COLLECTION: {{ collection }}</span>
                </div>
            </div>
        </div>

        <!-- Games Played -->
        <h3 class="text-center font-bold mb-2">GAMES PLAYED</h3>
        <div class="flex justify-center mb-6">
            <canvas id="gamesChart" ref="gamesChart" class="w-[200px] h-[200px]"></canvas>
        </div>
        <div class="flex justify-between mb-4">
            <span class="text-blue-500 lilita">Games Won: {{ gamesWon }}</span>
            <span class="text-red-500 lilita">Games Lost: {{ gamesLost }}</span>
        </div>

        <!-- Scores -->
        <div class="text-sm">
            <div class="flex justify-between">
                <span>Highest Score</span> <span>{{ highestScore }}</span>
            </div>
            <div class="flex justify-between">
                <span>Average Score</span> <span>{{ averageScore }}</span>
            </div>
            <div class="flex justify-between">
                <span>Highest Round Score</span> <span>{{ highestRoundScore }}</span>
            </div>
            <div class="flex justify-between">
                <span>Average Round Score</span> <span>{{ averageRoundScore }}</span>
            </div>
        </div>

        <!-- Win Streak -->
        <div class="mt-6 space-y-2 text-sm">
            <div class="flex justify-between">
                <span>Current Win Streak</span> <span>{{ currentStreak }}</span>
            </div>
            <div class="flex justify-between">
                <span>Highest Win Streak</span> <span>{{ highestStreak }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'

Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

const username = 'SmoothZebra#4253'
const level = 1
const collection = 0

const gamesWon = 50
const gamesLost = 10

const highestScore = 0
const averageScore = 0
const highestRoundScore = 0
const averageRoundScore = 0

const currentStreak = 0
const highestStreak = 0


onMounted(() => {
    new Chart(document.getElementById('gamesChart'), {
        type: 'doughnut',
        data: {
            labels: ['Won', 'Lost'],
            datasets: [
                {
                    data: [gamesWon, gamesLost],
                    backgroundColor: ['#3b82f6', '#ef4444'],
                },
            ],
        },
        options: {
            responsive: true,
            cutout: '70%',
            plugins: { legend: { display: false } },
        },
    })
})
</script>
