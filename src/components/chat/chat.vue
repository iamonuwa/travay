<template>
  <vue-grid>
    <vue-grid-row>
      <vue-grid-item>
        <InitializeData/>
        <ConversationContainer
          v-for="id in convoIds"
          :conversation="conversations[id]"
          :id="id"
          :key="id"
        />
      </vue-grid-item>
    </vue-grid-row>
  </vue-grid>
</template>

<script>
  import InitializeData from './initalize-data'
  import ConversationContainer from './Conversation-Container'

  export default {
    name: "chat",
    components: {
      InitializeData,
      ConversationContainer
    },
    computed: {
      ...mapState({
        conversations: state => state.conversations.all,
        convoIds: state => state.conversations.allIds
      })
    },
  }
</script>

<style scoped>

</style>
