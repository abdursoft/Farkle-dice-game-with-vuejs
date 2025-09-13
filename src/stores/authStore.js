import { AUTH } from "@/Api";
import apiClient from "@/services/axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore('authStore', () => {
    const authUser = ref(null);
    const avatar = ref(2);
    const authToken = ref(null);
    const authRefToken = ref(null);

    const router = useRouter();

    function setAuthUser(user){
        authUser.value = user;
    }

    function setAvatar(av){
        avatar.value = av;
    }

    function setAuthToken(token){
        authToken.value = token;
    }

    function setAuthRefToken(token){
        authRefToken.value = token;
    }


    async function authCheck() {
        try {
            const response = await apiClient.get(AUTH.CHECK);
            authUser.value = response.data.user;
            return response;
        } catch (error) {
           return error; 
        }
    }

    async function register(data){
        try {
            const response = await apiClient.post(AUTH.REGISTER, data);
            authUser.value = response.data.user;
            authToken.value = response.data.token;
            localStorage.setItem('dicToken', response.data.token);
            return response;
        } catch (error) {
           return error; 
        }
    }


    async function login(data){
        try {
            const response = await apiClient.post(AUTH.LOGIN, data);
            authUser.value = response.data.user;
            authToken.value = response.data.token;
            localStorage.setItem('dicToken', response.data.token);
            return response;
        } catch (error) {
            
        }
    }


    async function logout(){
        authUser.value = null;
        authToken.value = null;
        localStorage.removeItem('dicToken');
        router.push({name:'home'});
    }

    return {authUser,avatar,authToken,authRefToken,setAuthUser,setAvatar,setAuthToken,setAuthRefToken, authCheck, register, login, logout}
})