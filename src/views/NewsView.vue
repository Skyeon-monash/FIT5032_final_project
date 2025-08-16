<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5">健康资讯中心</h1>
      <p class="lead text-muted">学习最新的健康知识，拥抱更美好的晚年生活。</p>
    </div>

    <!-- ADDED: 离线数据显示提示 -->
    <div v-if="isOfflineData" class="alert alert-info">
      <i class="bi bi-info-circle-fill me-2"></i>
      网络连接已断开。以下为离线缓存内容。
    </div>

    <div v-if="articles.length > 0" class="row">
      <div v-for="article in articles" :key="article.id" class="col-lg-4 col-md-6 mb-4 d-flex align-items-stretch">
        <ArticleCard :article="article" />
      </div>
    </div>

    <div v-else class="text-center">
      <p>{{ loadingMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNetworkStore } from '@/stores/networkStore';
import ArticleCard from '@/components/ArticleCard.vue';
import db from '../../db.json'; // 依然使用本地 JSON 作为数据源

const articles = ref([]);
const networkStore = useNetworkStore();
const isOfflineData = ref(false); // 标记当前数据是否来自缓存
const loadingMessage = ref('正在加载文章...');
const STORAGE_KEY = 'health-charity-articles'; // 定义一个 Local Storage 的键

onMounted(() => {
  if (networkStore.isOnline) {
    // --- 在线逻辑 ---
    console.log("在线状态，从'服务器'获取数据...");
    isOfflineData.value = false;

    // 模拟异步 API 请求
    setTimeout(() => {
      // 1. 获取数据
      const freshArticles = db.articles;
      articles.value = freshArticles;

      // 2. 将新数据存入 Local Storage 缓存
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(freshArticles));
        console.log("文章数据已成功缓存到 Local Storage。");
      } catch (e) {
        console.error("缓存文章数据失败:", e);
      }

    }, 500);
  } else {
    // --- 离线逻辑 ---
    console.log("离线状态，尝试从 Local Storage 加载缓存...");
    try {
      const cachedArticles = localStorage.getItem(STORAGE_KEY);
      if (cachedArticles) {
        articles.value = JSON.parse(cachedArticles);
        isOfflineData.value = true;
        console.log("成功从缓存加载文章数据。");
      } else {
        loadingMessage.value = '无网络连接，且没有可用的离线内容。';
      }
    } catch (e) {
      console.error("加载缓存数据失败:", e);
      loadingMessage.value = '加载离线内容时出错。';
    }
  }
});
</script>
