import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useFarkleStore = defineStore("farkleStore", () => {
    const users = reactive([]);
    const winScore = ref(0);
    const playable = ref(false);
    const winMessage = ref(null);
    const winState = ref(false);
    const gameMode = ref('pvp');
    const autoRoll = ref(false);

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
        users.push({
            id: id,
            name: name,
            turns:[],
            score: score,
        });
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
        });
    }

    return {
        users,
        winScore,
        playable,
        winMessage,
        winState,
        gameMode,
        autoRoll,
        setGameMode,
        setAutoRoll,
        setWinScore,
        addUser,
        setScore,
        setPlayable,
        setWinMessage,
        setWinState,
        restartGame,
    };
});
