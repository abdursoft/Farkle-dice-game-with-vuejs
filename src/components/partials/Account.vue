<template>
    <div class="w-full">
        <div class="w-full p-3 flex flex-col gap-5">
            <select id="" class="w-full bg-[#C39C7F] text-white p-3 rounded-xl text-center">
                <option value="en">English</option>
                <option value="bn">Bengali</option>
                <option value="hn">Hindi</option>
                <option value="fr">French</option>
            </select>
            <router-link class="text-2xl lilita bg-orange-400 rounded-2xl p-2 text-white text-center"
                :to="{ name: 'lobby' }">PLAY</router-link>
            <router-link class="text-2xl lilita bg-[#749DCB] rounded-2xl p-2 text-white text-center"
                :to="{ name: 'register' }">SIGN UP</router-link>
        </div>

        <div class="w-full mt-15 text-center">
            <router-link class="w-full text-lg underline text-center mt-15" :to="{ name: 'register' }">Already singed
                up?</router-link>
        </div>
    </div>
</template>