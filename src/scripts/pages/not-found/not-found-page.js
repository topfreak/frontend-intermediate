export default class NotFoundPage {
  async render() {
    return /*html*/ `
      <section class="container not-found-container">
        <h1><i data-feather="alert-triangle"></i> Halaman Tidak Ditemukan</h1>
        <p>Maaf, halaman yang Anda cari tidak tersedia.</p>
        <a href="#/" class="back-home-button">
          <i data-feather="home"></i> Kembali ke Beranda
        </a>
      </section>
    `;
  }

  async afterRender() {
    feather.replace(); // Render Feather Icons
  }
}
