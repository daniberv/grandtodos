<template>
  <div class="modal__wrapper">
    <button class="btn btn-primary" @click="showNoteForm">+ Добавить заметку</button>

    <div
        v-show="isFormShown"
        @click.self="hideNoteForm"
        class="modal"
    >
      <div class="modal__inner">
          <h3>Добавить новую заметку</h3>
          
          <div class="modal__body">
          <input class="base-input w-100" type="text" v-model="note" placeholder="Введите название заметки..."/>
          </div>

          <button @click="addNote" class="btn btn-primary w-100">Добавить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { uuid } from 'vue-uuid'

export default {
  name: 'NewNote',

  data() {
    return {
      note: '',
      isFormShown: false
    }
  },

  methods: {
    /**
    *   Передать заметку в родительский компонент
     */
    addNote() {
      if(this.validateForm() === false) return false;

      this.$emit('add-note', {
        id: uuid.v1(),
        name: this.note,
        todos: []
      });

      this.note = '';
      this.hideNoteForm();
    },
    /**
    *   Проверка инпута
     */
    validateForm() {
      return this.note.trim() != '';
    },
    /**
    *   Показать форму добавления заметки
     */
    showNoteForm() {
      this.isFormShown = true;
    },
    /**
    *   Спрятать форму добавления заметки
     */
    hideNoteForm() {
      this.isFormShown = false;
    }
  }
}
</script>
<style>
.modal__wrapper {
    text-align:center;
}
</style>