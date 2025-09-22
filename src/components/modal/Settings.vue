<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useFarkleStore } from '@/stores/farkleStore';
import { Icon } from '@iconify/vue';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import TextButton from '../buttons/TextButton.vue';
import { onBeforeRouteLeave } from 'vue-router';
import { primary, primaryLight, secondary, tertiary } from '@/services/colors';
import { useToast } from 'vue-toast-notification';
import { watch } from 'vue';


const farkle = useFarkleStore();
const authStore = useAuthStore();
const toast = useToast();

const user = reactive({
    name:''
})

const sfx = ref(false);
const isEdit = ref(false);

function toggleSettings() {
    farkle.toggleSettings(false);
}

async function changeProfileName(){
    try {
        if(user.name != authStore.authUser?.name){
            await authStore.changeName(user.name);
        }
        isEdit.value = !isEdit.value;
    } catch (error) {
        toast.error(error?.response.data.message);
    }
}

watchEffect(() => {
  if (isEdit.value) {
    user.name = authStore.authUser?.name
  }
})

watch(
    () => farkle.gameSound,
    async (newValue,old) => {
        sfx.value = newValue;
    }
);

onMounted(() => {
    farkle.getSfx();
});

onBeforeRouteLeave((to,from) => {
   toggleSettings(); 
})

</script>

<template>
    <div class="w-full h-screen flex items-center justify-center fixed top-0 left-0 inset-0 z-99 px-3"
        v-if="farkle.openSettings">
        <div
            class="md:max-w-[40vw] w-full max-w-[420px] rounded-lg border-2 border-orange-600 px-3 h-auto text-center relative text-white" :style="`background: ${primary}`">
            <div class="px-7">
                <h3 class="text-2xl bg-orange-500 lilita rounded-br-md rounded-bl-md" :style="`background: ${primaryLight}`">Settings!</h3>
            </div>
            <!-- avatar section  -->
            <div class="px-2 w-full flex items-center mt-2">
                <img :src="`/avatar/avatar${authStore.authUser?.avatar}.svg`" alt=""
                    class="w-[70px] h-[70px] rounded-full overflow-hidden">
                <div class="h-[35px] flex-1 rounded-br-md rounded-tr-md flex items-center justify-center gap-1" :style="`background: ${secondary}`">
                    <input v-model="user.name" v-if="isEdit" type="text" class="w-full rounded-lg border-2 border-gray-400 transition delay-300" placeholder="JhonDoe" />
                    <p v-else class="text-white text-center">{{ authStore.authUser?.name }}</p>

                    <Icon v-if="!isEdit" icon="mynaui:edit-one" width="24" height="24" @click="isEdit = !isEdit" />
                    <Icon v-else @click="changeProfileName" icon="prime:check-square" width="24" height="24" />
                </div>
            </div>
            <!-- sound section  -->
            <div class="w-full px-4 flex items-center justify-center gap-10 my-3">
                <Icon icon="lets-icons:sound-max-light" width="28" height="28" class="w-[40px] h-[40px] rounded-full cursor-pointer p-2" :class="{'bg-gray-700 text-white' : sfx}" @click="farkle.setGameSound(true)" />
                <Icon icon="lets-icons:sound-mute-light" width="28" height="28" class="w-[40px] h-[40px] rounded-full cursor-pointer p-2" :class="{'bg-gray-700 text-white' : !sfx}" @click="farkle.setGameSound(false)" />
            </div>
            <!-- support & language section  -->
            <div class="w-full px-4 flex items-center justify-around mt-5 gap-3">
                <button class="p-2 rounded-md text-white cursor-pointer w-full" :style="`background: ${primaryLight}`">Language</button>
                <button class="p-2 rounded-md text-white cursor-pointer w-full" :style="`background: ${primaryLight}`">Support</button>

            </div>
            <div class="text-center w-full mt-3 flex flex-col gap-1 px-4">
                <TextButton v-if="authStore.authUser?.name" background="bg-red-500" title="Logout" @click="authStore.logout()" />
                <router-link v-else :to="{ name: 'register' }" class="py-2 px-3 bg-blue-600 rounded-md text-white my-2">Create
                    Account</router-link>
            </div>
            <div class="px-4 w-full mt-5">
                <div class="w-full rounded-lg p-2 flex items-center justify-center flex-col bg-gray-800 py-6">
                    <div class="w-full flex items-center justify-center gap-4">
                        <router-link class="w-full rounded-md text-white px-2 py-1" :style="`background: ${primaryLight}`" to="/">Terms service</router-link>
                        <router-link class="w-full rounded-md text-white px-2 py-1" :style="`background: ${primaryLight}`" to="/">Privacy Policy</router-link>
                    </div>
                    <div class="w-full text-center">
                        <router-link class="text-sm text-gray-100" to="/">Delete account</router-link>
                    </div>
                </div>
            </div>
            <div class="text-center w-full mt-5 flex items-center justify-between gap-1 px-4">
                <p>Player ID: #9E5B2B</p>
                <p>App v1.0.0</p>
            </div>
            <Icon icon="system-uicons:cross-circle" width="28" height="28" class="absolute top-1 right-1 cursor-pointer"
                @click="toggleSettings" />
        </div>
    </div>
</template>