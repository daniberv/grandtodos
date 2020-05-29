<template>
  <div id="edit">
  	<h2>Редактирование заметки</h2>
    <div class="button-group">
      <button class="btn btn-secondary-outline" @click="cancel">Вернуться</button>
      <button class="btn btn-primary" v-show="isChanged" @click="save">Сохранить</button>
    </div>
    
    <div class="button-group">
      <button v-show="currentSnaphotIdx > 0" class="btn btn-link" @click="undo">&larr; отменить</button>
      <button v-show="currentSnaphotIdx < snapshots.length - 1" class="btn btn-link" @click="redo">&rarr; повторить</button>
    </div>
    
    <div class="text-center"><small>Кликните на элемент для изменения</small></div>

    <div v-if="isReady === true" class="note-item">
      <div class="text-right">
        <button class="btn btn-secondary" @click="deleteNote(note.id)">Удалить заметку</button>
      </div>
      
      <input type="text" class="hide-input hide-input__title w-100"
        v-model="note.name"
      />

    	<ul
        v-if="note.todos.length > 0"
        class="note__todos"
      >
        <li
          class="note__todo"
            v-for="todo in note.todos"
            :key="`todo_${note.id}_${todo.id}`"
        >
          <div class="note__todo-item">
            <input type="checkbox" v-model="todo.isDone" :id="`todo_${note.id}_${todo.id}`"/>
            <input type="text" class="hide-input"
              :disabled="todo.isDone"
              v-model="todo.body"
            />
          </div>
          
          <button class="btn btn-link" @click="deleteTodo(todo.id)">Удалить</button>
        </li>
      </ul>
      
      <div class="text-center">
        <button class="btn btn-primary" @click="addTodo">+ Добавить Todo</button>
      </div>

    </div>
  </div>
</template>

<script>
import {asyncLocalStorage, asyncFilter} from './../helpers/helpers';
import { uuid } from 'vue-uuid';

export default {
	name: 'edit',

	data() {
	    return {
	    	notes: [],
        oldNote: {},            // Версия заметки до внесения каких-либо изменений
	    	note: {},               // Текущее состояние заметки
        noteIdx: -1,            // Индекс заметки вынесен для удобства, чтобы не перебирать массив каждый раз
        snapshots: [],          // Снимки заметки для отмены/повтора изменений
        currentSnaphotIdx: 0,
        isChanged: false,       // Присутствуют ли несохраненные изменения
        isReady: false,
	    }
	},

  mounted() {
    /**
    *   Проверка и получение списка заметок из localStorage
     */
    asyncLocalStorage.getItem('notes').then(notes => {
      if(notes != null) {
        this.notes = JSON.parse(notes);

        this.noteIdx = this.notes.findIndex(note => note.id == this.$route.params.id);
        if(this.noteIdx != -1) {
          this.note = this.notes[this.noteIdx];
          this.oldNote = JSON.parse(JSON.stringify(this.notes[this.noteIdx]));
          this.snapshots.push(this.oldNote);
          
          this.isReady = true;
        }
      }
    });
  },
  
  watch: {
    note: {
      /**
      *   Следим за изменениями через сравнение объектов
       */
      handler() {
        JSON.stringify(this.oldNote) !== JSON.stringify(this.note) ? this.isChanged = true : this.isChanged = false
      },
      deep: true
    }
  },

  methods: {
    /**
    *   Удаление заметки по id
    *   @param {number} noteId, Id заметки для удаления
     */
    deleteNote(noteId) {
      this.$root.$confirm('Удалить', 'Вы действительно хотите удалить заметку?').then(confirm => {
        if(confirm) {
          const newNotes = this.notes.filter(item => item.id != noteId)
          
          asyncLocalStorage.setItem('notes', newNotes)
            .then(() => {
              this.$router.push({path: '/'})
            })
        }
      })
    },
    /**
    *   Добавить TODO
     */
    addTodo() {
      this.note.todos.push({
        id: uuid.v1(),
        body: 'Еще один Todo',
        isDone: false
      })
    },
    /**
    *   Удалить TODO
    *   @param {number} todoId, id TODO, который необходимо удалить
     */
    deleteTodo(todoId) {
      this.notes.todos = this.note.todos.filter(item => item.id != todoId)
    },
    /**
    *   Выйти
     */
    cancel() {
      if(!this.isChanged) {
        this.$router.push({path: '/'})
      } else {
        this.$parent.$refs.confirm.open('Да, выйти и удалить изменения', 'Все измения будут потеряны?').then((confirm) => {
          if(confirm) {
              this.$router.push({path: '/'})
          }
        })
      }
    },
    /**
    *   Сохранить заметку
     */
    save() {
      this.notes[this.noteIdx] = this.note;
      asyncLocalStorage.setItem('notes', this.notes)
        .then(() => {
          this.oldNote = JSON.parse(JSON.stringify(this.notes[this.noteIdx]));
          this.snapshots.push(this.oldNote);
          this.currentSnaphotIdx = this.snapshots.length - 1;
          
          this.isChanged = false;
        })
    },
    /**
    *   Отменить изменение
     */
    undo() {
      if(this.currentSnaphotIdx < 1) return false;
      
      this.note = this.snapshots[this.currentSnaphotIdx - 1];
      this.currentSnaphotIdx--;
    },
    /**
    *   Повторить изменение
     */
    redo() {
      if(this.currentSnaphotIdx > this.snapshots.length - 1) return false;
      
      this.note = this.snapshots[this.currentSnaphotIdx + 1];
      this.currentSnaphotIdx++;
    }
  }
}
</script>
<style>
.note-item {
	margin-top: 2rem;
  max-width: 30rem;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #000;
  border-radius: 0;
  box-shadow: 5px 5px 0 #000;
  padding: 1rem;
}
.button-group {
  text-align: center;
  margin-bottom: 2rem;
}
.note__todo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.note__todo-item {
  flex: 1;
  display: flex;
  align-items: center;
}
.note__todo-item .hide-input {
  flex: 1;
}
.hide-input:disabled {
  text-decoration: line-through;
}
</style>