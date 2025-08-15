<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <NotificationToast
          v-for="notification in notifications"
          :key="notification.id"
          :id="notification.id"
          :type="notification.type"
          :title="notification.title"
          :message="notification.message"
          :duration="notification.duration"
          :auto-close="notification.autoClose"
          @close="handleClose"
        />
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { inject } from 'vue'
import NotificationToast from './NotificationToast.vue'

export default {
  name: 'NotificationContainer',
  components: {
    NotificationToast
  },
  setup() {
    const notificationManager = inject('$notify')
    
    const handleClose = (id) => {
      notificationManager.remove(id)
    }

    return {
      notifications: notificationManager.getAll(),
      handleClose
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;
}

.notification-container > div {
  pointer-events: auto;
}

/* 进入和离开的过渡效果 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
}

@media (max-width: 480px) {
  .notification-container {
    top: 10px;
    right: 5px;
    left: 5px;
  }
}
</style>
