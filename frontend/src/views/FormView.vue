<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, notify, errorText } from '../api'
import { entities, loadOptions } from '../entities'

const route = useRoute()
const router = useRouter()
const { entity: name, id } = route.params // id есть только при редактировании
const entity = entities[name]

// пустая форма со значениями по умолчанию
const form = ref(Object.fromEntries(entity.fields.map((f) => [f.name, f.default ?? ''])))
const errors = ref({}) // ошибки полей от API: { email: ['...'] }
const error = ref('') // общая ошибка

async function load() {
  try {
    await loadOptions(entity)
    if (id) form.value = await api(`${name}/${id}/`)
  } catch (err) {
    error.value = errorText(err)
  }
}

async function save() {
  errors.value = {}
  error.value = entity.validate?.(form.value) || ''
  if (error.value) return

  try {
    const saved = id
      ? await api(`${name}/${id}/`, 'PUT', form.value)
      : await api(`${name}/`, 'POST', form.value)
    notify(id ? 'Изменения сохранены' : 'Запись создана')
    router.push(`/${name}/${saved.id}`)
  } catch (err) {
    errors.value = err
    error.value = err.detail || ''
    notify(errorText(err), true)
  }
}

load()
</script>

<template>
  <RouterLink :to="'/' + name" class="back">← {{ entity.title }}</RouterLink>

  <div class="card narrow">
    <h1>{{ id ? 'Редактирование' : 'Новая запись' }}</h1>

    <form @submit.prevent="save">
      <label v-for="f in entity.fields" :key="f.name" :class="{ check: f.type === 'checkbox' }">
        {{ f.label }}

        <select v-if="f.options || f.from" v-model="form[f.name]" :required="f.required">
          <option value="" disabled>Выберите...</option>
          <option v-for="[value, text] in f.options" :key="value" :value="value">{{ text }}</option>
        </select>

        <input v-else-if="f.type === 'checkbox'" v-model="form[f.name]" type="checkbox" />

        <input v-else v-model="form[f.name]" :type="f.type || 'text'" :required="f.required"
          :min="f.min" :step="f.step" :maxlength="f.maxlength" :pattern="f.pattern" />

        <small v-if="errors[f.name]" class="field-error">{{ errors[f.name].join(' ') }}</small>
      </label>

      <p v-if="error" class="alert">{{ error }}</p>
      <button class="btn wide">Сохранить</button>
    </form>
  </div>
</template>
