<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, login, notify, errorText } from '../api'

const route = useRoute()
const router = useRouter()

const isRegister = ref(false)
const form = ref({ username: '', email: '', password: '' })
const error = ref('')

async function submit() {
  error.value = ''
  try {
    if (isRegister.value) {
      await api('register/', 'POST', form.value)
      notify('Аккаунт создан')
    }
    await login(form.value.username, form.value.password)
    notify('Добро пожаловать, ' + form.value.username + '!')
    router.push(route.query.next || '/rooms')
  } catch (err) {
    error.value = errorText(err)
  }
}
</script>

<template>
  <div class="card narrow">
    <h1>{{ isRegister ? 'Регистрация' : 'Вход' }}</h1>

    <form @submit.prevent="submit">
      <label>
        Логин
        <input v-model.trim="form.username" required maxlength="150" />
      </label>
      <label v-if="isRegister">
        Email
        <input v-model.trim="form.email" type="email" />
      </label>
      <label>
        Пароль
        <input v-model="form.password" type="password" required :minlength="isRegister ? 8 : null" />
      </label>

      <p v-if="error" class="alert">{{ error }}</p>
      <button class="btn wide">{{ isRegister ? 'Зарегистрироваться' : 'Войти' }}</button>
    </form>

    <p class="muted center">
      {{ isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?' }}
      <a href="#" @click.prevent="isRegister = !isRegister; error = ''">
        {{ isRegister ? 'Войти' : 'Зарегистрироваться' }}
      </a>
    </p>
  </div>
</template>
