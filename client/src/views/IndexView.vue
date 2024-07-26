<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useWebrtcStore } from '@/stores/webrtc'

// チャット先 ID
const yourId = ref('')

// 送信メッセージ
const sendText = ref('')

const webrtcStore = useWebrtcStore()
webrtcStore.init({
  host: import.meta.env.VITE_PEER_SERVER_HOST,
  port: import.meta.env.VITE_PEER_SERVER_PORT,
  path: import.meta.env.VITE_PEER_SERVER_PATH
})

onMounted(() => {
  // local Video
  webrtcStore.videoLocal = document.getElementById('video1')
  // remote Video
  webrtcStore.videoRemote = document.getElementById('video2')
})

const runConnect = () => {
  webrtcStore.connect(yourId.value)
}

const runCall = () => {
  webrtcStore.call(yourId.value)
}
</script>

<template>
  <div class="main">
    <h1>peer to peer - WebRTC</h1>
    <div>
      <div class="">myPeerId: {{ webrtcStore.myPeerId }}</div>

      <div class="">
        name: <input type="text" class="another_id" v-model="webrtcStore.myName" /><br />
        <input type="text" class="another_id" v-model="yourId" /><br />
      </div>
      <div class=""><button @click="runConnect">connect</button></div>

      <div class="">
        <div>
          <input type="text" v-model="sendText" />
          <button @click="webrtcStore.send(sendText)">メッセージ送信</button>
        </div>
        <div class="" v-for="(item, index) in webrtcStore.messageData" :key="index">
          {{ item.who }}: {{ item.message }}
        </div>
      </div>
      <br />

      <div class="">
        <button @click="runCall">run call</button><br />
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

      <div class="">
        <button @click="webrtcStore.runLocalMedia">tmp run</button>
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
    width: 500px;
    height: 400px;
  }
}
</style>
