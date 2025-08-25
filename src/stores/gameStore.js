import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useGameStore = defineStore('gameStore',() =>{
    const users = reactive([]);
    const winScore = ref(0);
    const playable = ref(false);
    const winMessage = ref(null);
    const winState = ref(false);

    function setWinScore(score){
        winScore.value = score;
    }

    function setWinState(state){
        winState.value = state;
    }

    function setWinMessage(message){
        winMessage.value = message;
    }

    function addUser(name,surname,score=0){
        users.push({
            name:name,
            surname:surname,
            score: score
        })
    }

    function setUserScore(index,score){
        if(users[index]){
            users[index].score += score;
            if(users[index].score >= winScore.value){
                setWinState(true);
                setWinMessage(`${users[index].name} you win the game!`);
            }
        }
    }

    function setPlayable(){
        playable.value = true;
    }

    function restartGame(){
        setWinState(false);
        setWinMessage(null);
        users.forEach(user => {
            user.score = 0;
        });
    }

    return {users,winScore,playable,winMessage,winState,setWinScore,addUser,setUserScore,setPlayable,setWinMessage,setWinState,restartGame}
    
})