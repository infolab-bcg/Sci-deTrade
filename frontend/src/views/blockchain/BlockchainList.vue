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
              科研数据管理平台
            </h1>
            <p class="lead text-white px-5 mt-3" :style="{ fontWeight: '500' }">
              基于区块链的科研数据存证、共享和交易平台
            </p>
          </div>
        </div>
      </div>
    </div>
  </Header>

  <div class="container mt-sm-5 mt-3">
    <div class="row">
      <div class="col-12">
        <h3 class="mb-4">区块链网络</h3>
        <div class="row">
          <div 
            class="col-md-4 mb-4" 
            v-for="blockchain in blockchains" 
            :key="blockchain.id"
          >
            <div 
              class="card h-100 shadow-sm cursor-pointer" 
              @click="navigateToDataset(blockchain.name)"
              style="cursor: pointer;"
            >
              <div class="card-body">
                <h5 class="card-title">{{ blockchain.fullName }}</h5>
                <p class="card-text text-muted">{{ blockchain.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import NavbarDefault from "../../components/NavbarDefault.vue";

import vueMkHeader from "@/assets/img/vue-mk-header.jpg";
import axios from "@/api/axios";

const router = useRouter();
const body = document.getElementsByTagName("body")[0];
const blockchains = ref([]);

// 获取区块链数据
const fetchData = async () => {
  try {
    const response = await axios.get('/getblockchains');
    blockchains.value = response.data.blockchains;
  } catch (error) {
    console.error('获取区块链列表失败', error);
  }
};

// 导航到数据集页面
const navigateToDataset = (blockchainName) => {
  router.push(`/publicDataset/${blockchainName}`);
};

onMounted(() => {
  body.classList.add("presentation-page");
  body.classList.add("bg-gray-200");
  fetchData();
});

onUnmounted(() => {
  body.classList.remove("presentation-page");
  body.classList.remove("bg-gray-200");
});
</script>