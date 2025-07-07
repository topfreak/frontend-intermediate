import HomePresenter from "../../presenters/HomePresenter";
import {
  addFavorite,
  isFavorite,
  removeFavorite,
} from "../../utils/favorite-db";

export default class HomePage {
  constructor() {
    this.presenter = new HomePresenter(this);
    this.showLocationStories = true;
    this.onHashChange = this.handleHashChange.bind(this);
  }

  async render() {
    return /*html*/ `
      <section class="container">
        <div class="home-header">
          <h1><i data-feather="book-open"></i> Daftar Story</h1>
        </div>

        <div id="loading" class="loading">
          Memuat...
        </div>

        <div id="story-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    feather.replace(); // Render Feather Icons
    await this.presenter.initialize();
    this.createFAB();

    document.querySelectorAll(".bookmark-btn").forEach((btn, idx) => {
      const id = btn.getAttribute("data-id");
      btn.addEventListener("click", async () => {
        if (await isFavorite(id)) {
          await removeFavorite(id);
          btn.classList.remove("bookmarked");
          btn.innerHTML = '<i data-feather="bookmark"></i> Simpan';
        } else {
          // Ambil data dari array story asli, misal: this.stories[idx]
          const story = this.stories.find((s) => s.id === id);
          await addFavorite({
            id: story.id,
            name: story.name,
            description: story.description,
            photoUrl: story.photoUrl,
            lat: story.lat,
            lon: story.lon,
            createdAt: story.createdAt,
          });
          btn.classList.add("bookmarked");
          btn.innerHTML = '<i data-feather="bookmark"></i> Disimpan';
        }
        feather.replace();
      });
    });
  }

  // ================== FAB METHODS ==================
  createFAB() {
    if (document.querySelector(".fab")) return;

    const fab = document.createElement("button");
    fab.className = "fab";
    fab.innerHTML = `<i data-feather="plus"></i> Buat Cerita`;
    fab.addEventListener("click", () => (window.location.hash = "#/add-story"));
    document.body.appendChild(fab);
    window.addEventListener("hashchange", this.onHashChange);
  }

  handleHashChange() {
    if (!window.location.hash.startsWith("#/home")) {
      this.destroyFAB();
    }
  }

  destroyFAB() {
    const fab = document.querySelector(".fab");
    fab?.remove();
    window.removeEventListener("hashchange", this.onHashChange);
  }

  // ================== DATA RENDERING ==================
  showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("story-list").innerHTML = "";
  }

  hideLoading() {
    document.getElementById("loading").style.display = "none";
  }

  showAuthWarning() {
    document.getElementById("story-list").innerHTML = `
      <div class="auth-warning">
        <i data-feather="lock"></i> Silakan <a href="#/login">login</a> untuk melihat story
      </div>`;
  }

  displayStories(items) {
    this.stories = items;
    const storyList = document.getElementById("story-list");
    storyList.innerHTML = "";

    if (items.length === 0) {
      storyList.innerHTML = `
      <div class="empty-state">
        <i data-feather="frown"></i> Tidak ada story yang ditemukan
      </div>`;
    } else {
      items.forEach(async (story) => {
        const storyElement = this.createStoryElement(story);
        storyList.appendChild(storyElement);

        // --- Tambahan: update status tombol bookmark ---
        const btn = storyElement.querySelector(".bookmark-btn");
        if (btn) {
          if (await isFavorite(story.id)) {
            btn.classList.add("bookmarked");
            btn.innerHTML = '<i data-feather="bookmark"></i> Disimpan';
          } else {
            btn.classList.remove("bookmarked");
            btn.innerHTML = '<i data-feather="bookmark"></i> Simpan';
          }
        }
      });
    }
    feather.replace();
  }

  showError(message) {
    if (!navigator.onLine) {
      document.getElementById("story-list").innerHTML = `
      <div class="error-state">
        <i data-feather="wifi-off"></i> Anda Offline
      </div>`;
    } else {
      document.getElementById("story-list").innerHTML = `
      <div class="error-state">
        <i data-feather="alert-circle"></i> ${message || "Gagal memuat story"}
      </div>`;
    }
  }

  // ================== STORY ELEMENT CREATION ==================
  createStoryElement(story) {
    const element = document.createElement("div");
    element.className = "story-item";
    element.innerHTML = this.getStoryHTML(story);

    if (story.lat && story.lon) {
      this.initMap(element, story);
    }

    return element;
  }

  getStoryHTML(story) {
    const safeId = this.sanitizeId(story.createdAt);
    const dateOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return /*html*/ `
      <div class="story-header">
        <h3 class="story-title">${story.name}</h3>
        <div class="story-date">
          <i data-feather="calendar"></i>
          ${new Date(story.createdAt).toLocaleDateString("id-ID", dateOptions)}
        </div>
      </div>
      <p class="story-description">${story.description}</p>
      <img src="${story.photoUrl}" alt="Gambar story ${
      story.name
    }" class="story-image" loading="lazy">
      ${
        story.lat && story.lon
          ? `
        <div class="story-map-container">
          <div class="story-map" id="map-${safeId}"></div>
          <div class="location-info">
            <i data-feather="map-pin"></i>
            Lokasi: ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}
          </div>
        </div>
      `
          : ""
      }
      <button class="bookmark-btn" data-id="${
        story.id
      }" aria-label="Bookmark Story">
        <i data-feather="bookmark"></i> Simpan
      </button>
    `;
  }

  // ================== MAP UTILITIES ==================
  sanitizeId(timestamp) {
    return timestamp
      .replace(/[^a-zA-Z0-9]/g, "-") // Replace special chars
      .replace(/-+/g, "-") // Prevent multiple dashes
      .replace(/^-|-$/g, ""); // Trim leading/trailing dashes
  }

  initMap(container, story) {
    const safeId = this.sanitizeId(story.createdAt);
    const mapContainer = container.querySelector(`#map-${safeId}`);

    if (!mapContainer) return;

    // Setup ukuran peta
    mapContainer.style.height = "250px";
    mapContainer.style.width = "100%";

    // Inisialisasi peta
    const map = L.map(mapContainer, {
      center: [story.lat, story.lon],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // ================== TILE LAYER DENGAN API KEY ANDA ==================
    // Layer 1: OpenStreetMap (Default)
    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    // Layer 2: MapTiler Satellite (Menggunakan API key Anda)
    const maptilerSatellite = L.tileLayer(
      `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=phKlUR2uQ7LzZPu21Y47`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/">MapTiler</a>',
      }
    );

    // Layer 3: MapTiler Streets (Menggunakan API key Anda)
    const maptilerStreets = L.tileLayer(
      `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=phKlUR2uQ7LzZPu21Y47`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/">MapTiler</a>',
      }
    );

    // Tambahkan layer default
    osmLayer.addTo(map);

    // ================== LAYER CONTROL ==================
    const baseLayers = {
      OpenStreetMap: osmLayer,
      Satellite: maptilerSatellite,
      "MapTiler Streets": maptilerStreets,
    };

    L.control
      .layers(baseLayers, null, {
        position: "bottomright",
        collapsed: false,
      })
      .addTo(map);

    // Tambahkan marker
    const customIcon = L.icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.marker([story.lat, story.lon], { icon: customIcon })
      .bindPopup(`<div class="map-popup"><h4>${story.name}</h4></div>`)
      .addTo(map);

    // Update ukuran peta
    setTimeout(() => map.invalidateSize(), 10);
  }

  // ================== CLEANUP ==================
  destroy() {
    this.destroyFAB();
  }
}
