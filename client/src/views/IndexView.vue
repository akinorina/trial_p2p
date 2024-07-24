<script setup>
import { useWebrtcStore } from '@/stores/webrtc'

const webrtcStore = useWebrtcStore()
webrtcStore.init()
</script>

<template>
  <div class="main">
    <h1>peer to peer - WebRTC</h1>
    <div>
      <div class="">myID: {{ webrtcStore.myId }}</div>
      <div class="">
        name: <input type="text" class="another_id" v-model="webrtcStore.myName" /><br />
        <input type="text" class="another_id" v-model="webrtcStore.yourId" /><br />{{ anotherId }}
      </div>
      <div class=""><button @click="webrtcStore.connectTo">connect</button></div>
      <div class="">
        <div>
          <input type="text" v-model="webrtcStore.sendMessages" />
          <button @click="webrtcStore.send">メッセージ送信</button>
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
