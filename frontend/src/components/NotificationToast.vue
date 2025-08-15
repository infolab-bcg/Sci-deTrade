<template>
  <div 
    class="notification-toast" 
    :class="[`notification-${type}`, { 'notification-show': visible }]"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <!-- 进度条 -->
    <div class="progress-border">
      <div 
        class="progress-bar" 
        :style="{ width: progressWidth + '%' }"
        :class="`progress-${type}`"
      ></div>
    </div>
    
    <!-- 通知内容 -->
    <div class="notification-content">
      <div class="notification-icon">
        <i :class="iconClass"></i>
      </div>
      <div class="notification-text">
        <div class="notification-title" v-if="title">{{ title }}</div>
        <div class="notification-message">{{ message }}</div>
      </div>
      <button class="notification-close" @click="close">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationToast',
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000 // 5秒
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      progressWidth: 100,
      timer: null,
      startTime: null,
      remainingTime: 0,
      isPaused: false
    }
  },
  computed: {
    iconClass() {
      const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
      }
      return icons[this.type] || icons.info
    }
  },
  mounted() {
    this.show()
  },
  methods: {
    show() {
      this.visible = true
      if (this.autoClose) {
        this.startTimer()
      }
    },
    startTimer() {
      this.startTime = Date.now()
      this.remainingTime = this.duration
      this.updateProgress()
    },
    updateProgress() {
      if (this.isPaused) return
      
      const elapsed = Date.now() - this.startTime
      const remaining = Math.max(0, this.duration - elapsed)
      this.progressWidth = (remaining / this.duration) * 100
      
      if (remaining <= 0) {
        this.close()
      } else {
        this.timer = requestAnimationFrame(() => this.updateProgress())
      }
    },
    pauseTimer() {
      if (!this.autoClose) return
      this.isPaused = true
      if (this.timer) {
        cancelAnimationFrame(this.timer)
      }
    },
    resumeTimer() {
      if (!this.autoClose || !this.isPaused) return
      this.isPaused = false
      this.startTime = Date.now() - (this.duration - (this.progressWidth / 100 * this.duration))
      this.updateProgress()
    },
    close() {
      this.visible = false
      if (this.timer) {
        cancelAnimationFrame(this.timer)
      }
      setTimeout(() => {
        this.$emit('close', this.id)
      }, 300) // 等待动画完成
    }
  },
  beforeUnmount() {
    if (this.timer) {
      cancelAnimationFrame(this.timer)
    }
  }
}
</script>

<style scoped>
.notification-toast {
  position: relative;
  width: 350px;
  margin-bottom: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;
  opacity: 0;
}

.notification-show {
  transform: translateX(0);
  opacity: 1;
}

.progress-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  transition: width 0.1s linear;
}

.progress-success {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.progress-error {
  background: linear-gradient(90deg, #dc3545, #fd7e14);
}

.progress-warning {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.progress-info {
  background: linear-gradient(90deg, #17a2b8, #007bff);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.notification-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.notification-success .notification-icon {
  color: #28a745;
}

.notification-error .notification-icon {
  color: #dc3545;
}

.notification-warning .notification-icon {
  color: #ffc107;
}

.notification-info .notification-icon {
  color: #17a2b8;
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-message {
  font-size: 15px;
  color: #666;
  line-height: 1.4;
  word-wrap: break-word;
}

.notification-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #666;
}

/* 不同类型的边框样式 */
.notification-success {
  border-left: 4px solid #28a745;
}

.notification-error {
  border-left: 4px solid #dc3545;
}

.notification-warning {
  border-left: 4px solid #ffc107;
}

.notification-info {
  border-left: 4px solid #17a2b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-toast {
    width: calc(100vw - 20px);
    margin: 0 10px 10px 10px;
  }
}
</style>
