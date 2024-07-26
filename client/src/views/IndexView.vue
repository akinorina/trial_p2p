<script setup>
import { ref } from 'vue'
import { useWebrtcStore } from '@/stores/webrtc'

// チャット先 ID
const yourId = ref('')

// 送信メッセージ
const sendText = ref('')

const webrtcStore = useWebrtcStore()
webrtcStore.init({ host: 'www.apsbase.com', port: 443, path: '/peer' })
</script>

<template>
  <div class="main">
    <h1>peer to peer - WebRTC</h1>
    <div>
      <div class="">myPeerId: {{ webrtcStore.myPeerId }}</div>
      <div class="">
        name: <input type="text" class="another_id" v-model="webrtcStore.myName" /><br />
        <input type="text" class="another_id" v-model="yourId" /><br />{{ anotherId }}
      </div>
      <div class=""><button @click="webrtcStore.connect(yourId)">connect</button></div>
      <div class="">
        <div>
          <input type="text" v-model="sendText" />
          <button @click="webrtcStore.send(sendText)">メッセージ送信</button>
        </div>
        <div class="" v-for="(item, index) in webrtcStore.messageData" :key="index">
          {{ item.who }}: {{ item.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.another_id {
  width: 500px;
}
</style>
