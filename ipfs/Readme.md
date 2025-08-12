# IPFS

## 安装

```bash
wget https://dist.ipfs.tech/kubo/v0.36.0/kubo_v0.36.0_linux-amd64.tar.gz
```

```bash
tar -xvzf kubo_v0.36.0_linux-amd64.tar.gz
```

```bash
cd kubo
sudo bash install.sh
```

## 初始化

```bash
export IPFS_PATH=$(pwd)/.ipfs && ipfs init
```

编辑config文件

> note: 注意将192.168.8.22换成主机内网ip地址

```bash
ipfs config Addresses.API "/ip4/0.0.0.0/tcp/5001"
ipfs config Addresses.Gateway "/ip4/0.0.0.0/tcp/8080"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://192.168.8.22:5001", "http://localhost:3000", "http://127.0.0.1:5001", "https://webui.ipfs.io"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST"]' 
```

```bash
ipfs daemon
```