<template>
  <div class="p-1 w-full">
    <label class="my-2">{{ label }}</label>
    <div class="w-full relative">
      <input :type="type" v-model="model" :placeholder="placeholder"
        class="w-full rounded-[12px] p-3 border border-black-500 pr-[35px] text-left" />
    </div>
    <div class="small-text text-red-500" v-if="msg">{{ msg }}</div>
  </div>
</template>

<script setup>


const model = defineModel({
  type: null,
  required: true,
})

defineProps({
  label: {
    type: String,
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String,
  msg: String
});
</script>