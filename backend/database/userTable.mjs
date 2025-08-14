import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';
import logger from '../log.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建数据库连接
const db = new sqlite3.Database(join(__dirname, 'database.db'));

// 将数据库方法转换为 Promise 版本
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

// 初始化用户表
export async function initUserTable() {
	try {
		logger.debug('初始化用户表...');
		await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        username TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
		logger.debug('用户表初始化成功');
	} catch (err) {
		logger.error('创建用户表失败:', err);
		throw err;
	}
};

export async function deleteUserTable() {
	try {
		logger.debug('删除用户表...');
		await dbRun('DROP TABLE IF EXISTS users');
		logger.debug('用户表删除成功');
	} catch (err) {
		logger.error('删除用户表失败:', err);
		throw err;
	}
};

// 创建用户
export async function createUser(username, password) {
	try {
		logger.debug(`创建用户: ${username}`);
		const result = await dbRun('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
		logger.debug(`创建用户成功: ${username}`);
		return { result };
	} catch (err) {
		logger.error(`创建用户失败: ${username}`, err);
		throw err;
	}
};

// 根据用户名查找用户
export async function findUserByUsername(username) {
	try {
		logger.debug(`查找用户: ${username}`);
		const row = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
		logger.debug(`查找用户成功: ${username}`);
		return row;
	} catch (err) {
		logger.error(`查找用户失败: ${username}`);
		throw err;
	}
};


// 删除用户
export async function deleteUser(username) {
	try {
		logger.debug(`删除用户: ${username}`);
		await dbRun('DELETE FROM users WHERE username = ?', [username]);
		logger.debug(`删除用户成功: ${username}`);
		return true;
	} catch (err) {
		logger.error(`删除用户失败: ${username}`);
		throw err;
	}
};

export default db;
