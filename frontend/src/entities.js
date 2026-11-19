import { reactive } from 'vue'
import { getAll } from './api'

export const entities = reactive({
  rooms: {
    title: 'Номера',
    label: (r) => `№ ${r.number}`,
    fields: [
      { name: 'number', label: 'Номер комнаты', required: true, maxlength: 10 },
      {
        name: 'room_type', label: 'Тип', required: true,
        options: [['STD', 'Standard'], ['DLX', 'Deluxe'], ['SUITE', 'Suite'], ['PRES', 'Presidential']],
      },
      { name: 'price_per_night', label: 'Цена за ночь, ₽', type: 'number', required: true, min: 1, step: 0.01 },
      { name: 'capacity', label: 'Мест', type: 'number', required: true, min: 1, default: 2 },
      { name: 'is_available', label: 'Свободен', type: 'checkbox', default: true },
    ],
  },

  guests: {
    title: 'Гости',
    label: (g) => `${g.first_name} ${g.last_name}`,
    fields: [
      { name: 'first_name', label: 'Имя', required: true, maxlength: 100 },
      { name: 'last_name', label: 'Фамилия', required: true, maxlength: 100 },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Телефон', type: 'tel', maxlength: 20, pattern: '\\+?[0-9 \\(\\)\\-]+' },
    ],
  },

  bookings: {
    title: 'Бронирования',
    label: (b) => `Бронь #${b.id}`,
    fields: [
      { name: 'room', label: 'Номер', required: true, from: 'rooms' },
      { name: 'guest', label: 'Гость', required: true, from: 'guests' },
      { name: 'check_in', label: 'Заезд', type: 'date', required: true },
      { name: 'check_out', label: 'Выезд', type: 'date', required: true },
      {
        name: 'status', label: 'Статус', required: true, default: 'PENDING',
        options: [['PENDING', 'Ожидает'], ['CONFIRMED', 'Подтверждено'], ['CANCELLED', 'Отменено']],
      },
    ],
    validate: (b) => (b.check_out <= b.check_in ? 'Дата выезда должна быть позже даты заезда' : ''),
  },
})

export async function loadOptions(entity) {
  for (const field of entity.fields) {
    if (field.from) {
      const items = await getAll(field.from)
      field.options = items.map((item) => [item.id, entities[field.from].label(item)])
    }
  }
}

export function display(field, value) {
  if (field.type === 'checkbox') return value ? 'Да' : 'Нет'
  const option = field.options?.find(([v]) => v === value)
  return option ? option[1] : value
}
