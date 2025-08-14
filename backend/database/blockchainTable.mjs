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
const dbAll = promisify(db.all.bind(db));

// 初始化区块链表
export const initBlockchainTable = async () => {
	try {
		logger.debug('init blockchain table');
		await dbRun(`
      CREATE TABLE IF NOT EXISTS blockchains (
        name TEXT PRIMARY KEY NOT NULL,
        fullName TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
		logger.debug('区块链表初始化成功');
	} catch (err) {
		logger.error('创建区块链表失败:', err);
		throw err;
	}
};
// 删除区块链表
export const deleteBlockchainTable = async () => {
	try {
		logger.debug('delete blockchain table');
		await dbRun('DROP TABLE IF EXISTS blockchains');
		logger.debug('区块链表删除成功');
	} catch (err) {
		logger.error('删除区块链表失败:', err);
		throw err;
	}
};

// 创建区块链记录
export const createBlockchain = async (name, fullName, description) => {
	return new Promise((resolve, reject) => {
		logger.debug(`creating blockchain: ${name}, ${fullName}, ${description} ...`);
		const stmt = db.prepare('INSERT INTO blockchains (name, fullName, description) VALUES (?, ?, ?)');
		stmt.run([name, fullName, description], function (err) {
			if (err) {
				stmt.finalize();
				logger.error(`create blockchain failed: ${err}`);
				reject(err);
			} else {
				logger.debug(`create blockchain success: ${name}, ${fullName}, ${description}`);
				const result = { name, fullName, description };
				stmt.finalize();
				resolve(result);
			}
		});
	});
};

// 根据name查找区块链
export const findBlockchainByName = async (name) => {
	try {
		logger.debug(`find blockchain by name: ${name} ...`);
		const row = await dbGet('SELECT * FROM blockchains WHERE name = ?', [name]);
		logger.debug(`find blockchain by name: ${name} success`);
		return row;
	} catch (err) {
		logger.error(`find blockchain by name: ${name} failed: ${err}`);
		throw err;
	}
};

// 获取所有区块链记录
export const getAllBlockchains = async () => {
	try {
		logger.debug('get all blockchains ...');
		const rows = await dbAll('SELECT * FROM blockchains ORDER BY created_at DESC');
		logger.debug('get all blockchains success');
		return rows;
	} catch (err) {
		logger.error('get all blockchains failed: ' + err);
		throw err;
	}
};

// 更新区块链记录
export const updateBlockchain = async ( name, fullName, description) => {
	return new Promise((resolve, reject) => {
		logger.debug(`update blockchain: ${name}, ${fullName}, ${description} ...`);
		const stmt = db.prepare(`
			UPDATE blockchains 
			SET name = ?, fullName = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
			WHERE name = ?
		`);
		stmt.run([name, fullName, description, name], function (err) {
			if (err) {
				stmt.finalize();
				logger.error(`update blockchain failed: ${err}`);
				reject(err);
			} else {
				stmt.finalize();
				logger.debug(`update blockchain success: ${name}, ${fullName}, ${description}`);
				resolve({ changes: this.changes, name });
			}
		});
	});
};

// 通过name 删除区块链
export const deleteBlockchainByName = async (name) => {
	return new Promise((resolve, reject) => {
		logger.debug(`delete blockchain by name: ${name} ...`);
		const stmt = db.prepare('DELETE FROM blockchains WHERE name = ?');
		stmt.run([name], function (err) {
			if (err) {
				stmt.finalize();
				logger.error(`delete blockchain by name failed: ${err}`);
				reject(err);
			} else {
				stmt.finalize();
				logger.debug(`delete blockchain by name success: ${name}`);
				resolve({ changes: this.changes, name });
			}
		});
	});
};

export default db;