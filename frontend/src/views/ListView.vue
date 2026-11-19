<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api, errorText } from '../api'
import { entities, loadOptions, display } from '../entities'

const route = useRoute()
const name = route.params.entity
const entity = entities[name]
const page = Number(route.query.page || 1)

const items = ref([])
const hasNext = ref(false)
const loading = ref(true)
const error = ref('')

async function load() {
  try {
    await loadOptions(entity)
    const data = await api(`${name}/?page=${page}`)
    items.value = data.results
    hasNext.value = Boolean(data.next)
  } catch (err) {
    error.value = errorText(err)
  }
  loading.value = false
}
load()
</script>

<template>
  <div class="title-row">
    <h1>{{ entity.title }}</h1>
    <RouterLink :to="`/${name}/new`" class="btn">+ Добавить</RouterLink>
  </div>

  <p v-if="error" class="alert">{{ error }}</p>
  <p v-else-if="loading" class="muted">Загрузка...</p>
  <p v-else-if="!items.length" class="muted">Пока ничего нет</p>

  <div v-else class="card">
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th v-for="f in entity.fields" :key="f.name">{{ f.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id" @click="$router.push(`/${name}/${item.id}`)">
          <td>{{ item.id }}</td>
          <td v-for="f in entity.fields" :key="f.name">{{ display(f, item[f.name]) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="page > 1 || hasNext" class="pager">
    <RouterLink v-if="page > 1" :to="`/${name}?page=${page - 1}`" class="btn light">← Назад</RouterLink>
    <span>Страница {{ page }}</span>
    <RouterLink v-if="hasNext" :to="`/${name}?page=${page + 1}`" class="btn light">Вперёд →</RouterLink>
  </div>
</template>
