<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useWebrtcStore } from '@/stores/webrtc'

// チャット先 ID
const yourId = ref('')

// 送信メッセージ
const sendText = ref('')

const webrtcStore = useWebrtcStore()

onMounted(() => {
  // local Video
  webrtcStore.videoLocal = document.getElementById('video1')
  // remote Video
  webrtcStore.videoRemote = document.getElementById('video2')
})
onBeforeUnmount(() => {
  runDisconnect()
  closePeer()
})

const openPeer = () => {
  webrtcStore.open({
    host: import.meta.env.VITE_PEER_SERVER_HOST,
    port: import.meta.env.VITE_PEER_SERVER_PORT,
    path: import.meta.env.VITE_PEER_SERVER_PATH
  })
}
const closePeer = () => {
  webrtcStore.close()
}
const runConnect = () => {
  webrtcStore.connectData(yourId.value)
  webrtcStore.connectMedia(yourId.value)
}
const runDisconnect = () => {
  webrtcStore.disconnectMedia()
  webrtcStore.disconnectData()
}
const sendMessage = () => {
  webrtcStore.sendData(sendText.value)
}
</script>

<template>
  <div class="main">
    <h1>peer to peer - WebRTC</h1>
    <div>
      <button @click="openPeer">open Peer</button>
    </div>
    <div>
      <div>
        <div class="">myPeerId: {{ webrtcStore.myPeerId }}</div>
      </div>
      <div class="">
        name: <input type="text" class="another_id" v-model="webrtcStore.myName" /><br />
        <input type="text" class="another_id" v-model="yourId" />
        <button @click="runConnect">connect</button>
        <br />
        <button @click="runDisconnect">disconnect</button>
      </div>
    </div>
    <br />

    <div>
      <div class="">
        <button @click="closePeer">close connection</button>
      </div>

      <div class="">
        <div>
          <input type="text" v-model="sendText" />
          <button @click="sendMessage">メッセージ送信</button>
        </div>
        <div class="" v-for="(item, index) in webrtcStore.messageData" :key="index">
          {{ item.who }}: {{ item.message }}
        </div>
      </div>
      <br />

      <div class="">
        <div class="videos">
          <div class="videos_local">
            <h3>local</h3>
            <video class="video" id="video1" autoplay muted playsinline></video>
          </div>
          <div class="videos_remote">
            <h3>remote</h3>
            <video class="video" id="video2" autoplay muted playsinline></video>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.another_id {
  width: 500px;
}

.videos {
  display: flex;
  flex-flow: row nowrap;

  .video {
    width: 400px;
    height: 350px;
  }
}
</style>
