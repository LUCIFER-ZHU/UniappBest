<script lang="ts" setup>
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: '',
  },
})

const value = ref<number>(Date.now())
function handleConfirm({ value }) {
  console.log(value)
  console.log(new Date(value))
}
</script>

<template>
  <view class="">
    <wd-datetime-picker v-model="value" label="日期选择" @confirm="handleConfirm" />
  </view>
</template>

<style lang="scss" scoped>
//
</style>
