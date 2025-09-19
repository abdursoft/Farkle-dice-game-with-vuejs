<script setup>
import { primaryLight, secondary } from '@/services/colors';
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
    <div class="w-full h-screen flex items-center justify-center fixed top-0 left-0 inset-0 z-99 px-3"
        v-if="props.openAvatar">
        <div
            class="md:max-w-[40vw] w-full max-w-[420px] rounded-lg border-2 border-orange-600 px-3 h-auto text-center relative" :style="`background: ${secondary}`">
            <div class="px-7">
                <h3 class="text-2xl lilita rounded-br-md rounded-bl-md" :style="`background: ${primaryLight}`">Profile Avatar!</h3>
            </div>
            <!-- avatar section  -->
            <div class="w-full flex items-center px-3 flex-wrap mt-5">
                <div v-for="(avatar,index) in 9" :key="index" class="px-2 w-1/4 my-2">
                    <div class="w-[60px] h-[60px] rounded-full">
                        <img :src="`/avatar/avatar${avatar}.svg`" class="hover:scale-[1.2] transition hover:bg-gray-500 w-full h-full rounded-full overflow-hidden cursor-pointer" alt="" title="select" @click="avatarSelection(avatar)" >
                    </div>
                </div>
            </div>
            
            <Icon icon="qlementine-icons:success-32" width="28" height="28" class="absolute top-1 right-1 cursor-pointer"
                @click="toggleAvatarModal" />
        </div>
    </div>
</template>