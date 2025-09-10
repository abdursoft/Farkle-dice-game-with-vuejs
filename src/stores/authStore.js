import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
    const authUser = reactive();
    const avatar = ref(2);
    const authToken = ref(null);
    const authRefToken = ref(null);

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

    return {authUser,avatar,authToken,authRefToken,setAuthUser,setAvatar,setAuthToken,setAuthRefToken}
})