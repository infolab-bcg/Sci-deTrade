import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 创建数据库连接
const db = new sqlite3.Database(join(__dirname, 'database.db'));

// 将数据库方法转换为 Promise 版本
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// 基础数据库初始化函数
export const initDatabase = async () => {
	try {
		console.log('数据库连接已建立');
	} catch (err) {
		console.error('数据库初始化失败:', err);
		throw err;
	}
};

// 导出数据库实例和基础方法
export { db, dbRun, dbGet, dbAll };
export default db;