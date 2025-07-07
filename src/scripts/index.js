import "../styles/styles.css";
import {
  subscribeUserToPush,
  unsubscribeUserFromPush,
} from "./utils/push-notification";
import App from "./pages/app";

function updateNotifButtonState(isSubscribed) {
  const notifBtn = document.getElementById("notif-toggle");
  if (!notifBtn) return;
  notifBtn.classList.toggle("active", isSubscribed);
  notifBtn.innerHTML = isSubscribed
    ? '<i data-feather="bell-off"></i>'
    : '<i data-feather="bell"></i>';
  feather.replace();
}

async function checkSubscription() {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

async function handleNotifToggle() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login untuk mengatur notifikasi.");
    return;
  }
  const isSubscribed = await checkSubscription();
  if (isSubscribed) {
    await unsubscribeUserFromPush(token);
    updateNotifButtonState(false);
    alert("Notifikasi dinonaktifkan.");
  } else {
    await subscribeUserToPush(token);
    updateNotifButtonState(true);
    alert("Notifikasi diaktifkan.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!document.startViewTransition) {
    document.documentElement.style.animation = "none";
  }

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  const notifBtn = document.getElementById("notif-toggle");
  if (notifBtn) {
    notifBtn.addEventListener("click", handleNotifToggle);
    // Set state awal tombol
    updateNotifButtonState(await checkSubscription());
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}
