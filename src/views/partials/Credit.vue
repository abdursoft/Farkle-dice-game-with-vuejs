<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="px-2 text-white">
    <div class="w-full flex items-center justify-between">
        <h2 class="float-right text-lg font-bold">Credits</h2>
        <h2 class="float-right text-lg font-bold">Total: 2200</h2>
    </div>

    <!--Credit purchase-->
    <div class="w-full flex items-center justify-between gap-3 mt-2 mb-5">
      <input
        type="number"
        step="1"
        class="flex-1 p-2 rounded-lg border-1 border-gray-800 focus:outline-1"
        placeholder="1500"
      />
      <Icon
        icon="iconoir:plus"
        width="44"
        height="44"
        class="cursor-pointer p-2 rounded-full bg-gray-800 hover:bg-gray-600"
      />
    </div>

    <!--Credit history-->
    <h2 class="text-white text-lg md:text-xl px-2 mb-2">Credit History</h2>
    <div class="px-2 space-y-2"> 
        <div v-for="(item, index) in 10" :key="index" class="bg-slate-900 p-2 rounded-lg text-white flex items-center justify-between">
            <div>
                <p class="text-base">01892311511</p>
                <p class="text-[11px]">21 May 2025</p>
            </div>
            <div>
                <p class="text-base">$200</p>
                <p class="text-[11px]">payout</p>
            </div>
        </div>
    </div>
  </div>
</template>
