<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, notify, errorText } from '../api'
import { entities, loadOptions, display } from '../entities'

const route = useRoute()
const router = useRouter()
const { entity: name, id } = route.params
const entity = entities[name]

const item = ref(null)
const error = ref('')

async function load() {
  try {
    await loadOptions(entity)
    item.value = await api(`${name}/${id}/`)
  } catch (err) {
    error.value = errorText(err)
  }
}

async function remove() {
  if (!confirm('Удалить запись?')) return
  try {
    await api(`${name}/${id}/`, 'DELETE')
    notify('Запись удалена')
    router.push('/' + name)
  } catch (err) {
    notify(errorText(err), true)
  }
}

load()
</script>

<template>
  <RouterLink :to="'/' + name" class="back">← {{ entity.title }}</RouterLink>

  <p v-if="error" class="alert">{{ error }}</p>

  <div v-else-if="item" class="card narrow">
    <h1>{{ entity.label(item) }}</h1>
    <dl>
      <template v-for="f in entity.fields" :key="f.name">
        <dt>{{ f.label }}</dt>
        <dd>{{ display(f, item[f.name]) }}</dd>
      </template>
    </dl>
    <div class="actions">
      <RouterLink :to="`/${name}/${id}/edit`" class="btn">Изменить</RouterLink>
      <button class="btn danger" @click="remove">Удалить</button>
    </div>
  </div>
</template>
