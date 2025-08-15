import { reactive } from 'vue'

class NotificationManager {
  constructor() {
    this.notifications = reactive([])
    this.idCounter = 0
  }

  /**
   * 添加通知
   * @param {Object} options - 通知选项
   * @param {string} options.type - 通知类型: 'success', 'error', 'warning', 'info'
   * @param {string} options.message - 通知消息
   * @param {string} [options.title] - 通知标题
   * @param {number} [options.duration=5000] - 显示时长(毫秒)
   * @param {boolean} [options.autoClose=true] - 是否自动关闭
   * @returns {string} 通知ID
   */
  add(options) {
    const notification = {
      id: `notification_${++this.idCounter}`,
      type: options.type || 'info',
      title: options.title || '',
      message: options.message,
      duration: options.duration || 5000,
      autoClose: options.autoClose !== false,
      timestamp: Date.now()
    }

    this.notifications.push(notification)
    return notification.id
  }

  /**
   * 移除通知
   * @param {string} id - 通知ID
   */
  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      this.notifications.splice(index, 1)
    }
  }

  /**
   * 清空所有通知
   */
  clear() {
    this.notifications.splice(0)
  }

  /**
   * 显示成功通知
   * @param {string} message - 消息内容
   * @param {Object} [options] - 额外选项
   */
  success(message, options = {}) {
    return this.add({
      type: 'success',
      message,
      ...options
    })
  }

  /**
   * 显示错误通知
   * @param {string} message - 消息内容
   * @param {Object} [options] - 额外选项
   */
  error(message, options = {}) {
    return this.add({
      type: 'error',
      message,
      duration: options.duration || 8000, // 错误通知默认显示更长时间
      ...options
    })
  }

  /**
   * 显示警告通知
   * @param {string} message - 消息内容
   * @param {Object} [options] - 额外选项
   */
  warning(message, options = {}) {
    return this.add({
      type: 'warning',
      message,
      duration: options.duration || 6000,
      ...options
    })
  }

  /**
   * 显示信息通知
   * @param {string} message - 消息内容
   * @param {Object} [options] - 额外选项
   */
  info(message, options = {}) {
    return this.add({
      type: 'info',
      message,
      ...options
    })
  }

  /**
   * 获取所有通知
   */
  getAll() {
    return this.notifications
  }

  /**
   * 获取通知数量
   */
  getCount() {
    return this.notifications.length
  }

  /**
   * 根据类型获取通知
   * @param {string} type - 通知类型
   */
  getByType(type) {
    return this.notifications.filter(n => n.type === type)
  }
}

// 创建全局实例
const notificationManager = new NotificationManager()

// Vue 插件安装函数
const NotificationPlugin = {
  install(app) {
    // 将通知管理器添加到全局属性
    app.config.globalProperties.$notify = notificationManager
    
    // 提供注入
    app.provide('$notify', notificationManager)
  }
}

export { NotificationManager, notificationManager, NotificationPlugin }
export default notificationManager
