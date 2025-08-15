import { getAllBlockchains } from './blockchainList.mjs';
import { initDatasetTable, deleteDatasetTable, addDataset, deleteDataset, getAllDatasets, getPublicDatasets, updateMaskingDatasetIPFSAddress, getDatasetsByOwner, getDatasetByDatasetName, updateDatasetInfo, updateDatasetPublicLevel } from './database/datasetTable.mjs';
import logger from './log.mjs';
import { generateIPFSCID } from './utils.mjs';

export async function initDatasetTables() {
    try {
        // 获取所有区块链name
        const getResponse = await getAllBlockchains();
        const blockchains = getResponse.blockchains;
        for (const blockchain of blockchains) {
            await initDatasetTable(blockchain.name);
            logger.debug(`初始化数据集表 for blockchain: ${blockchain.name} success`);
        }
        logger.debug('初始化数据集表成功');
    } catch (error) {
        logger.error('初始化数据集表失败:', error);
    }
}

export async function deleteDatasetTables() {
    try {
        // 获取所有区块链name
        const getResponse = await getAllBlockchains();
        const blockchains = getResponse.blockchains;
        for (const blockchain of blockchains) {
            await deleteDatasetTable(blockchain.name);
            logger.debug(`删除数据集表 for blockchain: ${blockchain.name} success`);
        }
        logger.debug('删除数据集表成功');
    } catch (error) {
        logger.error('删除数据集表失败:', error);
    }
}



export async function handleAddDataset(req, res) {
    try {
        const { blockchainName } = req.params;
        const { name, fullName, description, owner, isPublic = false, canMaskingShare = false, canCustomMaskingTrade = false, canDataService = false, maskingDatasetIPFSAddress = '' } = req.body;
        await addDataset(blockchainName, name, fullName, description, owner, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService, maskingDatasetIPFSAddress);
        logger.debug(`创建数据集 for blockchain: ${blockchainName} success`);
        res.json({ success: true, message: '数据集创建成功' })
    } catch (error) {
        logger.error(`创建数据集 for blockchain: ${blockchainName} failed: ${error}`);
        res.json({ success: false, message: '数据集创建失败' });
    }
}

export async function handleDeleteDataset(req, res) {
    try {
        const { blockchainName, name } = req.body;
        await deleteDataset(blockchainName, name);
        logger.debug(`删除数据集 for blockchain: ${blockchainName} success`);
        res.json({ success: true, message: '数据集删除成功' })
    } catch (error) {
        logger.error(`删除数据集 for blockchain: ${blockchainName} failed: ${error}`);
        res.json({ success: false, message: '数据集删除失败' });
    }
}

export async function handleGetAllDatasets(req, res) {
    try {
        const { blockchainName } = req.body;
        const result = await getAllDatasets(blockchainName);
        logger.debug(`获取所有数据集 for blockchain: ${blockchainName} success`);
        res.json({ success: true, message: '数据集获取成功', data: result })
    } catch (error) {
        logger.error(`获取所有数据集 for blockchain: ${blockchainName} failed: ${error}`);
        res.json({ success: false, message: '数据集获取失败' });
    }
}

export async function handleGetPublicDatasets(req, res) {
    try {
        const { blockchainName } = req.params;
        const result = await getPublicDatasets(blockchainName);
        logger.debug(`获取所有公开数据集 for blockchain: ${blockchainName} success`);
        res.json({ success: true, message: '公开数据集获取成功', data: result })
    } catch (error) {
        logger.error(`获取所有公开数据集 for blockchain: ${blockchainName} failed: ${error}`);
        res.json({ success: false, message: '公开数据集获取失败' });
    }
}


export async function handleUpdateMaskingDatasetIPFSAddress(req, res) {
    try {
        const { blockchainName, name, maskingDatasetIPFSAddress } = req.body;
        await updateMaskingDatasetIPFSAddress(blockchainName, name, maskingDatasetIPFSAddress);
        res.json({ success: true, message: '数据集IPFS地址更新成功' })
    } catch (error) {
        res.json({ success: false, message: '数据集IPFS地址更新失败', error });
    }
}

export async function handleGetDatasetByOwner(req, res) {
    try {
        const { blockchainName, owner } = req.body;
        const result = await getDatasetByOwner(blockchainName, owner);
        res.json({ success: true, message: '数据集获取成功', data: result })
    } catch (error) {
        res.json({ success: false, message: '数据集获取失败', error });
    }
}

export async function handleGetDatasetsByUsername(req, res) {
    try {
        const { name } = req.params;
        // 遍历所有dataset表
        const response = await getAllBlockchains();
        const blockchains = response.blockchains;
        const datasets = [];
        for (const blockchain of blockchains) {
            const results = await getDatasetsByOwner(blockchain.name, name);
            // 遍历results列表，给每一项添加blockchainName 
            for (const result of results){
                result.blockchainName = blockchain.name;
            }
            // logger.debug(`getDatasetsByOwner: ${JSON.stringify(results, null, 2)}`)
            datasets.push(...results)
        }
        res.json({ success: true, message: '数据集获取成功', data: datasets })
    } catch (error) {
        res.json({ success: false, message: '数据集获取失败', error });
    }
}

export async function handleGetDatasetByDatasetName(req, res) {
    try {
        const { blockchainName, name } = req.params;
        const result = await getDatasetByDatasetName(blockchainName, name);
        res.json({ success: true, message: '数据集获取成功', data: result })
    } catch (error) {
        res.json({ success: false, message: '数据集获取失败', error });
    }
}

export async function handleUpdateDatasetInfo(req, res) {
    try {
        const { blockchainName, name } = req.params;
        const { fullName, description } = req.body;
        const updatedDataset = await updateDatasetInfo(blockchainName, name, fullName, description);
        res.json({ success: true, message: '数据集信息更新成功', data: updatedDataset })
    } catch (error) {
        res.json({ success: false, message: '数据集信息更新失败', error });
    }
}

export async function handleUpdateDatasetPublicLevel(req, res) {
    try {
        const { blockchainName, name } = req.params;
        const { isPublic, canMaskingShare, canCustomMaskingTrade, canDataService } = req.body;
        logger.debug(`handleUpdateDatasetPublicLevel: ${JSON.stringify({ blockchainName, name, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService }, null, 2)}`)
        const updatedDataset = await updateDatasetPublicLevel(blockchainName, name, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService);
        res.json({ success: true, message: '数据集公开级别更新成功', data: updatedDataset })
    } catch (error) {
        res.json({ success: false, message: '数据集公开级别更新失败', error });
    }
}

export async function addDemoDatasets() {
    try {
        // Physics 物理学数据集
        await addDataset('Physics', 'quantum_mechanics', '量子力学实验数据集', '包含量子态测量、量子纠缠和量子隧道效应的实验数据，用于量子物理研究和量子计算开发', 'demoDataOwner', true, true, true, true, await generateIPFSCID());
        await addDataset('Physics', 'particle_physics', '粒子物理碰撞数据', '高能粒子对撞实验数据，包含希格斯玻色子、夸克和轻子的探测记录，支持标准模型验证研究', 'demoDataOwner', true, true, true, false, await generateIPFSCID());
        await addDataset('Physics', 'astrophysics', '天体物理观测数据', '包含恒星光谱、星系红移、引力波信号等天文观测数据，用于宇宙学和相对论研究', 'demoDataOwner', true, true, false, false, await generateIPFSCID());
        await addDataset('Physics', 'condensed_matter', '凝聚态物理材料数据', '固体材料的电子结构、磁性、超导性质测量数据，支持新材料设计和相变研究', 'demoDataOwner', false, false, false, false, await generateIPFSCID());
        await addDataset('Physics', 'plasma_physics', '等离子体物理数据', '托卡马克装置、激光等离子体相互作用的实验数据，用于核聚变和等离子体控制研究', 'demoDataOwner', true, true, false, true, await generateIPFSCID());
        await addDataset('Physics', 'optics_photonics', '光学与光子学数据', '激光物理、非线性光学、量子光学实验数据，包含光子纠缠和光学器件特性测量', 'demoDataOwner', true, false, true, false, await generateIPFSCID());

        // Biology 生物学数据集
        await addDataset('Biology', 'genomics', '基因组学数据集', '包含人类、动植物基因组序列、基因表达谱和遗传变异数据，支持进化生物学和疾病基因研究', 'demoDataOwner', true, true, true, true, await generateIPFSCID());
        await addDataset('Biology', 'proteomics', '蛋白质组学数据', '蛋白质结构、功能域、相互作用网络数据，用于药物靶点发现和蛋白质工程研究', 'demoDataOwner', true, true, true, false, await generateIPFSCID());
        await addDataset('Biology', 'cell_biology', '细胞生物学影像数据', '细胞分裂、凋亡、信号转导的显微镜影像和时间序列数据，支持细胞机制研究', 'demoDataOwner', true, true, false, false, await generateIPFSCID());
        await addDataset('Biology', 'ecology', '生态学监测数据', '生物多样性、种群动态、生态系统功能的长期监测数据，用于保护生物学和气候变化研究', 'demoDataOwner', false, false, false, false, await generateIPFSCID());
        await addDataset('Biology', 'neurobiology', '神经生物学数据', '神经元活动记录、脑电图、神经网络连接图谱，支持认知科学和神经疾病研究', 'demoDataOwner', true, true, false, true, await generateIPFSCID());
        await addDataset('Biology', 'microbiology', '微生物学数据集', '细菌、病毒、真菌的基因组、代谢途径和抗药性数据，用于感染病学和生物技术研究', 'demoDataOwner', true, false, true, false, await generateIPFSCID());

        // Medicine 临床医学数据集
        await addDataset('Medicine', 'clinical_trials', '临床试验数据集', '药物临床试验的疗效、安全性、不良反应数据，支持循证医学和药物开发研究', 'demoDataOwner', true, true, true, true, await generateIPFSCID());
        await addDataset('Medicine', 'medical_imaging', '医学影像数据库', 'CT、MRI、X光、超声等医学影像及诊断标注，用于影像诊断和计算机辅助诊断研究', 'demoDataOwner', true, true, true, false, await generateIPFSCID());
        await addDataset('Medicine', 'electronic_health', '电子健康记录数据', '去标识化的患者病历、检验结果、用药记录，支持临床决策支持和健康信息学研究', 'demoDataOwner', true, true, false, false, await generateIPFSCID());
        await addDataset('Medicine', 'pharmacogenomics', '药物基因组学数据', '个体基因型与药物反应关系数据，用于精准医疗和个性化用药指导研究', 'demoDataOwner', false, false, false, false, await generateIPFSCID());
        await addDataset('Medicine', 'epidemiology', '流行病学调查数据', '疾病发病率、传播模式、危险因素的流行病学调查数据，支持公共卫生政策制定', 'demoDataOwner', true, true, false, true, await generateIPFSCID());
        await addDataset('Medicine', 'biomarkers', '生物标志物数据集', '疾病诊断、预后评估的分子标志物数据，包含蛋白质、代谢物和基因表达标志物', 'demoDataOwner', true, false, true, false, await generateIPFSCID());

        // ArtificialIntelligence 人工智能数据集
        await addDataset('ArtificialIntelligence', 'computer_vision', '计算机视觉数据集', '图像分类、目标检测、语义分割的标注数据集，支持深度学习和计算机视觉算法研究', 'demoDataOwner', true, true, true, true, await generateIPFSCID());
        await addDataset('ArtificialIntelligence', 'natural_language', '自然语言处理语料', '多语言文本语料、情感分析、机器翻译的标注数据，用于NLP模型训练和评估', 'demoDataOwner', true, true, true, false, await generateIPFSCID());
        await addDataset('ArtificialIntelligence', 'speech_recognition', '语音识别数据集', '多说话人、多语言、多场景的语音数据及转录文本，支持语音技术和对话系统研究', 'demoDataOwner', true, true, false, false, await generateIPFSCID());
        await addDataset('ArtificialIntelligence', 'reinforcement_learning', '强化学习环境数据', '游戏、机器人控制、自动驾驶的环境交互数据，用于强化学习算法开发和评估', 'demoDataOwner', false, false, false, false, await generateIPFSCID());
        await addDataset('ArtificialIntelligence', 'knowledge_graphs', '知识图谱数据集', '实体关系、本体结构、知识推理的结构化数据，支持知识表示和推理系统研究', 'demoDataOwner', true, true, false, true, await generateIPFSCID());
        await addDataset('ArtificialIntelligence', 'multimodal_learning', '多模态学习数据', '图像-文本、视频-音频等多模态配对数据，用于跨模态理解和生成模型研究', 'demoDataOwner', true, false, true, false, await generateIPFSCID());

        // CyberSecurity 网络安全数据集
        await addDataset('CyberSecurity', 'network_intrusion', '网络入侵检测数据', '网络流量、攻击行为、异常检测的标注数据集，用于入侵检测系统和网络安全研究', 'demoDataOwner', true, true, true, true, await generateIPFSCID());
        await addDataset('CyberSecurity', 'malware_analysis', '恶意软件分析数据', '恶意软件样本、行为特征、家族分类数据，支持恶意软件检测和逆向工程研究', 'demoDataOwner', true, true, true, false, await generateIPFSCID());
        await addDataset('CyberSecurity', 'vulnerability_database', '漏洞数据库', '软件漏洞、CVE记录、补丁信息的结构化数据，用于漏洞管理和安全评估研究', 'demoDataOwner', true, true, false, false, await generateIPFSCID());
        await addDataset('CyberSecurity', 'phishing_detection', '钓鱼攻击检测数据', '钓鱼邮件、恶意URL、社会工程攻击的样本数据，支持反钓鱼技术研究', 'demoDataOwner', false, false, false, false, await generateIPFSCID());
        await addDataset('CyberSecurity', 'cryptography', '密码学测试数据集', '加密算法、密钥管理、数字签名的测试向量和安全性评估数据', 'demoDataOwner', true, true, false, true, await generateIPFSCID());
        await addDataset('CyberSecurity', 'security_logs', '安全日志分析数据', '系统日志、安全事件、威胁情报的时间序列数据，用于安全运营和威胁狩猎研究', 'demoDataOwner', true, false, true, false, await generateIPFSCID());

        logger.debug('成功添加所有专业数据集');
    } catch (error) {
        logger.error('添加默认数据集失败:', error);
    }
}