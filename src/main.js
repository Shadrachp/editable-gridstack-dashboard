import { createApp } from "vue";
import App from "./App.vue";
import EditableDashboard from './components/EditableDashboard/index.vue'

const app = createApp(App);

app.component('EditableDashboard', EditableDashboard)
app.mount("#app");
