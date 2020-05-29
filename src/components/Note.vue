<template>
  <div class="note"
    :style="{backgroundColor: randomColor()}"
  >
      <router-link
        :to="{ name:'note', params: {id:note.id} }"
      >
          <div class="note__name">{{note.name}}</div>
          <ul
              v-if="note.todos.length > 0"
              class="note__todos"
          >
              <li
                  v-for="todo in note.todos.slice(0,3)"
                  :key="`todo_${note.id}_${todo.id}`"
                  :class="(todo.isDone ? 'todo-done' : '')"
              >
                  {{todo.body}}
              </li>
              <li v-show="note.todos.length > 3">...</li>
          </ul>
          <div v-else><small>Пока нет заданий</small></div>
      </router-link>

      <button @click="deleteNote(note.id)" class="btn btn-secondary-outline">Удалить заметку</button>
</div>
</template>

<script>
import { uuid } from 'vue-uuid'

export default {
  name: 'NewNote',
  props: ['note'],

  methods: {
    /**
    *   Разный цвет для каждой заметки
     */
    randomColor() {
        const colors = ['#9B5DE5', '#F15BB5', '#FEE440', '#00F5D4', '#FFFFFF'];

        return colors[Math.floor(5 * Math.random())];
    },
    /**
    *   Удаление заметки по id
    *   @param {number} noteId, Id заметки для удаления
     */
    deleteNote(noteId) {
      this.$root.$confirm('Удалить', 'Вы действительно хотите удалить заметку?').then((confirm) => {
          if(confirm) {
            this.$emit('delete-note', noteId);
          }
      })
    }
  }
}
</script>