<script setup>
import GameVS from '@/components/game/GameVS.vue';
import { primary } from '@/services/colors';

</script>

<template>
    <div class="w-full flex items-center justify-center min-h-screen" :style="`background: ${primary}`">
        <GameVS />
    </div>
</template>