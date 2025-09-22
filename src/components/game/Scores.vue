<template>
    <div class="p-4 w-full mx-auto text-white rounded-2xl shadow-md overflow-y-auto" :style="`background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`">
        <!-- Header -->
        <div class="flex items-center mb-6">
            <img class="w-16 h-16 rounded-full border-2 border-orange-400" :src="`/avatar/avatar${authStore.authUser?.avatar}.svg`" alt="Avatar" />
            <div class="ml-4">
                <h2 class="font-bold text-lg">{{ authStore.authUser?.name }}</h2>
                <div class="flex gap-4 text-sm">
                    <span>LEVEL: {{ level }}</span>
                    <span>COLLECTION: {{ collection }}</span>
                </div>
            </div>
        </div>

        <!-- Games Played -->
        <h3 class="text-center font-bold mb-2">GAMES PLAYED</h3>
        <div class="flex justify-center mb-6">
            <canvas id="gamesChart" ref="gamesChart" class="w-[100px] h-[100px]"></canvas>
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
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'
import { useAuthStore } from '@/stores/authStore'
import { primary, secondary } from '@/services/colors'

const authStore = useAuthStore();

Chart.register(ArcElement, Tooltip, Legend, DoughnutController)

const gamesWon = ref(0)
const gamesLost = ref(0)

const highestScore = ref(0)
const averageScore = ref(0)


async function renderChart(){
    new Chart(document.getElementById('gamesChart'), {
        type: 'doughnut',
        data: {
            labels: ['Won', 'Lost'],
            datasets: [
                {
                    data: [gamesWon.value, gamesLost.value],
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
}

onMounted(async () => {
    await authStore.getLeaderboard();
    if(authStore.leaderboard){
        gamesWon.value = authStore.leaderboard?.total_wins;
        gamesLost.value = authStore.leaderboard?.total_losses;
        averageScore.value = authStore.leaderboard?.average_score;
        highestScore.value = authStore.leaderboard?.highest_score;
        await renderChart();
    }
})
</script>
