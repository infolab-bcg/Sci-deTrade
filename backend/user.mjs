import crypto from 'crypto';
import { createUser as dbCreateUser, getUserByUsername } from './database/userTable.mjs';
import logger from './log.mjs';

// 密码加密函数
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
};

// 验证密码
const verifyPassword = (password, hashedPassword) => {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
};

// 用户注册
export async function registerUser(username, password) {
    try {
        // 检查用户名是否已存在
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            throw new Error('用户名已存在');
        }

        // 验证输入
        if (!username || !password) {
            throw new Error('用户名和密码不能为空');
        }

        if (username.length < 3) {
            throw new Error('用户名至少需要3个字符');
        }

        if (password.length < 6) {
            throw new Error('密码至少需要6个字符');
        }

        // 加密密码并创建用户
        const hashedPassword = hashPassword(password);
        const user = await dbCreateUser(username, hashedPassword);

        return {
            success: true,
            user: {
                id: user.id,
                username: user.username
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 用户登录
export async function loginUser(username, password) {
    try {
        logger.debug('Login user:', username);
        // 验证输入
        if (!username || !password) {
            throw new Error('用户名和密码不能为空');
        }

        // 查找用户
        const user = await getUserByUsername(username);
        if (!user) {
            throw new Error('用户名或密码错误');
        }
        logger.debug('User found:', user);
        // 验证密码
        const isValidPassword = verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('用户名或密码错误');
        }
        logger.debug('Password verified:', isValidPassword);
        return {
            success: true,
            user: {
                id: user.id,
                username: user.username,
                created_at: user.created_at
            }
        };
    } catch (error) {
        logger.error('Login error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}


// 用户注册路由处理函数
export async function handleRegister(req, res) {
    try {
        const { username, password } = req.body;
        const result = await registerUser(username, password);

        if (result.success) {
            res.json({
                success: true,
                message: '注册成功',
                user: result.user
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 用户登录路由处理函数
export async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;
        const result = await loginUser(username, password);

        if (result.success) {
            res.json({
                success: true,
                message: '登录成功',
                user: result.user
            });
        } else {
            res.status(401).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 获取用户信息路由处理函数
export async function handleGetUser(req, res) {
    try {
        const { id } = req.params;
        const result = await getUserById(id);

        if (result.success) {
            res.json({
                success: true,
                user: result.user
            });
        } else {
            res.status(404).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
}

// 初始化默认用户
export async function addDemoUser() {
    try {
        logger.debug('初始化演示账户');

        // 创建数据拥有者演示账户
        const dataOwnerUsername = 'demoDataOwner';
        const dataOwnerPassword = 'demoDataOwner';

        await registerUser(dataOwnerUsername, dataOwnerPassword);

        // 创建数据请求者演示账户
        const dataRequesterUsername = 'demoDataRequester';
        const dataRequesterPassword = 'demoDataRequester';

        await registerUser(dataRequesterUsername, dataRequesterPassword);
        return {
            success: true,
            message: '演示账户初始化完成'
        };
    } catch (error) {
        logger.error('初始化演示账户时发生错误:', error);
        return {
            success: false,
            message: error.message
        };
    }
}