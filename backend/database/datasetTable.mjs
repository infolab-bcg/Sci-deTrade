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

export async function initDatasetTable(blockchainName) {
	try {
		logger.debug(`init dataset table for blockchain: ${blockchainName}`);
		await dbRun(`
			CREATE TABLE IF NOT EXISTS datasets_${blockchainName} (
				name TEXT PRIMARY KEY NOT NULL,
				fullName TEXT NOT NULL,
				description TEXT,
				owner TEXT NOT NULL,
                isPublic BOOLEAN DEFAULT FALSE,
				canMaskingShare BOOLEAN DEFAULT FALSE,
				canCustomMaskingTrade BOOLEAN DEFAULT FALSE,
				canDataService BOOLEAN DEFAULT FALSE,
                maskingDatasetIPFSAddress TEXT DEFAULT '',
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);
		logger.debug(`dataset table for blockchain: ${blockchainName} initialized`);
	} catch (err) {
		logger.error(`init dataset table for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function deleteDatasetTable(blockchainName) {
	try {
		logger.debug(`delete dataset table for blockchain: ${blockchainName}`);
		await dbRun(`DROP TABLE IF EXISTS datasets_${blockchainName}`);
		logger.debug(`dataset table for blockchain: ${blockchainName} deleted`);
	} catch (err) {
		logger.error(`delete dataset table for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function addDataset(blockchainName, name, fullName, description, owner, isPublic = false, canMaskingShare = false, canCustomMaskingTrade = false, canDataService = false, maskingDatasetIPFSAddress = '') {
	try {
		logger.debug(`creating dataset for blockchain: ${blockchainName}...`);
		logger.debug(`params: ${JSON.stringify({ blockchainName, name, fullName, description, owner, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService, maskingDatasetIPFSAddress }, null, 2)}`)
		const stmt = db.prepare(`INSERT INTO datasets_${blockchainName} (name, fullName, description, owner, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService, maskingDatasetIPFSAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
		stmt.run([name, fullName, description, owner, isPublic, canMaskingShare, canCustomMaskingTrade, canDataService, maskingDatasetIPFSAddress]);
		logger.debug(`create dataset for blockchain: ${blockchainName} success`);
		return true;
	} catch (err) {
		logger.error(`create dataset for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function deleteDataset(blockchainName, name) {
	try {
		logger.debug(`delete dataset for blockchain: ${blockchainName}`);
		await dbRun(`DELETE FROM datasets_${blockchainName} WHERE name = ?`, [name]);
		logger.debug(`delete dataset for blockchain: ${blockchainName} success`);
		return true;
	} catch (err) {
		logger.error(`delete dataset for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function getAllDatasets(blockchainName) {
	try {
		logger.debug(`get all datasets for blockchain: ${blockchainName}`);
		const rows = await dbAll(`SELECT * FROM datasets_${blockchainName}`);
		logger.debug(`get all datasets for blockchain: ${blockchainName} success`);
		return rows;
	} catch (err) {
		logger.error(`get all datasets for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function getPublicDatasets(blockchainName) {
	try {
		logger.debug(`get all public datasets for blockchain: ${blockchainName}`);
		const rows = await dbAll(`SELECT * FROM datasets_${blockchainName} WHERE isPublic = ?`, [true]);
		logger.debug(`get all public datasets for blockchain: ${blockchainName} success`);
		return rows;
	} catch (err) {
		logger.error(`get all public datasets for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function updateDatasetInfo(blockchainName, name, fullName, description) {
	try {
		logger.debug(`update dataset for blockchain: ${blockchainName}`);
		await dbRun(`UPDATE datasets_${blockchainName} SET fullName = ?, description = ? WHERE name = ?`, [fullName, description, name]);
		logger.debug(`update dataset for blockchain: ${blockchainName} success`);
		return true;
	} catch (err) {
		logger.error(`update dataset for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function updateDatasetPublicLevel(blockchainName, name, isPublic, canMaskingShare = false, canCustomMaskingTrade = false, canDataService = false) {
	try {
		logger.debug(`update blockchain: ${blockchainName} dataset: ${name} public level to public: ${isPublic}, masking share: ${canMaskingShare}, custom masking trade: ${canCustomMaskingTrade}, data service: ${canDataService}`);
		await dbRun(`UPDATE datasets_${blockchainName} SET isPublic = ? canMaskingShare = ? canCustomMaskingTrade = ? canDataService = ? WHERE name = ?`, [isPublic, canMaskingShare, canCustomMaskingTrade, canDataService, name]);
		logger.debug(`update blockchain: ${blockchainName} dataset: ${name} public level success`);
		return true;
	} catch (err) {
		logger.error(`update blockchain: ${blockchainName} dataset: ${name} public level failed: ${err}`);
		throw err;
	}
}

export async function updateMaskingDatasetIPFSAddress(blockchainName, name, maskingDatasetIPFSAddress) {
	try {
		logger.debug(`update masking dataset ipfs address for blockchain: ${blockchainName}`);
		await dbRun(`UPDATE datasets_${blockchainName} SET maskingDatasetIPFSAddress = ? WHERE name = ?`, [maskingDatasetIPFSAddress, name]);
		logger.debug(`update masking dataset ipfs address for blockchain: ${blockchainName} success`);
		return true;
	} catch (err) {
		logger.error(`update masking dataset ipfs address for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function getDatasetByName(blockchainName, name) {
	try {
		logger.debug(`get dataset by name for blockchain: ${blockchainName}`);
		const row = await dbGet(`SELECT * FROM datasets_${blockchainName} WHERE name = ?`, [name]);
		logger.debug(`get dataset by name for blockchain: ${blockchainName} success`);
		return row;
	} catch (err) {
		logger.error(`get dataset by name for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

export async function getDatasetsByOwner(blockchainName, owner) {
	try {
		logger.debug(`get datasets by owner ${owner} for blockchain: ${blockchainName}`);
		const rows = await dbAll(`SELECT * FROM datasets_${blockchainName} WHERE owner = ?`, [owner]);
		logger.debug(`get datasets by owner ${owner} for blockchain: ${blockchainName} success`);
		logger.debug(`result: ${JSON.stringify(rows, null, 2)}`)
		return rows;
	} catch (err) {
		logger.error(`get datasets by owner ${owner} for blockchain: ${blockchainName} failed: ${err}`);
		throw err;
	}
}

