<script setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toast-notification';
import TextButton from '../buttons/TextButton.vue';
import { primary, primaryLight } from '@/services/colors';

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


async function login(){
    isLoading.value = true;
    const res = await authStore.login(userForm);
    if(res.status === 200){
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
    <div class="w-full max-w-[445px] py-5 px-2 flex flex-col items-center justify-center gap-10 rounded-md text-white" :style="`background: ${primaryLight}`">
        <div class="w-full my-5 px-5">
            <div class="my-2">
                <label for="email">Email Address</label>
                <input type="email" class="w-full p-3 rounded-lg border-2 border-gray-400" v-model="userForm.email" placeholder="jhon_doe@gmail.com" />
            </div>
             <div>
                <label for="name">Password</label>
                <input type="password" class="w-full p-3 rounded-lg border-2 border-gray-400" v-model="userForm.password" placeholder="Pa$$w0rd!" />
            </div>
            <div class="w-full flex items-center justify-center mt-8">
                <TextButton @click="login" :styles="`background:${primary}`" icon="line-md:arrow-right" :loading="isLoading" title="Login" />
            </div>
        </div>

    </div>
</template>