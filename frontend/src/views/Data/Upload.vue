<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import axios from "@/api/axios";
import NavbarDefault from "../../components/NavbarDefault.vue";

// image
import image from "@/assets/img/city-profile.jpg";
// image
import bgContact from "@/assets/img/examples/blog2.jpg";

// tooltip
import setTooltip from "@/assets/js/tooltip";
import { useAuthStore } from "@/stores/auth"; // 引入 store
import CryptoJS from 'crypto-js';

const store = useAuthStore();
const route = useRoute();

// 定义数据集信息和输入框数据
const dataset = ref({
  Title: '',
  Description: '',
  Hash: '',
  IpfsAddress: '',
  N_subset: '',
  Owner: '',
  Price: '',
  Tags: ''
});

const tagsInput = ref('');
const fileInput = ref(null);

// 处理文件上传
const handleFileUpload = async () => {
  const file = fileInput.value.files[0];
  if (file) {
    dataset.value.file = file;
    
    // 基于文件名自动填充数据集名称（去除扩展名）
    const fileName = file.name;
    const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    if (!dataset.value.Title) { // 只在标题为空时自动填充
      dataset.value.Title = nameWithoutExtension;
    }
    
    // 计算文件hash
    try {
      const arrayBuffer = await file.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.SHA256(wordArray).toString();
      dataset.value.Hash = hash;
      console.log('文件hash计算完成:', hash);
      console.log('数据集名称已更新为:', nameWithoutExtension);
    } catch (error) {
      console.error('计算文件hash失败:', error);
      alert('计算文件hash失败，请重试');
    }
  }
};

// 上传数据集
const uploadDataset = async () => {
  const formData = new FormData();
  formData.append('file', dataset.value.file);

  try {
    const response = await axios.post('/uploadFile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // 调试：打印完整的响应数据
    console.log('完整响应:', response.data);
    console.log('result字段:', response.data.result);
    console.log('result类型:', typeof response.data.result);
    
    // 处理响应数据
    const result = response.data.result;
    
    console.log(`hash : ${result.hash}`)
    
    // 将字节数组转换为十六进制字符串
    const hashBytes = result.hash;
    let hexHash = '';
    
    if (typeof hashBytes === 'object' && hashBytes !== null) {
      // 如果是字节数组对象，转换为十六进制字符串
      const byteArray = Object.values(hashBytes);
      hexHash = byteArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
      console.log('转换后的十六进制hash:', hexHash);
    } else {
      // 如果已经是字符串，直接使用
      hexHash = hashBytes;
    }
    
    // 将转换后的hash值赋给IPFS地址字段
    dataset.value.IpfsAddress = hexHash;
    
    alert("文件上传成功,IPFS地址已更新");
  } catch (error) {
    console.error("Error uploading dataset:", error);
    alert("文件上传失败。");
  }
};

// 上架数据集
const listDataset = async () => {
  dataset.value.Tags = JSON.stringify(tagsInput.value.split(','));
  dataset.value.Owner = store.publicKey;
  try {
    const { Title, Description, Hash, IpfsAddress, N_subset, Owner, Price, Tags } = dataset.value;
    console.log(Title);        // 'New Title'
    console.log(Description);  // 'New Description'
    console.log(Hash);         // 'New Hash'
    console.log(IpfsAddress);  // 'New IpfsAddress'
    console.log(N_subset);     // 'New N_subset'
    console.log(Owner);        // 'New Owner'
    console.log(Price);        // 'New Price'
    console.log(Tags);         // 'New Tags'
    await axios.post('/createDataset', {
      Title, Description, Hash, IpfsAddress, N_subset, Owner, Price, Tags
    });
    alert("数据集已成功上架！");
  } catch (error) {
    console.error("Error listing dataset:", error);
    alert("数据集上架失败。");
  }
};


onMounted(() => {

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
                      <h2>科研数据上传和存证</h2>
                      <p class="lead">上传文件并填写数据集信息</p>
                    </div>
                    <div class="card-body pt-4">
                      <div class="row mb-4">
                        <div class="col-12">
                          <div class="upload-area p-4 border border-2 border-dashed rounded-3 text-center bg-light">
                            <div class="upload-icon mb-3">
                              <i class="fas fa-cloud-upload-alt fa-3x text-primary"></i>
                            </div>
                            <div class="upload-btn-wrapper">
                              <input type="file" class="file-input" ref="fileInput" @change="handleFileUpload" id="fileInput" />
                              <label for="fileInput" class="btn btn-primary btn-lg">
                                <i class="fas fa-plus me-2"></i>选择文件
                              </label>
                            </div>
                            <div v-if="dataset.file" class="mt-3 p-2 bg-success bg-opacity-10 rounded">
                              <i class="fas fa-check-circle text-success me-2"></i>
                              <span class="text-success">已选择文件: {{ dataset.file.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>数据集名称</label>
                            <input type="text" class="form-control" placeholder="输入数据集名称" v-model="dataset.Title" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>数据集描述</label>
                            <input type="text" class="form-control" placeholder="输入数据集描述" v-model="dataset.Description" />
                          </div>
                        </div>

                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>Hash</label>
                            <input type="text" class="form-control" placeholder="输入Hash" v-model="dataset.Hash" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>IPFS地址</label>
                            <input type="text" class="form-control" placeholder="IPFS地址"
                              v-model="dataset.IpfsAddress" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>N_subset</label>
                            <input type="text" class="form-control" placeholder="输入N_subset"
                              v-model="dataset.N_subset" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>价格</label>
                            <input type="text" class="form-control" placeholder="输入价格" v-model="dataset.Price" />
                          </div>
                        </div>
                        <div class="col-md-6 pe-2 mb-4">
                          <div class="input-group input-group-static mb-4">
                            <label>标签</label>
                            <input type="text" class="form-control" placeholder="输入标签，用逗号分隔" v-model="tagsInput" />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-md-12 text-end ms-auto">
                          <button type="button" class="btn btn-success mb-0 mx-2" @click="uploadDataset">
                            上传数据集
                          </button>
                          <button type="button" class="btn btn-success mb-0 mx-2" @click="listDataset">
                            上架数据集
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