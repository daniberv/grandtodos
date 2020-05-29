<template>
  <div id="app">
    <h1>TODO-лист</h1>
    <Confirm ref="confirm"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import Confirm from './components/Confirm'; // Определим диалоговое окно глобально для вызова из любого места

export default {
  name: 'app',

  components: {
    Confirm
  },
  
  mounted() {
    this.$root.$confirm = this.$refs.confirm.open
  }
}
</script>