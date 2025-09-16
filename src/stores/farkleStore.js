import { FRIENDS, GAME } from "@/Api";
import apiClient from "@/services/axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useFarkleStore = defineStore("farkleStore", () => {
    const users = reactive([]);
    const authUser = ref(null);
    const winScore = ref(0);
    const playable = ref(false);
    const winMessage = ref(null);
    const winState = ref(false);
    const gameMode = ref('pvp');
    const autoRoll = ref(false);
    const gameSound = ref(false);
    const openSettings = ref(false);
    const openFriends = ref(false);
    const roundID = ref(null);
    const challengeId = ref(null);

    function toggleFriends(){
        openFriends.value = !openFriends.value;
    }

    function setAuthUser(user){
        authUser.value = user;
    }

    function toggleSettings(setting){
        openSettings.value = setting;
    }

    function setGameSound(value){
        gameSound.value = value;
    }

    function setAutoRoll(role){
        autoRoll.value = role;
    }

    function setGameMode(mode){
        gameMode.value = mode;
    }

    function setWinScore(score) {
        winScore.value = score;
    }

    function setWinState(state) {
        winState.value = state;
    }

    function setWinMessage(message) {
        winMessage.value = message;
    }

    function addUser(name, id, avatar=1, score = 0) {
        if(users.length < 2){
            users.push({
                id: id,
                name: name,
                avatar: avatar,
                turns:[],
                score: score,
            });
        }
    }

    function resetUsers(){
        users.length = 0;
    }

    function endGame(){
        setWinState(false);
        setWinMessage(null);
        users.length = 0;
    }

    function setScore(index, score) {
        if (users[index]) {
            users[index].score += score;
            users[index].turns.push(score);
            if (users[index].score >= winScore.value) {
                setWinState(true);
                setWinMessage(`${users[index].name} you win the game!`);
            }
        }
    }

    function setPlayable() {
        playable.value = true;
    }

    function restartGame() {
        setWinState(false);
        setWinMessage(null);
        users.forEach((user) => {
            user.score = 0;
            user.turns = []
        });
    }

        async function challengeFriend(id, score) {
        try {
            const response = await apiClient.post(FRIENDS.CHALLENGE, { challengee_id: id, challenge_score: score, challenger_id: authUser?.value?.id });  
            challengeId.value = response.data.id;
            const round = await gameRound(id);
            return round;
        } catch (error) {
            return error;
        }   
    }

    async function acceptChallenge(id){
        try {
            const response = await apiClient.post(GAME.CHALLENGE, { challenge_id: id });    
            roundID.value = response.data.round.id;
            return response;
        } catch (error) {
            return error;
        }
    }

    async function gameRound(friendId){
        console.log('Starting game round...');
        try {
            const response = await apiClient.post(GAME.NEW_GAME, { game_challenge_id:challengeId.value, first_player: authUser.value.id, second_player: friendId, score: winScore.value });    
            roundID.value = response.data.round.id;
            console.log(response);
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    return {
        users,
        authUser,
        winScore,
        playable,
        winMessage,
        winState,
        gameMode,
        autoRoll,
        gameSound,
        openSettings,
        openFriends,
        toggleFriends,
        setAuthUser,
        toggleSettings,
        setGameSound,
        setGameMode,
        setAutoRoll,
        setWinScore,
        addUser,
        setScore,
        setPlayable,
        setWinMessage,
        setWinState,
        restartGame,
        endGame,
        resetUsers,
        challengeFriend,
        gameRound,
        acceptChallenge,
        roundID,
        challengeId,
    };
});
