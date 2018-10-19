<template>
  <div>
    <input v-model="messageText" @keyup.enter="send" placeholder="Enter a message" />
  </div>
</template>

<script>
  export default {
    name: 'message-form',
    components: {
      'chat': Chat,
    },
    data () {
      return {
        messageText: ''
      }
    },
    send () {
      this.$emit('send')
    }
  }
</script>

<style scoped>
</style>
