<script setup>
const props = defineProps({
  dice: Array,
  rolling: Boolean,
  dieFace: Function
})
const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
    <button
      v-for="(d, idx) in dice"
      :key="d.id"
      class="aspect-square rounded-2xl flex items-center justify-center text-4xl select-none shadow border"
      :class="[
        d.kept ? 'bg-emerald-50 border-emerald-200' : d.selected ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200',
        rolling ? 'animate-pulse' : ''
      ]"
      @click="emit('toggle', idx)"
      :disabled="d.kept"
    >
      {{ dieFace(d.value) }}
    </button>
  </div>
</template>
