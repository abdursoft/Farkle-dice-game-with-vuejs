<script setup>
const emit = defineEmits(['click'])

const props = defineProps({
  title: {
    type: String
  },
  type: {
    type: String,
    default: "button"
  },
  background: {
    type: String,
    default: "bg-cyan-600 hover:bg-red-400 duration-[500ms]"
  }
})
</script>

<template>
  <div class="w-full px-2 flex items-center justify-center">
    <button
      class="btn btn-block text-center rounded-[20px] min-h-[55px] px-10 text-white mt-3 py-2 w-full flex items-center justify-center gap-5 cursor-pointer"
      :class="background" :type="props.type" @click="emit('click')">
      {{ props.title }}
    </button>
  </div>
</template>