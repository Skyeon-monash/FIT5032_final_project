<template>
  <div class="container py-5">
    <h1 class="mb-4">Admin Dashboard</h1>
    <p class="text-muted mb-5">Welcome back, Admin! Here’s an overview of key site data.</p>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading data...</span>
      </div>
      <p class="mt-2">Loading data...</p>
    </div>

    <!-- Data cards -->
    <div v-else class="row">
      <!-- Total Users Card -->
      <div class="col-md-4 mb-4">
        <div class="card text-white bg-primary shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title fs-2">{{ totalUsers }}</h5>
                <p class="card-text">Total Registered Users</p>
              </div>
              <i class="bi bi-people-fill fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Count Card -->
      <div class="col-md-4 mb-4">
        <div class="card text-white bg-danger shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title fs-2">{{ adminCount }}</h5>
                <p class="card-text">Number of Admins</p>
              </div>
              <i class="bi bi-person-workspace fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Regular User Count Card -->
      <div class="col-md-4 mb-4">
        <div class="card text-white bg-success shadow-sm h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h5 class="card-title fs-2">{{ regularUserCount }}</h5>
                <p class="card-text">Number of Regular Users</p>
              </div>
              <i class="bi bi-person-fill fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-danger mt-4">
      Error loading data: {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

// UI state
const isLoading = ref(true);
const errorMessage = ref('');

// Data state
const totalUsers = ref(0);
const adminCount = ref(0);
const regularUserCount = ref(0);

// Fetch data when component mounts
onMounted(async () => {
  try {
    // 1. Reference to the users collection
    const usersCollectionRef = collection(db, 'users');

    // 2. Get all documents in the collection
    const querySnapshot = await getDocs(usersCollectionRef);

    // 3. Count total users
    totalUsers.value = querySnapshot.size;

    // 4. Count users by role
    let admins = 0;
    let regulars = 0;
    querySnapshot.forEach((doc) => {
      const user = doc.data();
      if (user.role === 'admin') {
        admins++;
      } else {
        regulars++;
      }
    });
    adminCount.value = admins;
    regularUserCount.value = regulars;

  } catch (error) {
    console.error("Failed to fetch user data:", error);
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Minor card styling */
.card-body i {
  transition: transform 0.2s ease-in-out;
}

.card:hover .card-body i {
  transform: scale(1.1);
}
</style>
