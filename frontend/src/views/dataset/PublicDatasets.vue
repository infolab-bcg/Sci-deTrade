<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>

  <Header>
    <div class="page-header min-vh-50" :style="`background-image: url(${vueMkHeader})`" loading="lazy">
      <div class="container">
        <div class="row">
          <div class="col-lg-7 text-center mx-auto position-relative">
            <h1 class="text-white pt-3 mt-n5 me-2" :style="{ display: 'inline-block ' }">
              {{ blockchainName }} 数据集
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              {{ blockchainName }} 区块链上的公开数据集
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>

  <div class="container mt-sm-5 mt-3">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="mb-0">公开数据集</h3>
          <button class="btn btn-outline-primary" @click="goBack">
            <i class="fas fa-arrow-left me-2"></i>返回区块链列表
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
          <p class="mt-3 text-muted">正在加载数据集...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- 数据集列表 -->
        <div v-else-if="datasets.length > 0" class="row">
          <div 
            class="col-md-6 col-lg-4 mb-4" 
            v-for="dataset in datasets" 
            :key="dataset.id"
          >
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="card-title mb-0">{{ dataset.fullName || dataset.name }}</h5>
                  <div class="d-flex flex-wrap gap-1">
                    <span v-if="dataset.isPublic" class="badge bg-success">公开</span>
                    <span v-if="dataset.canMaskingShare" class="badge bg-info">可脱敏共享</span>
                    <span v-if="dataset.canCustomMaskingTrade" class="badge bg-warning">可定制脱敏交易</span>
                    <span v-if="dataset.canDataService" class="badge bg-primary">可验证数据服务</span>
                  </div>
                </div>
                <p class="card-text text-muted mb-3">{{ dataset.description }}</p>
                
                <!-- 标签说明区域 -->
                <div v-if="dataset.canMaskingShare || dataset.canCustomMaskingTrade || dataset.canDataService" class="mb-3">
                  <div class="d-flex flex-wrap gap-2 small text-muted">
                    <div v-if="dataset.canMaskingShare" class="d-flex align-items-center">
                      <i class="fas fa-shield-alt me-1"></i>
                      <span>支持脱敏共享</span>
                    </div>
                    <div v-if="dataset.canCustomMaskingTrade" class="d-flex align-items-center">
                      <i class="fas fa-exchange-alt me-1"></i>
                      <span>支持定制交易</span>
                    </div>
                    <div v-if="dataset.canDataService" class="d-flex align-items-center">
                      <i class="fas fa-check-circle me-1"></i>
                      <span>支持数据验证</span>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">
                    <i class="fas fa-database me-1"></i>
                    {{ dataset.name }}
                  </small>
                  <button class="btn btn-sm btn-primary" @click="viewDataset(dataset)">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-5">
          <i class="fas fa-database fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">暂无公开数据集</h4>
          <p class="text-muted">{{ blockchainName }} 区块链上还没有公开的数据集</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import NavbarDefault from "../../components/NavbarDefault.vue";

import vueMkHeader from "@/assets/img/vue-mk-header.jpg";
import axios from "@/api/axios";

const router = useRouter();
const route = useRoute();
const body = document.getElementsByTagName("body")[0];

// 响应式数据
const blockchainName = ref('');
const datasets = ref([]);
const loading = ref(false);
const error = ref('');

// 获取数据集数据
const fetchDatasets = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axios.get(`/getPublicDatasets/${blockchainName.value}`);
    if (response.data.success) {
      datasets.value = response.data.data || [];
    } else {
      error.value = response.data.message || '获取数据集失败';
    }
  } catch (err) {
    console.error('获取数据集列表失败', err);
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 返回区块链列表
const goBack = () => {
  router.push('/blockchainList');
};

// 查看数据集详情
const viewDataset = (dataset) => {
  // 这里可以跳转到数据集详情页面或显示详情模态框
  console.log('查看数据集详情:', dataset);
  router.push(`/dataset/${blockchainName.value}/${dataset.name}`);
};

onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
  
  // 从路由参数获取区块链名称
  const routeBlockchainName = route.params.blockchainName;
  if (routeBlockchainName) {
    blockchainName.value = routeBlockchainName;
    fetchDatasets();
  } else {
    error.value = '未指定区块链名称';
  }
});

onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* 标签样式优化 */
.badge {
  font-size: 0.7rem;
  padding: 0.35em 0.65em;
  border-radius: 0.375rem;
}

.gap-1 > * {
  margin-right: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

.gap-2 > * {
  margin-right: 0.5rem !important;
  margin-bottom: 0.25rem !important;
}

/* 标签说明区域样式 */
.small {
  font-size: 0.875rem;
}

/* 响应式标签布局 */
@media (max-width: 576px) {
  .badge {
    font-size: 0.65rem;
    padding: 0.25em 0.5em;
  }
  
  .gap-1 > * {
    margin-right: 0.125rem !important;
  }
}
</style>