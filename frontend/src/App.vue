<script setup>
import { useRouter } from 'vue-router'
import { auth, toast, logout, notify } from './api'
import { entities } from './entities'

const router = useRouter()

function onLogout() {
  logout()
  notify('Вы вышли из системы')
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo">Grand Hotel <span>★★★★★</span></RouterLink>
    <nav>
      <RouterLink v-for="(e, name) in entities" :key="name" :to="'/' + name">{{ e.title }}</RouterLink>
    </nav>
    <div class="user">
      <template v-if="auth.token">
        <span>Вы вошли как <b>{{ auth.username }}</b></span>
        <button class="btn light" @click="onLogout">Выйти</button>
      </template>
      <RouterLink v-else to="/login" class="btn">Войти</RouterLink>
    </div>
  </header>

  <main class="container">
    <RouterView :key="$route.fullPath" />
  </main>

  <div v-if="toast.text" class="toast" :class="{ error: toast.error }">{{ toast.text }}</div>
</template>
