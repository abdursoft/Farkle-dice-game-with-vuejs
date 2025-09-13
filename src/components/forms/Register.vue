<script setup>
import Edit from '@/assets/icons/editWhite.svg'
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import Avatar from '../modal/Avatar.vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toast-notification';
import TextButton from '../buttons/TextButton.vue';

const router = useRouter();
const tost = useToast();

const authStore = useAuthStore();

const userForm = reactive({
    name:'',
    email:'',
    password:'',
    avatar:'',
});


const isLoading = ref(false);
const isAvatar = ref(false);

function handleAvatar([isOpen,avatar]){
    isAvatar.value = isOpen;
    userForm.avatar = avatar;
}

async function register(){
    isLoading.value = true;
    const res = await authStore.register(userForm);
    if(res.status === 201){
        tost.success(res.data?.message, {
            position: 'top-right'
        });   
        router.push({name:"lobby"});
    }else{
        tost.error(res.response?.data.message, {
            position: 'top-right'
        });
    }
    isLoading.value = false;
}
</script>

<template>
    <div class="w-full max-w-[445px] bg-white py-5 px-2 flex flex-col items-center justify-center gap-10 rounded-md">
        <div class="w-full flex items-center justify-center">
            <div class="w-[150px] h-[150px] rounded-full border-5 border-gray-400 relative p-1">
                <img :src="`/avatar/avatar${authStore.avatar}.svg`" alt="">
                <div class="w-[40px] h-[40px] absolute rounded-full top-10 -right-4 bg-slate-700 p-1 text-white">
                    <Edit class="w-full h-full text-orange stroke-[#fff] cursor-pointer" @click="isAvatar = !isAvatar" />
                </div>
            </div>
        </div>
        <div class="w-full my-5 px-5">
            <div>
                <label for="name">Your Name</label>
                <input type="text" class="w-full p-3 rounded-lg border-2 border-gray-400" v-model="userForm.name" placeholder="JhonDoe" />
            </div>
            <div class="my-2">
                <label for="email">Email Address</label>
                <input type="email" class="w-full p-3 rounded-lg border-2 border-gray-400" v-model="userForm.email" placeholder="jhon_doe@gmail.com" />
            </div>
             <div>
                <label for="name">Password</label>
                <input type="password" class="w-full p-3 rounded-lg border-2 border-gray-400" v-model="userForm.password" placeholder="Pa$$w0rd!" />
            </div>
            <div class="w-full flex items-center justify-center mt-8">
                <TextButton @click="register" icon="line-md:arrow-right" :loading="isLoading" title="Create Account" />
            </div>
        </div>

        <!-- avatar modal  -->
         <Avatar :open-avatar="isAvatar" @avatar-callback="handleAvatar" />
    </div>
</template>