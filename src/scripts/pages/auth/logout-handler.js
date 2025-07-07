import { unsubscribeUserFromPush } from "../../utils/push-notification";

export default class LogoutHandler {
  async render() {
    return `<div class="logout-processing">Memproses logout...</div>`;
  }

  async afterRender() {
    const token = localStorage.getItem("token");
    await unsubscribeUserFromPush(token);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTimeout(() => {
      window.location.hash = "#/login";
    }, 1000);
  }
}
