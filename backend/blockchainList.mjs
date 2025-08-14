import {
    createBlockchain as dbCreateBlockchain,
    findBlockchainByName,
    getAllBlockchains as dbGetAllBlockchains,
    updateBlockchain as dbUpdateBlockchain,
} from './database/blockchainTable.mjs';
import logger from './log.mjs';

// 创建区块链记录
export const createBlockchain = async (name, fullName, description) => {
    try {
        // 检查区块链名称是否已存在
        const existingBlockchain = await findBlockchainByName(name);
        if (existingBlockchain) {
            throw new Error('区块链名称已存在');
        }

        // 验证输入
        if (!name || !fullName) {
            throw new Error('区块链名称和全称不能为空');
        }

        if (name.length < 2) {
            throw new Error('区块链名称至少需要2个字符');
        }

        if (fullName.length < 3) {
            throw new Error('区块链全称至少需要3个字符');
        }

        // 创建区块链记录
        const blockchain = await dbCreateBlockchain(name, fullName, description || '');

        return {
            success: true,
            blockchain: {
                id: blockchain.id,
                name: blockchain.name,
                fullName: blockchain.fullName,
                description: blockchain.description
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// 获取所有区块链记录
export const getAllBlockchains = async () => {
    try {
        const blockchains = await dbGetAllBlockchains();
        return {
            success: true,
            blockchains
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// 根据名称获取区块链信息
export const getBlockchainByName = async (name) => {
    try {
        const blockchain = await findBlockchainByName(name);
        if (!blockchain) {
            throw new Error('区块链记录不存在');
        }

        return {
            success: true,
            blockchain
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// 更新区块链记录
export const updateBlockchain = async (name, fullName, description) => {
    try {
        // 验证输入
        if (!name || !fullName) {
            throw new Error('区块链名称和全称不能为空');
        }

        if (name.length < 2) {
            throw new Error('区块链名称至少需要2个字符');
        }

        if (fullName.length < 3) {
            throw new Error('区块链全称至少需要3个字符');
        }

        // 检查区块链是否存在
        const existingBlockchain = await findBlockchainById(id);
        if (!existingBlockchain) {
            throw new Error('区块链记录不存在');
        }

        // 如果名称发生变化，检查新名称是否已被其他记录使用
        if (existingBlockchain.name !== name) {
            const duplicateBlockchain = await findBlockchainByName(name);
            if (duplicateBlockchain && duplicateBlockchain.id !== parseInt(id)) {
                throw new Error('区块链名称已存在');
            }
        }

        // 更新区块链记录
        const result = await dbUpdateBlockchain(id, name, fullName, description || '');

        if (result.changes === 0) {
            throw new Error('更新失败，记录可能不存在');
        }

        // 获取更新后的记录
        const updatedBlockchain = await findBlockchainById(id);

        return {
            success: true,
            blockchain: updatedBlockchain
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};


// 创建区块链路由处理函数
export const handleCreateBlockchain = async (req, res) => {
    try {
        const { name, fullName, description } = req.body;
        const result = await createBlockchain(name, fullName, description);

        if (result.success) {
            res.json({
                success: true,
                message: '区块链记录创建成功',
                blockchain: result.blockchain
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('创建区块链记录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};

// 获取所有区块链路由处理函数
export const handleGetAllBlockchains = async (req, res) => {
    try {
        logger.debug('接受请求，访问数据库获取所有区块链记录...');
        const result = await getAllBlockchains();
        if (result.success) {
            logger.debug('成功获取所有区块链记录');
            res.json({
                success: true,
                blockchains: result.blockchains
            });
        } else {
            logger.error('获取所有区块链记录失败:', result.message);
            res.status(500).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('获取区块链列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
        logger.error('获取区块链列表错误:', error);
    }
};

// 根据名称获取区块链路由处理函数
export const handleGetBlockchainByName = async (req, res) => {
    try {
        const { name } = req.params;
        const result = await getBlockchainByName(name);

        if (result.success) {
            res.json({
                success: true,
                blockchain: result.blockchain
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('获取区块链信息错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};

// 更新区块链路由处理函数
export const handleUpdateBlockchain = async (req, res) => {
    try {
        const { name, fullName, description } = req.body;
        const result = await updateBlockchain(name, fullName, description);

        if (result.success) {
            res.json({
                success: true,
                message: '区块链记录更新成功',
                blockchain: result.blockchain
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('更新区块链记录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};

// 删除区块链路由处理函数
export const handleDeleteBlockchain = async (req, res) => {
    try {
        const { name } = req.params;
        const result = await deleteBlockchain(name);

        if (result.success) {
            res.json({
                success: true,
                message: result.message
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('删除区块链记录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
};

// 添加多个区块链记录
// name: Physics fullName: 物理学 description: 物理学相关科研数据
// name: Biology fullName: 生物学 description: 生物学相关科研数据
// name: Medicine fullName: 临床医学 description: 临床医学相关科研数据
// name: AI fullName: 人工智能 description: 人工智能相关科研数据
// name: cyberSecurity fullName: 网络安全 description: 网络安全相关科研数据

export const initDefaultBlockchains = async () => {
    try {
        await createBlockchain('Physics', '物理学', '物理学相关科研数据');
        await createBlockchain('Biology', '生物学', '生物学相关科研数据');
        await createBlockchain('Medicine', '临床医学', '临床医学相关科研数据');
        await createBlockchain('AI', '人工智能', '人工智能相关科研数据');
        await createBlockchain('cyberSecurity', '网络安全', '网络安全相关科研数据');
    } catch (error) {
        console.error('初始化区块链记录失败:', error);
    }
}

