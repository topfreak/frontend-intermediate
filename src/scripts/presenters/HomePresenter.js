import api from "../data/api";

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.searchQuery = "";
  }

  async initialize() {
    await this.loadAllStories();
  }

  async loadAllStories() {
    try {
      this.view.showLoading();

      const token = localStorage.getItem("token");
      if (!token) return this.view.showAuthWarning();

      const response = await api.getAllStories({
        token,
        location: this.view.showLocationStories ? 1 : 0,
        search: this.searchQuery,
      });

      this.handleResponse(response);
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  handleResponse(response) {
    const items = [
      ...(response?.data?.stories || []),
      ...(response?.listStory || []),
      ...(response?.stories || []),
    ];

    if (!Array.isArray(items)) {
      throw new Error("Format data story tidak valid");
    }

    this.view.displayStories(items);
  }

  async handleSubscription(subscription) {
    try {
      await api.subscribeNotification({
        token: localStorage.getItem("token"),
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
      });
    } catch (error) {
      console.error("Subscription error:", error);
    }
  }
}
