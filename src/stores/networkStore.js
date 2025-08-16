// src/stores/networkStore.js
import { defineStore } from 'pinia'
import { ref, onMounted, onUnmounted } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  // 默认在线状态为浏览器初始值
  const isOnline = ref(navigator.onLine)

  // 更新状态的函数
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
    console.log(`网络状态变更为: ${isOnline.value ? '在线' : '离线'}`)
  }

  // 在 Store 被激活时，添加事件监听器
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  // 在 Store 被卸载时，移除事件监听器，防止内存泄漏
  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return { isOnline }
})
