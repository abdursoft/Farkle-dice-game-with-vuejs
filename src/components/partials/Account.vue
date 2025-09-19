<script setup>
import { primary, primaryLight } from '@/services/colors';

</script>

<template>
    <div class="w-full flex flex-col justify-between">
        <div class="w-full p-3 flex flex-col gap-5">
            <select id="" class="w-full text-white p-3 rounded-xl text-center" :style="`background: ${primary}`">
                <option value="en">English</option>
                <option value="bn">Bengali</option>
                <option value="hn">Hindi</option>
                <option value="fr">French</option>
            </select>
            <router-link class="text-2xl lilita rounded-2xl p-2 text-white text-center"
                :style="`background: ${primaryLight}`"
                :to="{ name: 'lobby' }">PLAY</router-link>
            <router-link class="text-2xl lilita rounded-2xl p-2 text-white text-center"
                        :style="`background: ${primary}`"
                :to="{ name: 'register' }">SIGN UP</router-link>
        </div>

        <div class="w-full mt-10 text-center">
            <router-link class="w-full text-lg underline text-center mt-15 text-white" :to="{ name: 'login' }">Already singed
                up?</router-link>
        </div>
    </div>
</template>