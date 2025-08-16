<template>
  <div class="container-fluid vh-100 p-0 d-flex flex-column">
    <!-- 顶部控制面板 -->
    <div class="control-panel bg-light p-3 shadow-sm" style="z-index: 1000;">
      <h4 class="mb-3">附近服务查询 (OSM)</h4>
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="输入地址或地点..." v-model="searchQuery"
          @keyup.enter="searchLocation">
        <button class="btn btn-primary" @click="searchLocation" :disabled="isLoading">
          <span v-if="isLoading && loadingAction === 'search'" class="spinner-border spinner-border-sm"></span>
          搜索
        </button>
      </div>
      <button class="btn btn-success w-100" @click="findNearbyClinics" :disabled="!centerMarker || isLoading">
        <span v-if="isLoading && loadingAction === 'nearby'" class="spinner-border spinner-border-sm"></span>
        查找附近的诊所
      </button>
      <div v-if="errorMessage" class="alert alert-danger mt-3 mb-0">{{ errorMessage }}</div>
    </div>

    <!-- 地图容器 -->
    <div style="height: 100%; width: 100%">
      <l-map ref="map" v-model:zoom="zoom" :center="mapCenter">
        <!-- OpenStreetMap 图层 -->
        <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
          name="OpenStreetMap"></l-tile-layer>

        <!-- 中心点标记 -->
        <l-marker v-if="centerMarker" :lat-lng="centerMarker">
          <l-tooltip>搜索的位置</l-tooltip>
        </l-marker>

        <!-- 附近地点标记 -->
        <l-marker v-for="place in nearbyPlaces" :key="place.place_id" :lat-lng="[place.lat, place.lon]">
          <l-popup>{{ place.display_name }}</l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// 导入 vue-leaflet 组件和 Leaflet 的 CSS
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "@vue-leaflet/vue-leaflet";

// -- 地图状态 --
const zoom = ref(13);
const mapCenter = ref([-37.8136, 144.9631]); // 默认中心：墨尔本
const centerMarker = ref(null); // [lat, lng]
const nearbyPlaces = ref([]);

// -- UI 状态 --
const searchQuery = ref('Flinders Street Station, Melbourne');
const isLoading = ref(false);
const loadingAction = ref('');
const errorMessage = ref('');

// **功能一：地点搜索与标记 (使用 Nominatim API)**
const searchLocation = async () => {
  if (!searchQuery.value) return;
  isLoading.value = true;
  loadingAction.value = 'search';
  errorMessage.value = '';
  nearbyPlaces.value = [];

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery.value)}&format=json&limit=1`);
    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      const location = [parseFloat(result.lat), parseFloat(result.lon)];
      mapCenter.value = location;
      centerMarker.value = location;
      zoom.value = 15;
    } else {
      errorMessage.value = "找不到该地址，请尝试更具体的名称。";
    }
  } catch (error) {
    console.error("Nominatim 搜索失败:", error);
    errorMessage.value = "搜索时发生错误，请检查网络连接。";
  } finally {
    isLoading.value = false;
    loadingAction.value = '';
  }
};

// **功能二：周边搜索 (使用 Nominatim API)**
const findNearbyClinics = async () => {
  if (!centerMarker.value) return;
  isLoading.value = true;
  loadingAction.value = 'nearby';
  errorMessage.value = '';
  nearbyPlaces.value = [];

  try {
    // Nominatim 不直接支持半径搜索，但我们可以用 "bounded" search 配合 viewbox
    // 更简单的方式是直接搜索 "clinic near [searchQuery]"
    const nearQuery = `clinic near ${searchQuery.value}`;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(nearQuery)}&format=json&limit=10`);
    const data = await response.json();

    if (data && data.length > 0) {
      nearbyPlaces.value = data;
    } else {
      errorMessage.value = "附近未找到相关诊所或医院。";
    }
  } catch (error) {
    console.error("Nominatim 周边搜索失败:", error);
    errorMessage.value = "查找附近服务时发生错误。";
  } finally {
    isLoading.value = false;
    loadingAction.value = '';
  }
};
</script>

<style scoped>
.control-panel {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 350px;
  max-width: 90%;
  border-radius: 8px;
}

.container-fluid {
  position: relative;
}
</style>
