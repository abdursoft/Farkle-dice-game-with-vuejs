import { FRIENDS, GAME, SCORE } from "@/Api";
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

    const challenges = ref([]);

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
        localStorage.setItem('diceSound', JSON.stringify(value));
    }

    function setAutoRoll(role){
        autoRoll.value = role;
    }

    function setGameMode(mode){
        gameMode.value = mode;
    }

    function setGameRoundID(id){
        roundID.value = id;
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

    function gameOwn(userID){
        const user = getPlayer(userID);
        setWinState(true);
        setWinMessage(`${user?.name} Won The Game`);
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
    async function setScore(index, score) {
        if(gameMode.value === 'pvp'){
            await addGameScore(score);
        }else{
            if (users[index]) {
                users[index].score += score;
                users[index].turns.push(score);

                if (users[index].score >= winScore.value) {
                    setWinState(true);
                    setWinMessage(`${users[index].name} won the game!`);
                }
            }
        }
    }

    function updateScores(eventData) {
        eventData.summery.forEach(playerScore => {
            const user = users.find(u => u.id == playerScore.player_id)
            if (user) {
                user.score = playerScore.total_score
                user.turns = eventData.history[playerScore.player_id] || []
            }
            console.log(playerScore);
        })
    }

    function getPlayer(userId){
        return users.find(u => u.id == userId)
    }

    function setPlayable() {
        playable.value = true;
    }

    async function restartGame() {
        setWinState(false);
        setWinMessage(null);
        users.forEach((user) => {
            user.score = 0;
            user.turns = []
        });
        if(gameMode.value == 'pvp'){
            await resetScores();
        }
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

    async function getChallenges(){
        try {
            const response = await apiClient.get(FRIENDS.CHALLENGES);    
            challenges.value = response.data;
            return response;
        } catch (error) {
            return error;
        }
    }

    async function acceptChallenge(id){
        console.log('accepting challenge...')
        try {
            const response = await apiClient.post(FRIENDS.ACCEPT(id));    
            return response;
        } catch (error) {
            return error;
        }
    }

    async function gameRound(friendId){
        console.log('Starting game round...');
        try {
            const response = await apiClient.post(GAME.NEW_GAME, { game_challenge_id:challengeId.value, first_player: authUser.value.id, second_player: friendId, score: winScore.value });    
            roundID.value = response.data.id;
            return response;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async function addGameScore(score){
        try {
            const response = await apiClient.post(SCORE.NEW,{
                round_id : roundID.value,
                score : score
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function resetScores(){
        try {
            const response = await apiClient.delete(SCORE.DELETE(roundID.value));
            console.log('Scores reset', response);
        } catch (error) {
            console.log(error);
        }
    }

    function getSfx(){
        const sfx = JSON.parse(localStorage.getItem('diceSound') ?? 'false');
        gameSound.value = sfx;
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
        getPlayer,
        toggleFriends,
        setAuthUser,
        toggleSettings,
        setGameSound,
        setGameMode,
        setAutoRoll,
        setWinScore,
        addUser,
        setScore,
        updateScores,
        setPlayable,
        setWinMessage,
        setWinState,
        restartGame,
        endGame,
        getSfx,
        gameOwn,
        resetUsers,
        getChallenges,
        challengeFriend,
        acceptChallenge,
        gameRound,
        setGameRoundID,
        roundID,
        challengeId,
    };
});
