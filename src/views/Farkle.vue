<script setup>
import FRoll from '@/components/farkle/FRoll.vue';
import { primaryLight } from '@/services/colors';

</script>

<template>
    <div class="w-full flex items-center justify-center min-h-screen" :style="`background: ${primaryLight}`">
        <div class="w-full flex items-center justify-center h-[100vh] max-w-[445px]" >
            <FRoll />
        </div>
    </div>
</template>