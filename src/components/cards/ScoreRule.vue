<script setup>
import Dice1 from '@/assets/icons/white/dice1.svg';
import Dice2 from '@/assets/icons/white/dice2.svg';
import Dice3 from '@/assets/icons/white/dice3.svg';
import Dice4 from '@/assets/icons/white/dice4.svg';
import Dice5 from '@/assets/icons/white/dice5.svg';
import Dice6 from '@/assets/icons/white/dice6.svg';
</script>

<template>
    <div class="w-full flex justify-between gap-2 bg-amber-600 rounded-md p-1 max-h-[200px] overflow-y-auto">
        <div class="w-[85px]">
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice1 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">100</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice5 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">50</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice1 class="w-[20px] h-[20px]"/>
                    <Dice1 class="w-[20px] h-[20px]"/>
                    <Dice1 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">1000</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice2 class="w-[20px] h-[20px]"/>
                    <Dice2 class="w-[20px] h-[20px]"/>
                    <Dice2 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">200</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice3 class="w-[20px] h-[20px]"/>
                    <Dice3 class="w-[20px] h-[20px]"/>
                    <Dice3 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">300</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice4 class="w-[20px] h-[20px]"/>
                    <Dice4 class="w-[20px] h-[20px]"/>
                    <Dice4 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">400</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice5 class="w-[20px] h-[20px]"/>
                    <Dice5 class="w-[20px] h-[20px]"/>
                    <Dice5 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">500</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <div class="flex items-center">
                    <Dice6 class="w-[20px] h-[20px]"/>
                    <Dice6 class="w-[20px] h-[20px]"/>
                    <Dice6 class="w-[20px] h-[20px]"/>
                </div>
                <p class="text-[11px]">600</p>
            </div>
        </div>
        <div class="flex-1">
            <div class="w-full px-2">
                <div class="w-full flex items-center justify-between">
                <p class="text-[12px] font-semibold text-amber-800">Super Scores</p>
                <p class="text-amber-500"></p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">Four of kind</p>
                <p class="text-amber-500">1000</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">Five of a kind</p>
                <p class="text-amber-500">2000</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">Six of a kind</p>
                <p class="text-amber-500">3000</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">1-6 straight</p>
                <p class="text-amber-500">1500</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">3 pairs</p>
                <p >1500</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">4 of a kind + 1 pair</p>
                <p class="text-amber-500">1500</p>
            </div>
            <div class="w-full flex items-center justify-between">
                <p class="text-[11px] text-white">2 Triples</p>
                <p class="text-amber-500">2500</p>
            </div>
            </div>
        </div>
    </div>
</template>