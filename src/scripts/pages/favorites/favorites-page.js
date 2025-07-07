import { getAllFavorites, removeFavorite } from "../../utils/favorite-db";

export default class FavoritesPage {
  async render() {
    return /*html*/ `
      <section class="container">
        <h1><i data-feather="bookmark"></i> Story Favorit</h1>
        <div id="favorites-list" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    feather.replace();
    const favorites = await getAllFavorites();
    const list = document.getElementById("favorites-list");
    list.innerHTML = "";

    if (!favorites.length) {
      list.innerHTML = `<div class="empty-state">Belum ada story favorit.</div>`;
      return;
    }

    favorites.forEach((story) => {
      const storyElement = this.createStoryElement(story);
      list.appendChild(storyElement);

      // Inisialisasi map jika ada lat/lon
      if (story.lat && story.lon) {
        this.initMap(storyElement, story);
      }
    });

    feather.replace();

    // Hapus favorite
    list.querySelectorAll(".remove-fav-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await removeFavorite(btn.getAttribute("data-id"));
        await this.afterRender();
      });
    });
  }

  createStoryElement(story) {
    const element = document.createElement("div");
    element.className = "story-item";
    element.innerHTML = this.getStoryHTML(story);
    return element;
  }

  getStoryHTML(story) {
    const safeId = this.sanitizeId(story.createdAt || story.id || "");
    const imgSrc = story.photoBlob
      ? URL.createObjectURL(story.photoBlob)
      : story.photoUrl || "";
    return `
    <div class="story-header">
      <h3 class="story-title">${story.name}</h3>
    </div>
    <p class="story-description">${story.description}</p>
    <img src="${imgSrc}" alt="Gambar story ${
      story.name
    }" class="story-image" loading="lazy">
      ${
        story.lat && story.lon
          ? `
        <div class="story-map-container">
          <div class="story-map" id="fav-map-${safeId}"></div>
          <div class="location-info">
            <i data-feather="map-pin"></i>
            Lokasi: ${story.lat?.toFixed(4) || "-"}, ${
              story.lon?.toFixed(4) || "-"
            }
          </div>
        </div>
      `
          : ""
      }
      <button class="remove-fav-btn" data-id="${story.id}">
        <i data-feather="trash-2"></i> Hapus
      </button>
    `;
  }

  sanitizeId(timestamp) {
    return String(timestamp)
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // SAMA seperti home: container = storyElement, story = data
  initMap(container, story) {
    const safeId = this.sanitizeId(story.createdAt || story.id || "");
    const mapContainer = container.querySelector(`#fav-map-${safeId}`);
    if (!mapContainer) return;

    mapContainer.style.height = "250px";
    mapContainer.style.width = "100%";

    // Layer 1: OpenStreetMap (Default)
    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    // Layer 2: MapTiler Satellite
    const maptilerSatellite = L.tileLayer(
      `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=phKlUR2uQ7LzZPu21Y47`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/">MapTiler</a>',
      }
    );

    // Layer 3: MapTiler Streets
    const maptilerStreets = L.tileLayer(
      `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=phKlUR2uQ7LzZPu21Y47`,
      {
        attribution:
          '<a href="https://www.maptiler.com/copyright/">MapTiler</a>',
      }
    );

    const map = L.map(mapContainer, {
      center: [story.lat, story.lon],
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: false,
    });

    // Tambahkan layer default
    osmLayer.addTo(map);

    // Layer control
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

    // Marker
    const customIcon = L.icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    L.marker([story.lat, story.lon], { icon: customIcon })
      .bindPopup(`<div class="map-popup"><h4>${story.name}</h4></div>`)
      .addTo(map);

    setTimeout(() => map.invalidateSize(), 10);
  }
}
