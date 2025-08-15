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
              编辑数据集
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              {{ blockchainName }} - {{ datasetName }}
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
          <h3 class="mb-0">编辑数据集</h3>
          <button class="btn btn-outline-primary" @click="goBack">
            <i class="fas fa-arrow-left me-2"></i>返回
          </button>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">加载中...</span>
          </div>
          <p class="mt-3 text-muted">正在加载数据集详情...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="alert alert-danger" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ error }}
        </div>

        <!-- 数据集编辑界面 -->
        <div v-else-if="dataset" class="row">
          <!-- 左侧：数据集信息编辑 -->
          <div class="col-lg-8">
            <div class="card shadow-sm mb-4">
              <div class="card-body">
                <!-- 数据集名称作为主标题 -->
                <div class="mb-4">
                  <h2 class="text-primary mb-3">{{ dataset.name }}</h2>
                  <div class="d-flex flex-wrap gap-1 mb-3">
                    <span v-if="dataset.isPublic" class="badge bg-success">公开</span>
                    <span v-else class="badge bg-secondary">私有</span>
                    <span v-if="dataset.canMaskingShare" class="badge bg-info">可脱敏共享</span>
                    <span v-if="dataset.canCustomMaskingTrade" class="badge bg-warning">可定制脱敏交易</span>
                    <span v-if="dataset.canDataService" class="badge bg-primary">可验证数据服务</span>
                  </div>
                </div>

                <!-- 基本信息 -->
                <div class="row mb-4">
                  <div class="col-md-6">
                    <p class="mb-2">
                      <strong><i class="fas fa-user me-2 text-primary"></i>所有者：</strong>
                      <span class="text-muted">{{ dataset.owner }}</span>
                    </p>
                    <p class="mb-2">
                      <strong><i class="fas fa-link me-2 text-primary"></i>区块链：</strong>
                      <span class="text-muted">{{ blockchainName }}</span>
                    </p>
                  </div>
                  <div class="col-md-6">
                    <p class="mb-2">
                      <strong><i class="fas fa-calendar-alt me-2 text-primary"></i>创建时间：</strong>
                      <span class="text-muted">{{ formatDate(dataset.created_at) }}</span>
                    </p>
                    <p class="mb-2">
                      <strong><i class="fas fa-calendar-alt me-2 text-primary"></i>更新时间：</strong>
                      <span class="text-muted">{{ formatDate(dataset.updated_at) }}</span>
                    </p>
                  </div>
                </div>

                <!-- 可编辑字段 -->
                <div class="mb-4">
                  <label for="fullName" class="form-label">
                    <strong><i class="fas fa-tag me-2 text-primary"></i>完整名称</strong>
                  </label>
                  <div class="input-group">
                    <input 
                      id="fullName"
                      v-model="editForm.fullName" 
                      type="text" 
                      class="form-control" 
                      placeholder="请输入数据集完整名称"
                    />
                    <button 
                      class="btn btn-dark" 
                      type="button" 
                      @click="updateDatasetInfo"
                      :disabled="updating"
                    >
                      <i class="fas fa-save me-2"></i>
                      {{ updating ? '更新中...' : '更新数据集信息' }}
                    </button>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="description" class="form-label">
                    <strong><i class="fas fa-info-circle me-2 text-primary"></i>描述</strong>
                  </label>
                  <textarea 
                    id="description"
                    v-model="editForm.description" 
                    class="form-control" 
                    rows="4" 
                    placeholder="请输入数据集描述"
                  ></textarea>
                </div>

                <!-- 哈希信息 -->
                <div class="mb-4">
                  <label for="hash" class="form-label">
                    <strong><i class="fas fa-fingerprint me-2 text-primary"></i>哈希</strong>
                  </label>
                  <div class="input-group">
                    <input 
                      id="hash"
                      v-model="editForm.hash" 
                      type="text" 
                      class="form-control font-monospace" 
                      placeholder="请输入数据集哈希值"
                    />
                    <button 
                      class="btn btn-primary" 
                      type="button" 
                      @click="updateDatasetHash"
                      :disabled="updating"
                    >
                      <i class="fas fa-sync me-2"></i>
                      {{ updating ? '更新中...' : '更新哈希' }}
                    </button>
                  </div>
                </div>

                <!-- IPFS地址 -->
                <div class="mb-4">
                  <label for="ipfsAddress" class="form-label">
                    <strong><i class="fas fa-globe me-2 text-primary"></i>脱敏数据集IPFS地址</strong>
                  </label>
                  <div class="input-group">
                    <input 
                      id="ipfsAddress"
                      v-model="editForm.maskingDatasetIPFSAddress" 
                      type="text" 
                      class="form-control font-monospace" 
                      placeholder="请输入脱敏数据集IPFS地址"
                    />
                    <button 
                      class="btn btn-success" 
                      type="button" 
                      @click="updateMaskingDatasetIPFSAddress"
                      :disabled="updating"
                    >
                      <i class="fas fa-cloud-upload-alt me-2"></i>
                      {{ updating ? '更新中...' : '更新IPFS地址' }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- 右侧：功能操作区域 -->
          <div class="col-lg-4">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="fas fa-tools me-2"></i>数据集功能管理
                </h5>
              </div>
              <div class="card-body">
                <!-- 数据集公开/私有设置 -->
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="fw-bold">数据集可见性：</span>
                    <span :class="dataset.isPublic ? 'badge bg-success' : 'badge bg-secondary'">
                      {{ dataset.isPublic ? '公开' : '私有' }}
                    </span>
                  </div>
                  <button 
                    v-if="dataset.isPublic"
                    class="btn btn-danger w-100" 
                    @click="setToPrivate"
                    :disabled="functionUpdating"
                  >
                    <i class="fas fa-lock me-2"></i>
                    设置为私有
                  </button>
                  <small v-if="dataset.isPublic" class="text-muted d-block mt-1">
                    将数据集设为私有并关闭所有共享功能
                  </small>
                  <div v-else class="text-muted text-center py-2">
                    <i class="fas fa-info-circle me-1"></i>
                    数据集当前为私有状态
                  </div>
                </div>

                <hr class="my-4">

                <!-- 脱敏共享功能 -->
                <div class="mb-3">
                  <button 
                    :class="dataset.canMaskingShare ? 'btn btn-danger w-100' : 'btn btn-success w-100'" 
                    @click="toggleMaskingShare"
                    :disabled="functionUpdating"
                  >
                    <i :class="dataset.canMaskingShare ? 'fas fa-times me-2' : 'fas fa-shield-alt me-2'"></i>
                    {{ dataset.canMaskingShare ? '关闭脱敏共享' : '开启脱敏共享' }}
                  </button>
                  <small class="text-muted d-block mt-1">
                    {{ dataset.canMaskingShare ? '停止其他用户访问脱敏数据集' : '允许其他用户访问脱敏后的数据集' }}
                  </small>
                </div>

                <!-- 定制脱敏交易功能 -->
                <div class="mb-3">
                  <button 
                    :class="dataset.canCustomMaskingTrade ? 'btn btn-danger w-100' : 'btn btn-warning w-100'" 
                    @click="toggleCustomMaskingTrade"
                    :disabled="functionUpdating"
                  >
                    <i :class="dataset.canCustomMaskingTrade ? 'fas fa-times me-2' : 'fas fa-handshake me-2'"></i>
                    {{ dataset.canCustomMaskingTrade ? '关闭定制脱敏交易' : '开启定制脱敏交易' }}
                  </button>
                  <small class="text-muted d-block mt-1">
                    {{ dataset.canCustomMaskingTrade ? '停止接受定制化数据脱敏服务请求' : '允许用户请求定制化的数据脱敏服务' }}
                  </small>
                </div>

                <!-- 数据服务功能 -->
                <div class="mb-3">
                  <button 
                    :class="dataset.canDataService ? 'btn btn-danger w-100' : 'btn btn-info w-100'" 
                    @click="toggleDataService"
                    :disabled="functionUpdating"
                  >
                    <i :class="dataset.canDataService ? 'fas fa-times me-2' : 'fas fa-server me-2'"></i>
                    {{ dataset.canDataService ? '关闭数据服务' : '开启数据服务' }}
                  </button>
                  <small class="text-muted d-block mt-1">
                    {{ dataset.canDataService ? '停止提供数据验证和查询服务' : '提供基于数据的验证和查询服务' }}
                  </small>
                </div>

                <!-- 功能状态说明 -->
                <div class="mt-4 p-3 bg-light rounded">
                  <h6 class="mb-2"><i class="fas fa-info-circle me-2"></i>当前功能状态</h6>
                  <div class="d-flex flex-column gap-1">
                    <div class="d-flex justify-content-between">
                      <span>数据集状态：</span>
                      <span :class="dataset.isPublic ? 'text-success' : 'text-muted'">
                        {{ dataset.isPublic ? '公开' : '私有' }}
                      </span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>脱敏共享：</span>
                      <span :class="dataset.canMaskingShare ? 'text-success' : 'text-muted'">
                        {{ dataset.canMaskingShare ? '已开启' : '未开启' }}
                      </span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>定制交易：</span>
                      <span :class="dataset.canCustomMaskingTrade ? 'text-success' : 'text-muted'">
                        {{ dataset.canCustomMaskingTrade ? '已开启' : '未开启' }}
                      </span>
                    </div>
                    <div class="d-flex justify-content-between">
                      <span>数据服务：</span>
                      <span :class="dataset.canDataService ? 'text-success' : 'text-muted'">
                        {{ dataset.canDataService ? '已开启' : '未开启' }}
                      </span>
                    </div>
                  </div>
                </div>
            
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-5">
          <i class="fas fa-database fa-3x text-muted mb-3"></i>
          <h4 class="text-muted">数据集未找到</h4>
          <p class="text-muted">请检查数据集名称和区块链名称是否正确</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted,inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NavbarDefault from "../../components/NavbarDefault.vue";
import Header from "../../examples/Header.vue";

import vueMkHeader from "@/assets/img/vue-mk-header.jpg";
import axios from "@/api/axios";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const body = document.getElementsByTagName("body")[0];
const $notify = inject('$notify');

// 响应式数据
const blockchainName = ref('');
const datasetName = ref('');
const dataset = ref(null);
const loading = ref(false);
const error = ref('');
const updating = ref(false);
const functionUpdating = ref(false);

// 编辑表单
const editForm = ref({
  fullName: '',
  description: '',
  hash: '',
  maskingDatasetIPFSAddress: ''
});

// 获取数据集详情
const fetchDatasetDetails = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const response = await axios.get(`/getDatasetByDatasetName/${blockchainName.value}/${datasetName.value}`);
    if (response.data.success && response.data.data) {
      dataset.value = response.data.data;
      // 初始化编辑表单
      editForm.value.fullName = dataset.value.fullName || '';
      editForm.value.description = dataset.value.description || '';
      editForm.value.hash = dataset.value.hash || '';
      editForm.value.maskingDatasetIPFSAddress = dataset.value.maskingDatasetIPFSAddress || '';
    } else {
      error.value = response.data.message || '数据集获取失败';
    }
  } catch (err) {
    console.error('获取数据集详情失败', err);
    $notify.error('网络错误，请稍后重试');
    error.value = '网络错误，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.go(-1);
};

// 更新数据集信息
const updateDatasetInfo = async () => {
  if (!editForm.value.fullName.trim()) {
    alert('请输入完整名称');
    return;
  }

  updating.value = true;
  
  try {
    const response = await axios.post(`/updateDatasetInfo/${blockchainName.value}/${datasetName.value}`, {
      fullName: editForm.value.fullName,
      description: editForm.value.description
    });
    
    if (response.data.success) {
      // 使用后端返回的更新后数据
      if (response.data.data) {
        dataset.value = { ...dataset.value, ...response.data.data };
        // 同步更新编辑表单
        editForm.value.fullName = dataset.value.fullName || '';
        editForm.value.description = dataset.value.description || '';
        editForm.value.hash = dataset.value.hash || '';
        editForm.value.maskingDatasetIPFSAddress = dataset.value.maskingDatasetIPFSAddress || '';
      }
      $notify.success('数据集信息更新成功');
      console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
    } else {
      $notify.error('数据集信息更新失败：' + response.data.message);
    }
  } catch (err) {
    console.error('更新数据集信息失败', err);
    alert('网络错误，请稍后重试');
  } finally {
    updating.value = false;
  }
};

// 切换脱敏共享功能
const toggleMaskingShare = async () => {
  const newState = !dataset.value.canMaskingShare;
  const action = newState ? '开启' : '关闭';
  
  if (confirm(`确定要${action}脱敏共享功能吗？`)) {
    functionUpdating.value = true;
    
    try {
      const response = await axios.post(`/updateDatasetPublicLevel/${blockchainName.value}/${datasetName.value}`, {
        isPublic: newState ? true : dataset.value.isPublic, // 开启时自动设为公开
        canMaskingShare: newState,
        canCustomMaskingTrade: dataset.value.canCustomMaskingTrade,
        canDataService: dataset.value.canDataService
      });
      
      if (response.data.success) {
        // 使用后端返回的更新后数据
        if (response.data.data) {
          dataset.value = { ...dataset.value, ...response.data.data };
        } else {
          dataset.value.canMaskingShare = newState;
          if (newState) dataset.value.isPublic = true;
        }
        $notify.success(`脱敏共享功能已${action}`);
        console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
      } else {
        $notify.error(`脱敏共享功能${action}失败：` + response.data.message);
      }
    } catch (err) {
      console.error(`${action}脱敏共享功能失败`, err);
      $notify.error('网络错误，请稍后重试');
    } finally {
      functionUpdating.value = false;
    }
  }
};

// 切换定制脱敏交易功能
const toggleCustomMaskingTrade = async () => {
  const newState = !dataset.value.canCustomMaskingTrade;
  const action = newState ? '开启' : '关闭';
  
  if (confirm(`确定要${action}定制脱敏交易功能吗？`)) {
    functionUpdating.value = true;
    
    try {
      const response = await axios.post(`/updateDatasetPublicLevel/${blockchainName.value}/${datasetName.value}`, {
        isPublic: newState ? true : dataset.value.isPublic, // 开启时自动设为公开
        canMaskingShare: dataset.value.canMaskingShare,
        canCustomMaskingTrade: newState,
        canDataService: dataset.value.canDataService
      });
      
      if (response.data.success) {
        // 使用后端返回的更新后数据
        if (response.data.data) {
          dataset.value = { ...dataset.value, ...response.data.data };
        } else {
          dataset.value.canCustomMaskingTrade = newState;
          if (newState) dataset.value.isPublic = true;
        }
        $notify.success(`定制脱敏交易功能已${action}`);
        console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
      } else {
        $notify.error(`定制脱敏交易功能${action}失败：` + response.data.message);
      }
    } catch (err) {
      console.error(`${action}定制脱敏交易功能失败`, err);
      $notify.error('网络错误，请稍后重试');
    } finally {
      functionUpdating.value = false;
    }
  }
};

// 切换数据服务功能
const toggleDataService = async () => {
  const newState = !dataset.value.canDataService;
  const action = newState ? '开启' : '关闭';
  
  if (confirm(`确定要${action}数据服务功能吗？`)) {
    functionUpdating.value = true;
    
    try {
      const response = await axios.post(`/updateDatasetPublicLevel/${blockchainName.value}/${datasetName.value}`, {
        isPublic: newState ? true : dataset.value.isPublic, // 开启时自动设为公开
        canMaskingShare: dataset.value.canMaskingShare,
        canCustomMaskingTrade: dataset.value.canCustomMaskingTrade,
        canDataService: newState
      });
      
      if (response.data.success) {
        // 使用后端返回的更新后数据
        if (response.data.data) {
          dataset.value = { ...dataset.value, ...response.data.data };
        } else {
          dataset.value.canDataService = newState;
          if (newState) dataset.value.isPublic = true;
        }
        $notify.success(`数据服务功能已${action}`);
        console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
      } else {
        $notify.error(`数据服务功能${action}失败：` + response.data.message);
      }
    } catch (err) {
      console.error(`${action}数据服务功能失败`, err);
      $notify.error('网络错误，请稍后重试');
    } finally {
      functionUpdating.value = false;
    }
  }
};

// 设置数据集为私有（关闭所有功能）
const setToPrivate = async () => {
  if (confirm('确定要将数据集设置为私有吗？这将关闭所有共享功能（脱敏共享、定制交易、数据服务）。')) {
    functionUpdating.value = true;
    
    try {
      const response = await axios.post(`/updateDatasetPublicLevel/${blockchainName.value}/${datasetName.value}`, {
        isPublic: false,
        canMaskingShare: false,
        canCustomMaskingTrade: false,
        canDataService: false
      });
      
      if (response.data.success) {
        // 使用后端返回的更新后数据
        if (response.data.data) {
          dataset.value = { ...dataset.value, ...response.data.data };
        } else {
          // 降级处理：手动更新所有字段
          dataset.value.isPublic = false;
          dataset.value.canMaskingShare = false;
          dataset.value.canCustomMaskingTrade = false;
          dataset.value.canDataService = false;
        }
        $notify.success('数据集已设置为私有，所有共享功能已关闭');
        console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
      } else {
        $notify.error('设置私有失败：' + response.data.message);
      }
    } catch (err) {
      console.error('设置数据集为私有失败', err);
      $notify.error('网络错误，请稍后重试');
    } finally {
      functionUpdating.value = false;
    }
  }
};

// 更新数据集哈希
const updateDatasetHash = async () => {
  if (!editForm.value.hash.trim()) {
    alert('请输入哈希值');
    return;
  }

  updating.value = true;
  
  try {
    const response = await axios.post(`/updateDatasetHash/${blockchainName.value}/${datasetName.value}`, {
      hash: editForm.value.hash
    });
    
    if (response.data.success) {
      // 使用后端返回的更新后数据
      if (response.data.data) {
        dataset.value = { ...dataset.value, ...response.data.data };
        // 同步更新编辑表单
        editForm.value.hash = dataset.value.hash || '';
      }
      $notify.success('数据集哈希更新成功');
      console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
    } else {
      $notify.error('数据集哈希更新失败：' + response.data.message);
    }
  } catch (err) {
    console.error('更新数据集哈希失败', err);
    alert('网络错误，请稍后重试');
  } finally {
    updating.value = false;
  }
};

// 更新脱敏数据集IPFS地址
const updateMaskingDatasetIPFSAddress = async () => {
  if (!editForm.value.maskingDatasetIPFSAddress.trim()) {
    alert('请输入IPFS地址');
    return;
  }

  updating.value = true;
  
  try {
    const response = await axios.post(`/updateMaskingDatasetIPFSAddress/${blockchainName.value}/${datasetName.value}`, {
      maskingDatasetIPFSAddress: editForm.value.maskingDatasetIPFSAddress
    });
    
    if (response.data.success) {
      // 使用后端返回的更新后数据
      if (response.data.data) {
        dataset.value = { ...dataset.value, ...response.data.data };
        // 同步更新编辑表单
        editForm.value.maskingDatasetIPFSAddress = dataset.value.maskingDatasetIPFSAddress || '';
      }
      $notify.success('脱敏数据集IPFS地址更新成功');
      console.log(`更新后的数据集: ${JSON.stringify(response.data.data, null, 2)}`);
    } else {
      $notify.error('脱敏数据集IPFS地址更新失败：' + response.data.message);
    }
  } catch (err) {
    console.error('更新脱敏数据集IPFS地址失败', err);
    alert('网络错误，请稍后重试');
  } finally {
    updating.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN');
};

onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
  
  // 从路由参数获取区块链名称和数据集名称
  blockchainName.value = route.params.blockchainName || '';
  datasetName.value = route.params.name || '';
  
  if (blockchainName.value && datasetName.value) {
    fetchDatasetDetails();
  } else {
    error.value = '缺少必要的参数：区块链名称或数据集名称';
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

/* 按钮样式 */
.btn {
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

/* 输入组样式 */
.input-group .form-control {
  border-radius: 0.375rem 0 0 0.375rem;
}

.input-group .btn {
  border-radius: 0 0.375rem 0.375rem 0;
}

/* 卡片头部样式 */
.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

/* 表单样式 */
.form-control {
  border-radius: 0.375rem;
  border: 1px solid #ced4da;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* 功能状态区域样式 */
.bg-light {
  background-color: #f8f9fa !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .badge {
    font-size: 0.65rem;
    padding: 0.25em 0.5em;
  }
  
  .gap-1 > * {
    margin-right: 0.125rem !important;
  }
  
  .btn {
    font-size: 0.9rem;
  }
  
  .col-lg-8, .col-lg-4 {
    margin-bottom: 1rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .input-group .form-control {
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }
  
  .input-group .btn {
    border-radius: 0.375rem;
  }
}

/* 操作按钮特殊样式 */
.btn-info {
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
  border-color: #117a8b;
}

.btn-warning {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background-color: #e0a800;
  border-color: #d39e00;
  color: #212529;
}

/* 禁用按钮样式 */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 等宽字体 */
.font-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
  word-break: break-all;
}
</style>