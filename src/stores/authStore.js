import { AUTH, FRIENDS, GAME } from "@/Api";
import { initEcho } from "@/plugins/Reverb";
import apiClient from "@/services/axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("authStore", () => {
    const router = useRouter();

    const authUser = ref(null);
    const avatar = ref(2);
    const authToken = ref(null);
    const authRefToken = ref(null);
    const friends = ref(null);
    const friend = ref(null);
    const leaderboard = ref(null);

    async function getFriend(token) {
        try {
            const response = await apiClient.get(FRIENDS.DETAILS(token));
            friend.value = response.data.friend;
            return response;
        } catch (error) {
            return error;
        }
    }

    async function searchFriends(name) {
        try {
            const response = await apiClient.post(FRIENDS.SEARCH, { name: name });
            friends.value = response.data.friends;
            return response;
        } catch (error) {
            return error;
        }
    }

    function setAuthUser(user) {
        authUser.value = user;
    }

    function setAvatar(av) {
        avatar.value = av;
    }

    function setAuthToken(token) {
        authToken.value = token;
    }

    function setAuthRefToken(token) {
        authRefToken.value = token;
    }

    async function authCheck(isNull=true) {
        try {
            console.log('Checking auth...');
            const response = await apiClient.get(AUTH.CHECK);
            if(response.status === 200 ){
                authUser.value = response.data.user;
                return response;
            }else{
                await logout(isNull);
            }
        } catch (error) {
            return await logout(isNull);
        }
    }

    async function register(data) {
        try {
            const response = await apiClient.post(AUTH.REGISTER, data);
            authUser.value = response.data.user;
            authToken.value = response.data.token;
            localStorage.setItem("dicToken", response.data.token);
            initEcho(authToken.value);
            return response;
        } catch (error) {
            return error;
        }
    }

    async function login(data) {
        try {
            const response = await apiClient.post(AUTH.LOGIN, data);
            authUser.value = response.data.user;
            authToken.value = response.data.token;
            localStorage.setItem("dicToken", response.data.token);
            initEcho(authToken.value);
            return response;
        } catch (error) {
            console.log(error)
         }
    }

    async function logout(isNull=false) {
        authUser.value = null;
        authToken.value = null;
        localStorage.removeItem("dicToken");
        isNull === true ? router.push({ name: "home" }) : null
    }

    async function getLeaderboard() {
        try {
            const stats = await apiClient.get(GAME.LEADERBOARD);
            leaderboard.value = stats.data;
            return stats;
        } catch (error) {
            return error;
        }
    }

    async function changeName(name){
        try {
            const stats = await apiClient.post(AUTH.NAME_CHANGE,{name:name});
            await authCheck(false);
            return stats;
        } catch (error) {
            return error;
        }
    }

    return {
        authUser,
        avatar,
        authToken,
        authRefToken,
        friends,
        friend,
        leaderboard,
        getLeaderboard,
        getFriend,
        searchFriends,
        setAuthUser,
        setAvatar,
        setAuthToken,
        setAuthRefToken,
        authCheck,
        register,
        login,
        logout,
        changeName,
    };
});
