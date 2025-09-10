<script setup>
import { useAuthStore } from '@/stores/authStore';
import { Icon } from '@iconify/vue';
import { reactive, ref } from 'vue';

const authStore =useAuthStore();

const emits = defineEmits(['avatarCallback'])
const props = defineProps({
    openAvatar:{
        Boolean,
        default: false
    }
})

const avatarIndex = ref(null);


function avatarSelection(avatar){
    authStore.setAvatar(avatar);
    avatarIndex.value = avatar;
}

function toggleAvatarModal(){
    emits('avatarCallback',[false,avatarIndex.value]);
}

</script>

<template>
    <div class="w-full h-screen flex items-center justify-center absolute top-0 left-0 inset-0 z-99 px-3"
        v-if="props.openAvatar">
        <div
            class="w-[90vw] rounded-lg border-2 bg-gray-200 border-orange-600 px-3 h-auto text-center relative">
            <div class="px-7">
                <h3 class="text-2xl bg-orange-500 lilita rounded-br-md rounded-bl-md">Profile Avatar!</h3>
            </div>
            <!-- avatar section  -->
            <div class="w-full flex items-center px-3 flex-wrap mt-5">
                <div v-for="(avatar,index) in 10" :key="index" class="px-2 w-1/4 my-2">
                    <div class="w-[60px] h-[60px] rounded-full">
                        <img :src="`/avatar/avatar${avatar}.svg`" class="hover:scale-[1.2] transition hover:bg-gray-500 w-full h-full rounded-full overflow-hidden cursor-pointer" alt="" title="select" @click="avatarSelection(avatar)" >
                    </div>
                </div>
            </div>

            <div class="text-center w-full mt-5 flex items-center justify-between gap-1 px-4">
                <p>Player ID: #9E5B2B</p>
                <p>App v1.0.0</p>
            </div>
            <Icon icon="qlementine-icons:success-32" width="28" height="28" class="absolute top-1 right-1 cursor-pointer"
                @click="toggleAvatarModal" />
        </div>
    </div>
</template>