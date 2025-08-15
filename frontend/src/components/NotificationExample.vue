<template>
  <div class="notification-example">
    <h3>通知系统示例</h3>
    <div class="button-group">
      <button @click="showSuccess" class="btn btn-success">成功通知</button>
      <button @click="showError" class="btn btn-danger">错误通知</button>
      <button @click="showWarning" class="btn btn-warning">警告通知</button>
      <button @click="showInfo" class="btn btn-info">信息通知</button>
    </div>
    
    <div class="button-group">
      <button @click="showCustomDuration" class="btn btn-primary">自定义时长(10秒)</button>
      <button @click="showWithTitle" class="btn btn-secondary">带标题通知</button>
      <button @click="showPersistent" class="btn btn-dark">持久通知(不自动关闭)</button>
      <button @click="clearAll" class="btn btn-outline-danger">清空所有通知</button>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'NotificationExample',
  setup() {
    const $notify = inject('$notify')

    const showSuccess = () => {
      $notify.success('操作成功完成！')
    }

    const showError = () => {
      $notify.error('操作失败，请重试')
    }

    const showWarning = () => {
      $notify.warning('请注意：此操作可能有风险')
    }

    const showInfo = () => {
      $notify.info('这是一条信息提示')
    }

    const showCustomDuration = () => {
      $notify.info('这条通知将显示10秒', { duration: 10000 })
    }

    const showWithTitle = () => {
      $notify.success('数据保存成功', { 
        title: '保存完成',
        message: '您的数据已经成功保存到服务器'
      })
    }

    const showPersistent = () => {
      $notify.warning('这是一个持久通知，需要手动关闭', { 
        title: '重要提醒',
        autoClose: false
      })
    }

    const clearAll = () => {
      $notify.clear()
    }

    return {
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showCustomDuration,
      showWithTitle,
      showPersistent,
      clearAll
    }
  }
}
</script>

<style scoped>
.notification-example {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-success { background: #28a745; color: white; }
.btn-danger { background: #dc3545; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-info { background: #17a2b8; color: white; }
.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-dark { background: #343a40; color: white; }
.btn-outline-danger { 
  background: transparent; 
  color: #dc3545; 
  border: 1px solid #dc3545; 
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
