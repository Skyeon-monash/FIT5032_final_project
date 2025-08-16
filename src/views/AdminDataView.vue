<template>
  <div class="container py-5">
    <h1 class="mb-4">Admin Data Panel</h1>

    <!-- First table: User Management -->
    <div class="card shadow-sm mb-5">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">User Management</h5>
        <!-- Clicking the button passes the original, clean usersData constant -->
        <button class="btn btn-sm btn-outline-success" @click="exportToCSV(usersData, 'users.csv')">
          <i class="bi bi-download me-2"></i>Export as CSV
        </button>
      </div>
      <div class="card-body">
        <vue-good-table :columns="userColumns" :rows="users" :pagination-options="{
          enabled: true,
          perPage: 10,
        }" :search-options="{
          enabled: true,
          placeholder: 'Search user data...',
        }" theme="bootstrap" />
      </div>
    </div>

    <!-- Second table: Article Management -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Article Management</h5>
        <!-- Clicking the button passes the original, clean articlesData constant -->
        <button class="btn btn-sm btn-outline-success" @click="exportToCSV(articlesData, 'articles.csv')">
          <i class="bi bi-download me-2"></i>Export as CSV
        </button>
      </div>
      <div class="card-body">
        <vue-good-table :columns="articleColumns" :rows="articles" :pagination-options="{
          enabled: true,
          perPage: 10,
        }" :search-options="{
          enabled: true,
          placeholder: 'Search article data...',
        }" theme="bootstrap" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { VueGoodTable } from 'vue-good-table-next';
import Papa from 'papaparse';

// Import mock data (pure, non-reactive arrays)
import usersData from '../../mock-data/users.json';
import articlesData from '../../mock-data/articles-admin.json';

// -- User table config --
const users = ref(usersData);
const userColumns = ref([
  { label: 'Name', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Role', field: 'role' },
  {
    label: 'Join Date',
    field: 'join_date',
    type: 'date',
    dateInputFormat: 'MM/dd/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
]);

// -- Article table config --
const articles = ref(articlesData);
const articleColumns = ref([
  { label: 'Title', field: 'title' },
  { label: 'Author', field: 'author' },
  {
    label: 'Publish Date',
    field: 'publish_date',
    type: 'date',
    dateInputFormat: 'MM/dd/yyyy',
    dateOutputFormat: 'yyyy-MM-dd',
  },
  { label: 'Rating Count', field: 'rating_count', type: 'number' },
]);

// -- Export function --
const exportToCSV = (data, filename) => {
  if (!data || !Array.isArray(data)) {
    console.error("Export failed: provided data is invalid or not an array.");
    return;
  }

  try {
    const csv = Papa.unparse(data);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
  }
};
</script>

<style>
.vgt-table {
  font-size: 0.9rem;
}

.vgt-global-search {
  padding: 10px 0;
}
</style>
