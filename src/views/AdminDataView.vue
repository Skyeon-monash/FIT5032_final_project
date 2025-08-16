<template>
  <div class="container py-5">
    <h1 class="mb-4">管理员数据面板</h1>

    <!-- 第一个表格：用户管理 -->
    <div class="card shadow-sm mb-5">
      <div class="card-header">
        <h5 class="mb-0">用户管理</h5>
      </div>
      <div class="card-body">
        <vue-good-table :columns="userColumns" :rows="users" :pagination-options="{
          enabled: true,
          perPage: 10,
        }" :search-options="{
          enabled: true,
          placeholder: '搜索用户数据...',
        }" theme="bootstrap" />
      </div>
    </div>

    <!-- 第二个表格：文章管理 -->
    <div class="card shadow-sm">
      <div class="card-header">
        <h5 class="mb-0">文章管理</h5>
      </div>
      <div class="card-body">
        <vue-good-table :columns="articleColumns" :rows="articles" :pagination-options="{
          enabled: true,
          perPage: 10,
        }" :search-options="{
          enabled: true,
          placeholder: '搜索文章数据...',
        }" theme="bootstrap" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 导入 Vue Good Table 组件和它的 CSS
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

// 导入模拟数据
import usersData from '../../mock-data/users.json';
import articlesData from '../../mock-data/articles-admin.json';

// -- 用户表格配置 --
const users = ref(usersData);
const userColumns = ref([
  { label: '姓名', field: 'name' },
  { label: '邮箱', field: 'email' },
  { label: '角色', field: 'role' },
  {
    label: '加入日期',
    field: 'join_date',
    type: 'date',
    // **MODIFIED: 添加这两个格式定义**
    dateInputFormat: 'MM/dd/yyyy',  // 假设 Mockaroo 生成的是 月/日/年 格式
    dateOutputFormat: 'yyyy-MM-dd'    // 我们希望显示为 年-月-日 格式
  },
]);

// -- 文章表格配置 --
const articles = ref(articlesData);
const articleColumns = ref([
  { label: '标题', field: 'title' },
  { label: '作者', field: 'author' },
  {
    label: '发布日期',
    field: 'publish_date',
    type: 'date',
    // **MODIFIED: 添加这两个格式定义**
    dateInputFormat: 'MM/dd/yyyy',  // 假设 Mockaroo 生成的是 月/日/年 格式
    dateOutputFormat: 'yyyy-MM-dd'    // 我们希望显示为 年-月-日 格式
  },
  { label: '评分数', field: 'rating_count', type: 'number' },
]);
</script>

<style>
/* vue-good-table-next 会自带一些样式，我们可以进行微调 */
.vgt-table {
  font-size: 0.9rem;
}

.vgt-global-search {
  padding: 10px 0;
}
</style>
