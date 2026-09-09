<script setup>
import { primary, primaryLight } from '@/services/colors';
import { onWatcherCleanup, ref } from 'vue';

const languages = {
    EN: 'english',
    BN: 'bengali',
    HN: 'hindi',
    ES: 'spanish'
};

function changeLang(lang) {
    this.$i18n.locale = lang;
    localStorage.setItem('farkle_lang', lang);
}

</script>

<template>
    <div class="w-full flex flex-col justify-between">
        <div class="w-full p-3 flex flex-col gap-5">
            <select id="" class="w-full text-white p-3 rounded-xl text-center" :style="`background: ${primary}`">
                <option v-for="lang,index of languages" :key="index" :value="index" @click="changeLang(index)">{{ $t(lang) }}</option>
            </select>
            <router-link class="text-2xl lilita rounded-2xl p-2 text-white text-center"
                :style="`background: ${primaryLight}`"
                :to="{ name: 'lobby' }">{{ $t('play_now') }}</router-link>
            <router-link class="text-2xl lilita rounded-2xl p-2 text-white text-center"
                        :style="`background: ${primary}`"
                :to="{ name: 'register' }">{{ $t('register') }}</router-link>
        </div>

        <div class="w-full mt-10 text-center">
            <router-link class="w-full text-lg text-center mt-15 text-white" :to="{ name: 'login' }">{{ $t('already_have_account') }}</router-link>
        </div>
    </div>
</template>