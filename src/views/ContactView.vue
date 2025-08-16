<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1 class="text-center mb-4">联系我们</h1>
        <p class="text-center text-muted mb-5">如果您有任何问题或需要帮助，请填写下表。我们会尽快处理。</p>

        <!-- 权限检查：未登录时显示提示 -->
        <div v-if="!authStore.isLoggedIn" class="alert alert-warning">
          请<router-link to="/login">登录</router-link>后才能使用此功能。
        </div>

        <!-- 主表单：登录后显示 -->
        <form v-else @submit.prevent="handleSubmit">
          <!-- 主题 -->
          <div class="mb-3">
            <label for="subject" class="form-label">主题</label>
            <input type="text" id="subject" class="form-control" v-model="subject" required>
          </div>

          <!-- 消息内容 -->
          <div class="mb-3">
            <label for="message" class="form-label">消息内容</label>
            <textarea id="message" class="form-control" rows="5" v-model="message" required></textarea>
          </div>

          <!-- 附件功能已彻底移除 -->

          <!-- 提交按钮 -->
          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              {{ isLoading ? '正在发送...' : '发送消息' }}
            </button>
          </div>

          <!-- 状态消息反馈 -->
          <div v-if="statusMessage" class="alert mt-4" :class="statusIsError ? 'alert-danger' : 'alert-success'">
            {{ statusMessage }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

// 表单数据绑定
const subject = ref('');
const message = ref('');

// UI状态控制
const isLoading = ref(false);
const statusMessage = ref('');
const statusIsError = ref(false);

// **最终的、模拟的提交处理函数**
const handleSubmit = () => {
  // 1. 基础的前端验证
  if (!subject.value || !message.value) {
    statusMessage.value = '主题和消息内容不能为空。';
    statusIsError.value = true;
    return;
  }

  // 2. 开始加载状态
  isLoading.value = true;
  statusMessage.value = '';
  statusIsError.value = false;

  // 3. 使用 setTimeout 模拟一个短暂的网络延迟，让体验更真实
  setTimeout(() => {
    // 4. 停止加载状态
    isLoading.value = false;

    // 5. 显示成功消息
    statusMessage.value = '消息已成功发送！感谢您的反馈。';
    statusIsError.value = false;

    // 6. 清空表单
    subject.value = '';
    message.value = '';

  }, 1000); // 模拟1秒的延迟
};
</script>
