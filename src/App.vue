<!-- src/App.vue -->
<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- ADDED: 离线提示横幅 -->
    <div v-if="!networkStore.isOnline" class="offline-banner text-white bg-warning text-center py-2">
      <i class="bi bi-wifi-off me-2"></i>
      您当前处于离线状态，部分功能可能无法使用。
    </div>

    <AppHeader />

    <main class="flex-grow-1">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>


<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import { useNetworkStore } from './stores/networkStore';

// 实例化 network store 以激活事件监听
const networkStore = useNetworkStore();
</script>

<style>
/* 你可以在这里添加一些全局样式 */
body {
  /* 可以为老年用户设置一个更舒适的默认字体大小 */
  font-size: 18px;
}

.offline-banner {
  position: sticky;
  top: 0;
  z-index: 2000;
  /* 确保在最顶层 */
  font-weight: 500;
}
</style>
