<!--
  Test2 同步组件
  @description 演示同步注册的全局组件，组件会在应用启动时立即加载并注册
-->
<template>
  <view class="test2-container">
    <text class="test2-title">Test2 同步组件</text>
    <text class="test2-desc">这是一个同步注册的全局组件，在应用启动时立即可用</text>
    <view class="test2-content">
      <text>计数器: {{ count }}</text>
      <button class="test2-btn" @click="increment">
        点击+1
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * 组件状态
 */
// 计数器状态
const count = ref(0)

/**
 * 增加计数器
 * @description 点击按钮时增加计数器值
 */
function increment(): void {
  count.value++
}
</script>

<style scoped>
.test2-container {
  padding: 20px;
  border: 2px solid #42b983;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.test2-title {
  font-size: 18px;
  font-weight: bold;
  color: #42b983;
  display: block;
  margin-bottom: 10px;
}

.test2-desc {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 15px;
}

.test2-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.test2-btn {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.test2-btn:hover {
  background-color: #369970;
}
</style>
