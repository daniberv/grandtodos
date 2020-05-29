<template>
  <div
    v-show="isShow"
    @click.self="cancel"
    class="modal"
  >
    <div class="modal__inner">
      <h3>Подтвердите</h3>

      <div class="modal__body">{{ message }}</div>

      <button class="btn btn-secondary" @click="agree">{{ title }}</button>
      <button class="btn btn-link" @click="cancel">Отменить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Confirm',

  data() {
    return {
      isShow: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
    }
  },

  methods: {
    /**
    *   Показать окно подтверждения
    *   @param {string} title, текст кнопки подтвтерждения
    *   @param {string} message, текст сообщения
     */
    open(title, message) {
      this.isShow = true
      this.title = title
      this.message = message
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    /**
    *   Подтвердить действие
     */
    agree() {
      this.resolve(true)
      this.isShow = false
    },
    /**
    *   Отменить действие
     */
    cancel() {
      this.resolve(false)
      this.isShow = false
    }
  }
}
</script>