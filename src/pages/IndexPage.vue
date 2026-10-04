<template>
  <q-page class="sso-page">
    <main class="dashboard-shell">
      <header class="topbar">
        <div class="brand">
          <img
            class="brand-logo"
            src="/images/md-furni-craft-logo-transparent.png"
            alt="MD Furniture"
          />
          <div>
            <div class="brand-name">MD FURNITURE</div>
            <div class="brand-tagline">CRAFTED FOR EVERYDAY LIVING</div>
          </div>
        </div>

        <nav class="desktop-nav gt-sm" aria-label="Navigasi utama">
          <q-btn flat no-caps label="Beranda" class="nav-link nav-link--active" />
          <q-btn flat no-caps label="Direktori" class="nav-link" />
          <q-btn flat no-caps label="Panduan" class="nav-link" />
          <q-btn flat no-caps label="Kontak" class="nav-link" />
        </nav>

        <div class="user-area">
          <q-btn
            round
            flat
            dense
            icon="notifications_none"
            class="header-icon gt-xs"
            aria-label="Notifikasi"
          >
            <q-badge floating rounded color="amber-6" />
          </q-btn>

          <q-btn round flat class="profile-btn" aria-label="Menu akun">
            <q-avatar size="38px" class="profile-avatar">
              <q-icon name="person" size="22px" />
            </q-avatar>

            <q-menu anchor="bottom right" self="top right" class="user-menu" :offset="[0, 10]">
              <q-list style="min-width: 190px">
                <q-item>
                  <q-item-section avatar><q-icon name="person_outline" /></q-item-section>
                  <q-item-section>{{ userName }}</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="logout">
                  <q-item-section avatar><q-icon name="logout" /></q-item-section>
                  <q-item-section>Keluar</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </header>

      <section class="hero-panel">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> Selamat datang</div>
          <h1>MD<br />Furniture</h1>
          <p>
            Aplikasi untk mengolah data MD Furniture,masukkan produk dan harga,agar tampil di
            website
          </p>
        </div>
        <div class="gold-ribbon" aria-hidden="true"></div>
      </section>

      <section class="application-section">
        <div class="section-head">
          <div>
            <h2>Menu SSO</h2>
            <p>Pilih menu yang ingin Anda akses</p>
          </div>

          <q-input
            v-model="search"
            dark
            dense
            outlined
            class="search-input"
            placeholder="Cari menu..."
            aria-label="Cari menu"
          >
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>

        <div class="menu-grid">
          <button
            v-for="menu in visibleMenus"
            :key="menu.title"
            type="button"
            class="menu-card"
            :style="{ '--menu-color': menu.color }"
            @click="openMenu(menu)"
          >
            <q-icon :name="menu.icon" size="39px" class="menu-icon" />
            <div class="menu-content">
              <h3>{{ menu.title }}</h3>
              <p>{{ menu.description }}</p>
            </div>
            <q-icon name="arrow_forward" size="18px" class="menu-arrow" />
          </button>
        </div>

        <div v-if="visibleMenus.length === 0" class="empty-state">Aplikasi tidak ditemukan.</div>
      </section>

      <footer class="footer gt-xs">
        <span>© {{ currentYear }} MD Furniture. Seluruh hak cipta dilindungi.</span>
        <div>
          <span>Kebijakan Privasi</span><i></i><span>Syarat & Ketentuan</span><i></i
          ><span>Kontak</span>
        </div>
      </footer>
    </main>

    <nav class="mobile-nav lt-sm" aria-label="Navigasi bawah">
      <q-btn flat stack no-caps icon="home" label="Beranda" class="mobile-nav__active" />
      <q-btn flat stack no-caps icon="grid_view" label="Direktori" />
      <q-btn flat stack no-caps icon="person_outline" label="Akun" />
      <q-btn flat stack no-caps icon="logout" label="Keluar" @click="logout" />
    </nav>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const search = ref('')
const currentYear = new Date().getFullYear()

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('user')) || {}
  } catch {
    return {}
  }
})

const userName = computed(() => user.value?.name || user.value?.nama || 'Administrator')

const menus = [
  {
    title: 'Kategori',
    description: 'Atur kategori dan pengelompokan seluruh produk furniture.',
    icon: 'category',
    color: '#4c9cff',
    route: '/kategori',
  },
  {
    title: 'Produk',
    description: 'Kelola katalog, harga, stok, deskripsi dan informasi produk.',
    icon: 'inventory_2',
    color: '#ffb91d',
    route: '/produk',
  },
  {
    title: 'Pesanan',
    description: 'Pantau pesanan pelanggan dan proses transaksi penjualan.',
    icon: 'shopping_bag',
    color: '#4bd6b3',
    route: '/pesanan',
  },
  {
    title: 'Pelanggan',
    description: 'Kelola informasi pelanggan dan riwayat transaksi.',
    icon: 'groups',
    color: '#ff7477',
    route: '/pelanggan',
  },
  {
    title: 'Laporan',
    description: 'Lihat ringkasan penjualan dan laporan operasional.',
    icon: 'bar_chart',
    color: '#9b6cff',
    route: '/laporan',
  },
  {
    title: 'Pengaturan',
    description: 'Konfigurasi aplikasi, pengguna dan informasi perusahaan.',
    icon: 'settings',
    color: '#ff8b24',
    route: '/pengaturan',
  },
]

const visibleMenus = computed(() => {
  const keyword = search.value.trim().toLocaleLowerCase('id-ID')
  if (!keyword) return menus

  return menus.filter((menu) =>
    `${menu.title} ${menu.description}`.toLocaleLowerCase('id-ID').includes(keyword),
  )
})

const openMenu = (menu) => {
  if (menu.route) router.push(menu.route)
}

const logout = () => {
  localStorage.removeItem('mdfurniture_auth_token')
  sessionStorage.removeItem('mdfurniture_auth_token')
  localStorage.removeItem('user')
  router.replace('/login')
}
</script>

<style scoped>
.sso-page {
  min-height: 100vh;
  padding: 18px 0 22px;
  color: #f7f8f8;
  background: #111313;
  font-family: Inter, Roboto, Arial, sans-serif;
}

.dashboard-shell {
  width: min(1100px, calc(100% - 36px));
  min-height: calc(100vh - 40px);
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 7px solid #d69c0e;
  border-radius: 22px 22px 8px 8px;
  background: radial-gradient(circle at 83% 8%, rgba(221, 157, 14, 0.07), transparent 26%), #0d1011;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.46);
}

.topbar {
  min-height: 98px;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 0 36px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(90deg, rgba(11, 16, 18, 0.97), rgba(15, 20, 22, 0.9));
}

.brand,
.user-area,
.desktop-nav,
.footer > div {
  display: flex;
  align-items: center;
}
.brand {
  gap: 11px;
  flex-shrink: 0;
}
.brand-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
.brand-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.4px;
  line-height: 1;
}
.brand-tagline {
  margin-top: 5px;
  color: #c7c7c7;
  font-size: 9px;
  letter-spacing: 1.15px;
}
.desktop-nav {
  gap: 8px;
  margin: 0 auto;
  align-self: stretch;
}
.nav-link {
  height: 100%;
  padding: 0 13px;
  color: #aeb2b4;
  font-size: 13px;
}
.nav-link--active {
  position: relative;
  color: #f3b916;
  font-weight: 700;
}
.nav-link--active::after {
  position: absolute;
  right: 14px;
  bottom: 0;
  left: 14px;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: #eab414;
  content: '';
}
.user-area {
  gap: 7px;
}
.header-icon {
  position: relative;
  color: #dbe0e2;
}
.profile-btn {
  width: 42px;
  min-width: 42px;
  height: 42px;
  min-height: 42px;
  padding: 0;
  align-self: center;
}
.profile-btn :deep(.q-btn__content) {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}
.profile-avatar {
  position: relative;
  flex: 0 0 auto;
  color: #f3bd2d;
  border: 1px solid rgba(244, 190, 46, 0.62);
  background: radial-gradient(circle at 35% 28%, #4a3a16, #1b1d1d 68%);
  box-shadow:
    inset 0 1px rgba(255, 223, 133, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.26);
}
.profile-avatar :deep(.q-icon) {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  margin: 0;
  line-height: 1;
  transform: translate(-50%, -54%);
}
.user-menu {
  color: #e9ecee;
  background: #202528;
}

.hero-panel {
  position: relative;
  min-height: 298px;
  isolation: isolate;
  display: flex;
  align-items: center;
  padding: 42px 52px 64px;
  overflow: hidden;
  background:
    linear-gradient(
      90deg,
      rgba(7, 12, 14, 0.97) 0%,
      rgba(7, 12, 14, 0.82) 44%,
      rgba(7, 12, 14, 0.23) 100%
    ),
    url('/images/sso-furniture-hero.png') center / cover no-repeat;
}

.hero-copy {
  position: relative;
  z-index: 2;
  max-width: 570px;
}
.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffc31b;
  font-size: 16px;
  font-weight: 600;
}
.eyebrow span {
  width: 31px;
  height: 3px;
  background: #edb20e;
}
.hero-copy h1 {
  margin: 19px 0 12px;
  font-size: clamp(31px, 4vw, 41px);
  line-height: 1.12;
  letter-spacing: -0.7px;
  font-weight: 800;
}
.hero-copy p {
  max-width: 510px;
  margin: 0;
  color: #d4d6d6;
  font-size: 17px;
  line-height: 1.65;
}
.gold-ribbon {
  position: absolute;
  z-index: 1;
  right: -4%;
  bottom: -36px;
  left: -3%;
  height: 88px;
  transform: rotate(1.6deg);
  border-radius: 50% 50% 0 0;
  background: linear-gradient(90deg, rgba(224, 164, 8, 0.78), #f9c21d 48%, rgba(197, 126, 4, 0.66));
  box-shadow: 0 -10px 30px rgba(226, 170, 16, 0.15);
}
.gold-ribbon::after {
  position: absolute;
  top: -13px;
  right: 0;
  left: 0;
  height: 24px;
  border-radius: 50%;
  background: #14201b;
  content: '';
}

.application-section {
  padding: 30px 36px 36px;
}
.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 27px;
}
.section-head h2 {
  margin: 0;
  font-size: 25px;
  line-height: 1.2;
}
.section-head p {
  margin: 6px 0 0;
  color: #c3c6c7;
  font-size: 15px;
}
.search-input {
  width: min(305px, 100%);
  color: #eceff0;
}
.search-input :deep(.q-field__control) {
  height: 50px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.025);
}
.search-input :deep(.q-field__control:before) {
  border-color: #394044;
}
.search-input :deep(.q-field__native),
.search-input :deep(.q-field__prepend) {
  color: #cfd3d4;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.menu-card {
  position: relative;
  min-height: 165px;
  display: flex;
  flex-direction: column;
  padding: 23px 24px;
  overflow: hidden;
  color: #f4f5f5;
  text-align: left;
  cursor: pointer;
  border: 1px solid #30383b;
  border-radius: 12px;
  background: linear-gradient(140deg, rgba(34, 40, 42, 0.9), rgba(21, 26, 28, 0.92));
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
}
.menu-card::before {
  position: absolute;
  top: -72px;
  right: -53px;
  width: 135px;
  height: 135px;
  border-radius: 50%;
  background: var(--menu-color);
  opacity: 0.07;
  content: '';
}
.menu-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--menu-color) 60%, #fff);
  background: linear-gradient(140deg, rgba(42, 48, 50, 0.98), rgba(24, 30, 32, 0.96));
}
.menu-icon {
  position: relative;
  color: var(--menu-color);
  filter: drop-shadow(0 4px 8px color-mix(in srgb, var(--menu-color) 25%, transparent));
}
.menu-content {
  margin-top: auto;
  padding-top: 16px;
  padding-right: 12px;
}
.menu-content h3 {
  margin: 0 0 6px;
  font-size: 17px;
}
.menu-content p {
  margin: 0;
  color: #d1d4d5;
  font-size: 13px;
  line-height: 1.5;
}
.menu-arrow {
  position: absolute;
  right: 20px;
  bottom: 22px;
  color: #697175;
  transition:
    color 180ms ease,
    transform 180ms ease;
}
.menu-card:hover .menu-arrow {
  color: var(--menu-color);
  transform: translateX(3px);
}
.empty-state {
  padding: 38px;
  color: #a9afb1;
  text-align: center;
  border: 1px dashed #384044;
  border-radius: 12px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 0 36px;
  padding: 22px 0;
  color: #a6abad;
  font-size: 12px;
  border-top: 1px solid #2d3436;
}
.footer > div {
  gap: 13px;
}
.footer i {
  width: 1px;
  height: 13px;
  background: #555c5f;
}
.mobile-nav {
  display: none;
}

@media (max-width: 760px) {
  .sso-page {
    padding: 0 0 75px;
  }
  .dashboard-shell {
    width: 100%;
    min-height: 100vh;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .topbar {
    min-height: 76px;
    padding: 0 17px;
    gap: 12px;
  }
  .brand-logo {
    width: 39px;
    height: 39px;
  }
  .brand-name {
    font-size: 16px;
  }
  .brand-tagline {
    font-size: 7px;
  }
  .user-area {
    margin-left: auto;
  }
  .hero-panel {
    min-height: 244px;
    align-items: flex-start;
    padding: 28px 20px 52px;
    background-position: 65% center;
  }
  .hero-panel::after {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(90deg, rgba(7, 12, 14, 0.88), rgba(7, 12, 14, 0.36));
    content: '';
  }
  .eyebrow {
    gap: 9px;
    font-size: 12px;
  }
  .eyebrow span {
    width: 22px;
    height: 2px;
  }
  .hero-copy h1 {
    margin: 13px 0 9px;
    font-size: 27px;
  }
  .hero-copy p {
    max-width: 310px;
    font-size: 12px;
    line-height: 1.5;
  }
  .gold-ribbon {
    bottom: -48px;
    height: 72px;
  }
  .application-section {
    padding: 22px 15px 26px;
  }
  .section-head {
    display: block;
    margin-bottom: 14px;
  }
  .section-head h2 {
    font-size: 21px;
  }
  .section-head p {
    font-size: 13px;
  }
  .search-input {
    width: 100%;
    margin-top: 17px;
  }
  .search-input :deep(.q-field__control) {
    height: 45px;
  }
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }
  .menu-card {
    min-height: 132px;
    padding: 15px;
    border-radius: 9px;
  }
  .menu-icon {
    font-size: 29px !important;
  }
  .menu-content {
    padding-top: 10px;
    padding-right: 0;
  }
  .menu-content h3 {
    margin-bottom: 4px;
    font-size: 13px;
  }
  .menu-content p {
    display: -webkit-box;
    overflow: hidden;
    font-size: 10px;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .menu-arrow {
    display: none;
  }
  .mobile-nav {
    position: fixed;
    z-index: 5;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    padding: 6px 6px max(7px, env(safe-area-inset-bottom));
    border-top: 1px solid #273034;
    background: rgba(10, 14, 16, 0.96);
    backdrop-filter: blur(12px);
  }
  .mobile-nav :deep(.q-btn) {
    min-width: 58px;
    color: #a9afb2;
    font-size: 9px;
  }
  .mobile-nav :deep(.q-icon) {
    font-size: 21px;
  }
  .mobile-nav__active {
    color: #f2b713 !important;
  }
}

@media (min-width: 761px) and (max-width: 950px) {
  .topbar {
    padding: 0 25px;
  }
  .application-section {
    padding-right: 25px;
    padding-left: 25px;
  }
  .menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
