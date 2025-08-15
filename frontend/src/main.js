import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";

import materialKit from "./material-kit";
import { NotificationPlugin } from "./components/NotificationManager.js";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(materialKit);
app.use(NotificationPlugin);
app.mount("#app");
