import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverConfig from './server_config.js'; 
import { initializeContract, getUser, createUser, mint, burn, getDatasetList, getDataset, createDataset, createOrder, getSellOrders, getBuyOrders, getOrder, handleOrder } from './chaincode.mjs';


const app = express();

app.use(cors(serverConfig.corsOptions));
app.use(bodyParser.json());
const contract = initializeContract();

//获取用户
app.get('/getUser', async (req, res) => {
    try {
        const uID = req.query.uID; 
        const result = await getUser(contract, uID);
        res.json({ success: true, result});
    } catch (error) {
        console.error('GetUser fail', error); 
  
      // 尝试创建用户
      try {
        const uID = req.query.uID;
        const createResult = await createUser(contract, uID);
        res.json({ success: true, result: createResult });
      } catch (createError) {
        console.error('CreateUser fail', createError);
        res.status(500).json({ success: false, error: createError.message });
      }
    }
  });
  

// 创建用户
app.post('/createUser', async (req, res) => {
    try {
      const uID = req.query.uID; 
      const result = await createUser(contract, uID);
      res.json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 铸币
app.post('/mint', async (req, res) => {
    try {
        const {uID, value} = req.body;
        await mint(contract, uID, value.toString());
        res.json({ success: true, result: "" });
    } catch (error) {
        console.error('Mint fail', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

  // 销毁
app.post('/burn', async (req, res) => {
    try {
        const {uID, value} = req.body;
        await burn(contract, uID, value.toString());
        res.json({ success: true, result: "" });
    } catch (error) {
        console.error('Burn fail', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 获取所有数据集信息
app.get('/getDatasets', async (req, res) => {
    try {
        const datasetList  = await getDatasetList(contract);
        const datasetIds = datasetList.DatasetIDs;
        const datasets = await Promise.all(datasetIds.map(id => getDataset(contract, id)));     
        res.json({ success: true, datasets});
    } catch (error) {
        console.error('getDatasets fail', error); 
        res.status(500).json({ success: false, error: error.message });
    }
  });

  // 获取单个数据集信息
app.get('/getDataset', async (req, res) => {
    try {
        const id = req.query.id;
        const dataset  = await  getDataset(contract, id);
        res.json({ success: true, dataset});
    } catch (error) {
        console.error('getDataset fail', error); 
        res.status(500).json({ success: false, error: error.message });
    }
  });

// 创建数据集
app.post('/createDataset', async (req, res) => {
    try {
        const {Title, Description, Hash, IpfsAddress, N_subset, Owner, Price, Tags} = req.body;
        console.log(Title, Description, Hash, IpfsAddress, N_subset, Owner, Price, Tags);
        await createDataset(contract, Title, Description, Hash, IpfsAddress, N_subset, Owner, Price, Tags);
        res.json({ success: true, result:"" });
    } catch (error) {
        console.error('CreateDataset fail', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 创建订单
app.post('/createOrder', async (req, res) => {
    try {
        const {buyer, datasetID, payHash} = req.body;
        await createOrder(contract, buyer, datasetID, payHash);
        res.json({ success: true, result:"" });
    } catch (error) {
        console.error('CreateOrder fail', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

// 获取出售订单
app.get('/getSellOrders', async (req, res) => {
    try {
        const uID = req.query.uID; 
        const result = await getUser(contract, uID);
        const orderIDs = result.SellOrderIDs;
        const sellOrders = await Promise.all(orderIDs.map(id => getOrder(contract, id))); 
        res.json({ success: true, sellOrders});
    } catch (error) {
        console.error('GetSellOrders fail', error); 
        res.status(500).json({ success: false, error: error.message });
    }
});
// 获取购买订单
app.get('/getBuyOrders', async (req, res) => {
    try {
        const uID = req.query.uID; 
        const result = await getUser(contract, uID);
        const orderIDs = result.BuyOrderIDs;
        const buyOrders = await Promise.all(orderIDs.map(id => getOrder(contract, id))); 
        res.json({ success: true, buyOrders});
    }catch (error) {
        console.error('GetBuyOrders fail', error);
    }
})

// 获取单个订单
app.get('/getOrder', async (req, res) => {
    try {
        const id = req.query.id;
        const order  = await getOrder(contract, id);
        res.json({ success: true, order});
    } catch (error) {
        console.error('getOrder fail', error); 
        res.status(500).json({ success: false, error: error.message });
    }
})

// 处理订单
app.post('/handleOrder', async (req, res) => {
    try {
        const {orderID, n, payword} = req.body;
        await handleOrder(contract, orderID, n, payword);
        res.json({ success: true, result:"" });
    } catch (error) {
        console.error('HandleOrder fail', error);
        res.status(500).json({ success: false, error: error.message });
    }
})

app.listen(serverConfig.port, () => {
    console.log(`Server is running on port ${serverConfig.port}`);
  });
