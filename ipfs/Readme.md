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

```bash
sed -i 's|"API": "/ip4/.*/tcp/5001"|"API": "/ip4/0.0.0.0/tcp/5001"|g' ./.ipfs/config
sed -i 's|"Gateway": "/ip4/.*/tcp/8080"|"Gateway": "/ip4/0.0.0.0/tcp/8080"|g' ./.ipfs/config
```

```bash
ipfs daemon
```