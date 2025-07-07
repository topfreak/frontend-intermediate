import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupViewTransitions();
  }

  _setupViewTransitions() {
    if (!document.startViewTransition) {
      this.#content.style.animation = "page-transition 0.3s ease";
    }
  }

  updateNavigation() {
    const authItem = document.querySelector(".auth-item");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      // Update navigasi dengan Feather Icons
      authItem.innerHTML = `
        <a href="#/logout" class="logout-button">
          <i data-feather="log-out"></i> Logout | <i data-feather="user"></i> ${user.name}
        </a>
      `;

      // Tambahkan event listener untuk logout
      const logoutLink = authItem.querySelector("a");
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.clear();
        this.updateNavigation();
        window.location.hash = "#/login";
      });
    } else {
      // Update navigasi untuk pengguna belum login
      authItem.innerHTML = `
        <a href="#/login">
          <i data-feather="log-in"></i> Login/Register
        </a>
      `;
    }

    // Render ulang Feather Icons setelah update DOM
    feather.replace();
  }

  _setupDrawer() {
    // Event listener untuk toggle drawer
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    // Event listener untuk close drawer saat klik di luar
    document.body.addEventListener("click", (event) => {
      const isClickInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isClickOnDrawerButton = this.#drawerButton.contains(event.target);

      if (!isClickInsideDrawer && !isClickOnDrawerButton) {
        this.#navigationDrawer.classList.remove("open");
      }

      // Close drawer saat klik link navigasi
      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  // Di dalam class App (app.js)

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes["*"];

    // Dapatkan referensi ke konten lama
    const oldContent = this.#content.cloneNode(true);

    // Mulai View Transition
    const transition = document.startViewTransition
      ? document.startViewTransition(() => this._performPageUpdate(page))
      : { ready: Promise.resolve() };

    try {
      await transition.ready;

      // 1. ANIMASI KELUAR - Animasikan konten lama
      const exitAnimation = oldContent.animate(
        [
          { transform: "translateX(0)", opacity: 1 },
          { transform: "translateX(-100%)", opacity: 0 },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );

      // 2. ANIMASI MASUK - Animasikan konten baru
      const enterAnimation = this.#content.animate(
        [
          { transform: "translateX(100%)", opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ],
        {
          duration: 500,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        }
      );

      // 3. GABUNGKAN DENGAN VIEW TRANSITION
      await Promise.all([
        exitAnimation.finished,
        enterAnimation.finished,
        this._handlePageTransition(),
      ]);
    } catch (error) {
      console.error("Error during transition:", error);
      // Fallback jika ada error
      await this._performPageUpdate(page);
    }
  }

  async _performPageUpdate(page) {
    try {
      // Render konten baru
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.updateNavigation();
    } catch (error) {
      console.error("Error rendering page:", error);
      this.#content.innerHTML = `<div class="error">Error loading page</div>`;
    }
  }

  async _handlePageTransition() {
    // Jika browser support View Transitions
    if (document.startViewTransition) {
      await document.documentElement.animate(
        [
          { transform: "translateY(20px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 300,
          easing: "ease-in-out",
        }
      ).finished;
    }

    // Tambahan efek paralax untuk elemen spesifik
    document.querySelectorAll(".story-item, .auth-container").forEach((el) => {
      el.animate(
        [
          { transform: "translateY(10px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          delay: 200,
        }
      );
    });
  }
}

export default App;
