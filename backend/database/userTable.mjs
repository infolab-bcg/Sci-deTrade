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

// 初始化用户表
export const initUserTable = async () => {
	try {
		await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
		console.log('用户表初始化成功');
	} catch (err) {
		console.error('创建用户表失败:', err);
		throw err;
	}
};

// 创建用户
export const createUser = async (username, password) => {
	return new Promise((resolve, reject) => {
		const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
		stmt.run([username, password], function (err) {
			if (err) {
				stmt.finalize();
				reject(err);
			} else {
				const result = { id: this.lastID, username };
				stmt.finalize();
				resolve(result);
			}
		});
	});
};

// 根据用户名查找用户
export const findUserByUsername = async (username) => {
	try {
		const row = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
		return row;
	} catch (err) {
		throw err;
	}
};

// 根据ID查找用户
export const findUserById = async (id) => {
	try {
		const row = await dbGet('SELECT id, username, created_at FROM users WHERE id = ?', [id]);
		return row;
	} catch (err) {
		throw err;
	}
};

// 删除用户
export const deleteUser = async (id) => {
	try {
		await dbRun('DELETE FROM users WHERE id = ?', [id]);
		return true;
	} catch (err) {
		throw err;
	}
};

export default db;
