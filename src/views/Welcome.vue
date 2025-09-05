<script setup>
import InputField from '@/components/InputField.vue';
import Loading from '@/components/partials/Loading.vue';
import TextButton from '@/components/TextButton.vue';
import User from '@/components/User.vue';
import router from '@/router';
import { useGameStore } from '@/stores/gameStore';
import { reactive, ref } from 'vue';


const game = useGameStore();
const playerIndex = ref(1);
const scoreModel = reactive({
    score: 2000
})

function getUser(val) {
    val ? playerIndex.value += 1 : null;
}

function setScore(){
    game.setWinScore(scoreModel.score);
    game.setPlayable();
    router.push({name:'game'});
}
</script>

<template>
    <div class="w-full flex items-center justify-center min-h-screen bg-orange-500">
        <!-- <div class="w-full max-w-[600px] min-h-70 bg-white rounded-md shadow-md p-3">
            <User v-if="playerIndex == 1" user-index="1" v-on:return-user="getUser" />
            <User v-if="playerIndex == 2" user-index="2" v-on:return-user="getUser" />

            <div class="flex items-center justify-center w-full p-3" v-if="playerIndex == 3">
                <div class="w-full p-3">
                    <h1 class="text-xl md:text-2xl mb-1 text-center">Win Score</h1>
                    <InputField type="text" placeholder="5000" label="Set game over score"
                        v-model="scoreModel.score" />
                    <TextButton title="Start Game" @click="setScore" type="button" />
                </div>
            </div>
        </div> -->

        <Loading />
    </div>
</template>