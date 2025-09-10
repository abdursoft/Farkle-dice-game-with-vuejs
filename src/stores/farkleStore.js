import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useFarkleStore = defineStore("farkleStore", () => {
    const users = reactive([]);
    const authUser = reactive(null);
    const winScore = ref(0);
    const playable = ref(false);
    const winMessage = ref(null);
    const winState = ref(false);
    const gameMode = ref('pvp');
    const autoRoll = ref(false);
    const gameSound = ref(false);
    const openSettings = ref(false);

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

    function addUser(name, id, score = 0) {
        if(users.length < 2){
            users.push({
                id: id,
                name: name,
                turns:[],
                score: score,
            });
        }
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
        endGame
    };
});
