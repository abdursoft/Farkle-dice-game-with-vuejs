<script setup>
import { Icon } from '@iconify/vue';

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
    default: "bg-orange-600 hover:bg-orange-400 duration-[500ms]"
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  }
})


</script>

<template>
  <div class="w-full px-2 flex items-center justify-center">
    <button
      class="btn btn-block text-center rounded-[20px] min-h-[45px] px-10 text-white mt-3 py-2 w-full flex items-center justify-center gap-5 cursor-pointer shadow-md"
      :class="props.background" :type="props.type" @click="$emit('click')">
      {{ props.title }}
      <Icon v-if="props.icon && !props.loading" :icon="props.icon" width="30" height="30"></Icon>
      <Icon icon="svg-spinners:3-dots-move" v-if="props.loading" class="text-white" width="38" height="38" />
    </button>
  </div>
</template>