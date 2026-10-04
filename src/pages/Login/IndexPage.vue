<template>
  <div class="login-page">
    <main class="login-shell">
      <section class="brand-panel" aria-label="Informasi MD Furniture">
        <div class="brand-panel__glow brand-panel__glow--top"></div>
        <div class="brand-panel__glow brand-panel__glow--bottom"></div>

        <div class="brand-panel__content">
          <div class="brand">
            <img
              class="brand__logo"
              src="/images/md-furni-craft-logo-transparent.png"
              alt="Logo MD Furni and Craft"
            />
            <span>MD <strong>FURNITURE</strong></span>
            <span class="eyebrow">Crafted for everyday living</span>
          </div>

          <div class="brand-copy">
            <p>Kelola koleksi, pesanan, dan pengalaman pelanggan Anda dalam satu tempat.</p>
          </div>

          <div class="brand-panel__footer">
            <div class="trusted-by">
              <div class="avatar-stack" aria-hidden="true">
                <span class="avatar avatar--one">A</span>
                <span class="avatar avatar--two">R</span>
                <span class="avatar avatar--three">S</span>
              </div>
              <span>Dipercaya tim MD Furniture</span>
            </div>
            <span class="made-with">Est. 2014 · Indonesia</span>
          </div>
        </div>
      </section>

      <section class="form-panel">
        <div class="form-panel__content">
          <div class="mobile-brand">
            <img
              class="brand__logo"
              src="/images/md-furni-craft-logo-transparent.png"
              alt="Logo MD Furni and Craft"
            />
            <span>MD <strong>FURNITURE</strong></span>
          </div>

          <div class="form-heading">
            <span class="eyebrow eyebrow--dark">Portal internal</span>
            <h2>Selamat datang kembali</h2>
            <p>Masuk untuk melanjutkan ke dashboard Anda.</p>
          </div>

          <q-form class="login-form" @submit="handleLogin">
            <q-input
              v-model="loginStore.form.username"
              outlined
              label="Username"
              autocomplete="username"
              class="login-input"
            >
              <template #prepend>
                <q-icon name="person_outline" />
              </template>
            </q-input>

            <q-input
              v-model="loginStore.form.password"
              outlined
              label="Kata sandi"
              :type="isPasswordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              class="login-input"
            >
              <template #prepend>
                <q-icon name="lock_outline" />
              </template>
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  :icon="isPasswordVisible ? 'visibility_off' : 'visibility'"
                  :aria-label="
                    isPasswordVisible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
                  "
                  @click="isPasswordVisible = !isPasswordVisible"
                />
              </template>
            </q-input>

            <div class="form-options">
              <q-checkbox v-model="loginStore.form.rememberMe" label="Ingat saya" dense />
              <q-btn flat no-caps label="Lupa kata sandi?" class="text-link" />
            </div>

            <q-btn
              type="submit"
              unelevated
              no-caps
              label="Masuk ke Dashboard"
              icon-right="arrow_forward"
              class="login-button full-width"
              :loading="loginStore.loading"
            />
          </q-form>

          <div class="form-divider"><span>atau</span></div>

          <p class="register-copy">
            Belum memiliki akun?
            <q-btn flat dense no-caps label="Hubungi administrator" class="text-link" />
          </p>
        </div>

        <div class="copyright">
          <span>© {{ currentYear }} MD Furniture. Seluruh hak cipta dilindungi.</span>
          <span>Support by CV. Udumbara Informatika</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useLoginStore } from '@/stores/login'
import { useRouter } from 'vue-router'

const loginStore = useLoginStore()
const $q = useQuasar()
const isPasswordVisible = ref(false)
const currentYear = new Date().getFullYear()
const router = useRouter()

async function handleLogin() {
  try {
    const message = await loginStore.login()

    $q.notify({
      type: 'positive',
      message,
    })

    await router.replace('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message,
    })
  }
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  padding: 24px;
  background: #08090a;
}

.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(410px, 0.95fr);
  min-height: calc(100vh - 48px);
  overflow: hidden;
  border-radius: 24px;
  background: #151719;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
}

.brand-panel {
  position: relative;
  display: flex;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 78% 20%, rgba(229, 184, 99, 0.13), transparent 25%),
    radial-gradient(circle at 14% 88%, rgba(255, 255, 255, 0.08), transparent 28%),
    linear-gradient(145deg, #050506 0%, #161719 100%);
}

.brand-panel::after {
  position: absolute;
  right: -170px;
  bottom: -200px;
  width: 540px;
  height: 540px;
  border: 1px solid rgba(230, 184, 102, 0.18);
  border-radius: 50%;
  content: '';
}

.brand-panel__glow {
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(224, 178, 93, 0.1);
  filter: blur(2px);
}

.brand-panel__glow--top {
  top: -115px;
  right: -80px;
}

.brand-panel__glow--bottom {
  bottom: 38px;
  left: -150px;
}

.brand-panel__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 52px clamp(42px, 7vw, 94px) 48px;
}

.brand,
.mobile-brand {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  letter-spacing: 1.6px;
  font-size: 14px;
  font-weight: 400;
}

.brand {
  align-self: center;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.brand strong,
.mobile-brand strong {
  font-weight: 800;
}

.brand__logo {
  width: 108px;
  height: 108px;
  object-fit: contain;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.28));
}

.brand-copy {
  max-width: 500px;
  margin: auto 0;
}

.eyebrow {
  display: block;
  margin-bottom: 18px;
  color: #edc77e;
  letter-spacing: 1.5px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}

.eyebrow--dark {
  margin-bottom: 12px;
  color: #ad7831;
}

.brand-copy h1 {
  margin: 0;
  letter-spacing: -1.8px;
  font-size: clamp(38px, 4vw, 62px);
  font-weight: 700;
  line-height: 1.07;
}

.brand-copy p {
  max-width: 380px;
  margin: 22px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 16px;
  line-height: 1.75;
}

.brand-panel__footer,
.trusted-by,
.form-options {
  display: flex;
  align-items: center;
}

.brand-panel__footer {
  justify-content: space-between;
  gap: 16px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.trusted-by {
  gap: 12px;
}

.avatar-stack {
  display: flex;
  padding-left: 7px;
}

.avatar {
  display: grid;
  width: 28px;
  height: 28px;
  margin-left: -7px;
  place-items: center;
  border: 2px solid #244f78;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.avatar--one {
  background: #c88d69;
}

.avatar--two {
  background: #8ba873;
}

.avatar--three {
  background: #9572b5;
}

.form-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 56px clamp(40px, 8vw, 112px) 34px;
  background: #151719;
}

.form-panel__content {
  width: 100%;
  max-width: 392px;
  margin: auto;
}

.mobile-brand {
  display: none;
  color: #f2f0eb;
}

.mobile-brand .brand__logo {
  width: 40px;
  height: 40px;
}

.form-heading {
  margin-bottom: 34px;
}

.form-heading h2 {
  margin: 0;
  color: #f6f4ef;
  letter-spacing: -0.7px;
  font-size: 31px;
  font-weight: 700;
  line-height: 1.2;
}

.form-heading p {
  margin: 11px 0 0;
  color: #a6aaad;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 17px;
}

.login-input :deep(.q-field__control) {
  min-height: 56px;
  border-radius: 10px;
  color: #4b4f53;
  background: #202224;
}

.login-input :deep(.q-field__native),
.login-input :deep(.q-field__label) {
  color: #e7e6e1;
}

.login-input :deep(.q-field__prepend) {
  color: #d9ad63;
}

.login-input :deep(.q-field__control:hover::before),
.login-input :deep(.q-field--focused .q-field__control::after) {
  border-color: #d9ad63;
}

.form-options {
  justify-content: space-between;
  margin-top: -4px;
  color: #b4b7ba;
  font-size: 13px;
}

.text-link {
  min-height: unset;
  padding: 0;
  color: #e3b86d;
  font-size: 13px;
  font-weight: 600;
}

.login-button {
  height: 54px;
  margin-top: 8px;
  border-radius: 10px;
  color: #1b1610;
  background: linear-gradient(100deg, #c18b37, #f1ca7f);
  box-shadow: 0 10px 22px rgba(195, 142, 58, 0.2);
  font-weight: 700;
}

.form-divider {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 30px 0 22px;
  color: #83878a;
  font-size: 12px;
}

.form-divider::before,
.form-divider::after {
  flex: 1;
  height: 1px;
  background: #36393c;
  content: '';
}

.register-copy {
  margin: 0;
  color: #a6aaad;
  text-align: center;
  font-size: 13px;
}

.register-copy .text-link {
  margin-left: 2px;
}

.copyright {
  display: grid;
  gap: 4px;
  margin: 28px 0 0;
  color: #74787b;
  text-align: center;
  font-size: 11px;
}

@media (max-width: 900px) {
  .login-page {
    min-height: 100dvh;
    padding: 0 0 24px;
    background: #08090a;
  }

  .login-shell {
    display: block;
    min-height: 100dvh;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  .brand-panel {
    display: flex;
    min-height: 248px;
    border-radius: 0 0 32px 32px;
  }

  .brand-panel::after {
    right: -165px;
    bottom: -245px;
    width: 410px;
    height: 410px;
  }

  .brand-panel__glow--top {
    top: -155px;
    right: -105px;
  }

  .brand-panel__glow--bottom {
    bottom: -145px;
    left: -150px;
  }

  .brand-panel__content {
    padding: 28px 26px 54px;
  }

  .brand-copy {
    margin: auto 0 0;
  }

  .brand-copy .eyebrow {
    margin-bottom: 9px;
    font-size: 9px;
  }

  .brand-copy h1 {
    letter-spacing: -0.7px;
    font-size: 29px;
    line-height: 1.12;
  }

  .brand-copy p,
  .brand-panel__footer {
    display: none;
  }

  .form-panel {
    position: relative;
    z-index: 2;
    min-height: calc(100dvh - 208px);
    margin: -40px 16px 0;
    padding: 30px 22px 22px;
    justify-content: flex-start;
    border-radius: 20px;
    border: 1px solid #2c2f31;
    background: #151719;
    box-shadow: 0 16px 38px rgba(0, 0, 0, 0.32);
  }

  .form-panel__content {
    max-width: none;
    margin: 0;
  }

  .mobile-brand {
    display: none;
  }

  .form-heading {
    margin-bottom: 26px;
  }

  .form-heading h2 {
    font-size: 26px;
  }

  .form-heading p {
    margin-top: 8px;
    font-size: 13px;
  }

  .login-form {
    gap: 14px;
  }

  .login-input :deep(.q-field__control) {
    min-height: 54px;
  }

  .form-divider {
    margin: 24px 0 18px;
  }

  .copyright {
    margin: auto 0 0;
    padding-top: 28px;
  }
}

@media (max-width: 420px) {
  .form-panel {
    margin-right: 12px;
    margin-left: 12px;
    padding-right: 20px;
    padding-left: 20px;
  }

  .form-heading h2 {
    font-size: 25px;
  }
}
</style>
