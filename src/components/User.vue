<script setup>
import { useGameStore } from '@/stores/gameStore';
import InputField from './InputField.vue';
import { reactive } from 'vue';
import TextButton from './buttons/TextButton.vue';

const emit = defineEmits(['returnUser']);

const userData = reactive({
    name:"",
    surname:"",
});

const game = useGameStore();

const props = defineProps({
    userIndex:{
        Number,
        default: 1
    },
})

function addUser(){
    if(game.users.length >= 2){
        alert('You can\'t add more users, or refresh the page');
    }
    game.addUser(userData.name, userData.surname, 0);
    userData.name = "";
    userData.surname = "";
    emit('returnUser',true);
}

</script>

<template>
    <div class="flex items-center justify-center w-full p-3">
        <div class="w-full p-3">
            <h1 class="text-xl md:text-2xl mb-1">Player {{ props.userIndex }}</h1>
            <InputField type="text" placeholder="User name" label="Enter first user name" v-model="userData.name" />
            <InputField type="text" placeholder="User surname" label="Enter first user surname" v-model="userData.surname" />
            <TextButton title="Next" v-on:click="addUser" type="button" />
        </div>
    </div>
</template>