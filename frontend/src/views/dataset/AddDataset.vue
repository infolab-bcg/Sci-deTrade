<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import axios from "@/api/axios";
import NavbarDefault from "../../components/NavbarDefault.vue";

// image
import image from "@/assets/img/city-profile.jpg";
// image
import bgContact from "@/assets/img/examples/blog2.jpg";

import { useAuthStore } from "@/stores/auth"; // 引入 store
import CryptoJS from 'crypto-js';

const store = useAuthStore();
const userName = ref('');
const route = useRoute();
const error = ref('');
const selectedIsPublic = ref(true);

// 区块链列表
const blockchains = ref([]);
const selectedBlockchain = ref('');

const fileInput = ref(null);

// 数据集信息
const dataset = ref({
  name: '',
  fullName: '',
  description: '',
  hash: '',
  ipfsAddress: '',
  file: null
});

// 处理文件上传并计算hash
const handleFileUpload = async () => {
  const file = fileInput.value.files[0];
  if (file) {
    dataset.value.file = file;

    // 基于文件名自动填充数据集名称（去除扩展名）
    const fileName = file.name;
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    if (!dataset.value.name) { // 只在标题为空时自动填充
      dataset.value.name = nameWithoutExtension;
    }

    // 计算文件hash
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      dataset.value.hash = hash;
      console.log('文件hash计算完成:', hash);
      console.log('数据集名称已更新为:', nameWithoutExtension);
    } catch (error) {
      console.error('计算文件hash失败:', error);
      alert('计算文件hash失败，请重试');
    }
  }
};

// 获取区块链列表
const fetchBlockchains = async () => {
  try {
    const response = await axios.get('/getblockchains');
    blockchains.value = response.data.blockchains;
    console.log('获取区块链列表成功:', blockchains.value);
  } catch (error) {
    console.error('获取区块链列表失败:', error);
    alert('获取区块链列表失败，请刷新页面重试');
  }
};

// 生成随机字符串
const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成测试用例数据
const generateTestCase = () => {
  const randomId = generateRandomString(8);

  // 填充数据集信息
  dataset.value.name = `测试数据集_${randomId}`;
  dataset.value.fullName = `完整测试数据集名称_${randomId}`;
  dataset.value.description = `这是一个测试数据集的描述信息_${generateRandomString(15)}`;
  dataset.value.ipfsAddress = `QmTest${generateRandomString(20)}`;

  // 生成模拟hash
  dataset.value.hash = generateRandomString(64);

  // 选择第一个区块链（如果存在）
  if (blockchains.value.length > 0) {
    selectedBlockchain.value = blockchains.value[0].name;
  }

  // 默认选择公开
  selectedIsPublic.value = true;

  console.log('测试用例已生成:', dataset.value);
};

// 上传数据集到区块链
const uploadDataset = async () => {
  // 验证必填字段
  if (!dataset.value.name) {
    alert('请输入数据集名称');
    return;
  }
  if (!dataset.value.description) {
    alert('请输入数据集描述');
    return;
  }
  if (!dataset.value.hash) {
    alert('请先选择文件以计算Hash');
    return;
  }
  if (!selectedBlockchain.value) {
    alert('请选择要存证的区块链');
    return;
  }

  try {
    const requestData = {
      name: dataset.value.name,
      fullName: dataset.value.fullName,
      description: dataset.value.description,
      owner: userName.value,
      isPublic: selectedIsPublic.value,
      hash: dataset.value.hash,
      ipfsAddress: dataset.value.ipfsAddress
    };

    console.log('上传数据集请求:', requestData);

    const response = await axios.post(`/addDataset/${selectedBlockchain.value}`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      alert('数据集存证成功！');
      // 重置表单
      dataset.value = {
        name: '',
        fullName: '',
        description: '',
        hash: '',
        ipfsAddress: '',
        file: null
      };
      selectedBlockchain.value = '';
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    } else {
      alert('数据集存证失败: ' + (response.data.message || '未知错误'));
    }
  } catch (error) {
    console.error('上传数据集失败:', error);
    alert('上传数据集失败: ' + (error.response?.data?.message || error.message));
  }
};

onMounted(() => {
  if (store.isLoggedIn && store.username) {
    userName.value = store.username;
    fetchBlockchains();
  } else {
    error.value = '用户未登录或用户信息获取失败';
    console.error('用户未登录或用户信息获取失败');
  }

});
</script>



<template>
  <div class="container position-sticky z-index-sticky top-0">
    <div class="row">
      <div class="col-12">
        <NavbarDefault :sticky="true" />
      </div>
    </div>
  </div>

  <Header>
    <div class="page-header min-height-200" :style="`background-image: url(${image})`" loading="lazy">
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </Header>

  <div class="card card-body blur shadow-blur mx-3 mx-md-7 mt-n6">
    <section class="py-lg-4">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="card box-shadow-xl overflow-hidden mb-5">
              <div class="row">
                <div class="col-lg-3 position-relative bg-cover px-0" :style="{ backgroundImage: `url(${bgContact})` }"
                  loading="lazy">
                  <div class="z-index-2 text-center d-flex h-100 w-100 d-flex m-auto justify-content-center">
                    <div class="mask bg-gradient-dark opacity-8"></div>
                    <div class="p-5 ps-sm-8 position-relative text-start my-auto z-index-2">
                    </div>
                  </div>
                </div>
                <div class="col-lg-7">
                  <form class="p-3" id="dataset-form" method="post">
                    <div class="card-header px-4 py-sm-5 py-3">
                      <h2>科研数据集-存证</h2>
                      <p class="lead">计算科研数据集摘要，并上传到区块链存证</p>
                    </div>
                    <div class="card-body pt-4">
                      <div class="row mb-4">
                        <div class="col-12">
                          <div class="upload-area p-4 border border-2 border-dashed rounded-3 text-center bg-light">
                            <div class="upload-icon mb-3">
                              <i class="fas fa-cloud-upload-alt fa-3x text-primary"></i>
                            </div>
                            <div class="upload-btn-wrapper">
                              <input type="file" class="file-input" ref="fileInput" @change="handleFileUpload"
                                id="fileInput" />
                              <label for="fileInput" class="btn btn-primary btn-lg">
                                <i class="fas fa-plus me-2"></i>选择文件计算Hash
                              </label>
                            </div>
                            <div v-if="dataset.file" class="mt-3 p-2 bg-success bg-opacity-10 rounded">
                              <i class="fas fa-check-circle text-success me-2"></i>
                              <span class="text-success">已选择文件: {{ dataset.file.name }}</span>
                            </div>
                            <div v-if="dataset.hash" class="mt-2 p-2 bg-info bg-opacity-10 rounded">
                              <i class="fas fa-hashtag text-info me-2"></i>
                              <span class="text-info">Hash: {{ dataset.hash.substring(0, 20) }}...</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>数据集名称</label>
                            <input type="text" class="form-control" placeholder="输入数据集名称" v-model="dataset.name" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>数据集全称</label>
                            <input type="text" class="form-control" placeholder="输入数据集全称" v-model="dataset.fullName" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>数据集描述</label>
                            <input type="text" class="form-control" placeholder="输入数据集描述"
                              v-model="dataset.description" />
                          </div>
                        </div>

                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>Hash</label>
                            <input type="text" class="form-control" placeholder="选择文件后自动计算" v-model="dataset.hash"
                              readonly />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>IPFS地址</label>
                            <input type="text" class="form-control" placeholder="输入IPFS地址（可选）"
                              v-model="dataset.ipfsAddress" />
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6 pe-2 mb-4">
                        <div class="input-group input-group-static mb-4">
                          <label>选择区块链网络</label>
                          <select class="form-control" v-model="selectedBlockchain" required>
                            <option value="" disabled>可访问的区块链</option>
                            <option v-for="blockchain in blockchains" :key="blockchain.id" :value="blockchain.name">
                              {{ blockchain.fullName }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-md-6 pe-2 mb-4">
                        <div class="input-group input-group-static mb-4">
                          <label>选择是否公开数据集</label>
                          <select class="form-control" v-model="selectedIsPublic" required>
                            <!-- 公开和私有两种选项 -->
                            <option value=true>公开</option>
                            <option value=false>私有</option>
                          </select>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12 text-end ms-auto">
                          <button type="button" class="btn btn-info mb-0 mx-2" @click="generateTestCase">
                            <i class="fas fa-magic me-2"></i>生成测试用例
                          </button>
                          <button type="button" class="btn btn-success mb-0 mx-2" @click="uploadDataset">
                            存证
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.upload-area {
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #007bff !important;
  background-color: #f8f9ff !important;
}

.file-input {
  display: none;
}

.upload-btn-wrapper {
  position: relative;
}

.upload-btn-wrapper label {
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn-wrapper label:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.upload-icon {
  opacity: 0.7;
}

.upload-area:hover .upload-icon {
  opacity: 1;
  transform: scale(1.05);
  transition: all 0.3s ease;
}
</style>