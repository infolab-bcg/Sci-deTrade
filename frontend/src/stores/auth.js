import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    username: localStorage.getItem('username') || '',

  }),
  actions: {
    login(user) {
      // 保存用户信息到本地存储
      this.username = user.username;
      this.isLoggedIn = true;

      localStorage.setItem('username', user.username);

      localStorage.setItem('isLoggedIn', 'true');
    },
    logout() {
      // 清空用户信息，并设置登录状态为 false
      this.username = '';
      this.isLoggedIn = false;

      localStorage.removeItem('username');
      localStorage.setItem('isLoggedIn', 'false');
    },
  },
});
