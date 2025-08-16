<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1 class="text-center mb-4">联系我们</h1>
        <p class="text-center text-muted mb-5">如果您有任何问题或需要帮助，请填写下表。我们会尽快回复您。</p>

        <div v-if="!authStore.isLoggedIn" class="alert alert-warning">
          请<router-link to="/login">登录</router-link>后才能使用此功能。
        </div>

        <form v-else @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label for="subject" class="form-label">主题</label>
            <input type="text" id="subject" class="form-control" v-model="subject" required>
          </div>
          <div class="mb-3">
            <label for="message" class="form-label">消息内容</label>
            <textarea id="message" class="form-control" rows="5" v-model="message" required></textarea>
          </div>

          <!-- 附件输入框已移除 -->

          <div class="d-grid">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
              {{ isLoading ? '正在发送...' : '发送消息' }}
            </button>
          </div>
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
const subject = ref('');
const message = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const statusIsError = ref(false);

const handleSubmit = async () => {
  if (!subject.value || !message.value) {
    statusMessage.value = '主题和消息内容不能为空。';
    statusIsError.value = true;
    return;
  }
  isLoading.value = true;
  statusMessage.value = '';
  statusIsError.value = false;

  try {
    const sendEmailUrl = 'https://sendemail-redsecilhb.cn-hongkong.fcapp.run'; // <--- **🔴 在此处粘贴您的函数URL**

    const response = await fetch(sendEmailUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*', // 模拟浏览器常见的 Accept 头
      },
      body: JSON.stringify({
        subject: subject.value,
        message: message.value,
        userEmail: authStore.user.email,
      }),
      mode: 'cors', // 明确指定为跨域模式
    });

    const resultBodyText = await response.text();
    const result = JSON.parse(resultBodyText);


    if (!response.ok || !result.success) {
      // 如果是 403，提供更具体的提示
      if (response.status === 403) {
        throw new Error("请求被服务器拒绝 (403 Forbidden)，请检查函数触发器是否为匿名访问，或联系管理员检查防火墙策略。");
      }
      throw new Error(result.message || '邮件发送失败');
    }

    statusMessage.value = result.message;
    statusIsError.value = false;
    subject.value = '';
    message.value = '';

  } catch (error) {
    console.error("前端调用失败:", error);
    statusMessage.value = `操作失败: ${error.message}`;
    statusIsError.value = true;
  } finally {
    isLoading.value = false;
  }
};
</script>
