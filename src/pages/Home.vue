<template>
  <div id="home">
    <NewNote
        v-on:add-note="onAddNote"
    ></NewNote>

    <div v-if="notes.length < 1" style="padding-top: 5rem" class="text-center">
        У вас пока нет ни одной заметки!
    </div>
    
    <div v-else class="container">
        <Note
            v-for="note in notes" :key="`note_${note.id}`"
            v-on:delete-note="deleteNote(note.id)"
            :note=note
        ></Note>
    </div>
  </div>
</template>

<script>
import NewNote from './../components/NewNote.vue';
import Note from './../components/Note.vue';
import {asyncLocalStorage} from './../helpers/helpers';

export default {
  name: 'home',

  components: {
    NewNote,
    Note
  },

  data() {
    return {
        note: '',
        isFormShown: false,
        notes: []
    }
  },

  mounted() {
    asyncLocalStorage.getItem('notes').then(notes => {
        if(notes != null) {
           this.notes = JSON.parse(notes);
        }
    });
  },

  watch: {
    notes() {
        asyncLocalStorage.setItem('notes', this.notes)
            .then(() => {
                console.log('reloaded')
            })
    }
  },

  methods: {
    /**
    *   Удаление заметки по id
    *   @param {number} noteId, Id заметки для удаления
     */
    deleteNote(noteId) {
        this.notes = this.notes.filter(item => item.id != noteId)
    },
    /**
    *   Добавление новой заметки к текущему массиву
    *   @param {object} newNoteName, Заметка
     */
    onAddNote(newNoteName) {
        this.notes.push(newNoteName)
    }
  }
}
</script>