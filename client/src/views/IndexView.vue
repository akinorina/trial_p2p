<script setup>
import { Peer } from "peerjs";
import { ref } from 'vue';

const myId = ref('')
const anotherId = ref('')

const peer = new Peer({
  host: '192.168.11.3',
  port: 9000,
  path: '/'
});
setTimeout(() => {
  console.log('peer', peer)
  console.log('peer.id', peer.id)
  myId.value = peer.id
}, 1000)

peer.on("connection", (conn) => {
  conn.on("data", (data) => {
    // Will print 'hi!'
    console.log('--- recieved ---')
    console.log(data);
  });
  conn.on("open", () => {
    conn.send("hello!");
  });
});

const connectRtc = () => {
  console.log('--- connect() ---')
  const conn = peer.connect(anotherId.value);
  conn.on("open", () => {
    conn.send("hi!");
  });
}
</script>

<template>
  <div class="main">
    <div>
    hello.
    </div>
    <div>
      <div class=""><input type="text" class="another_id" v-model="anotherId" /><br />{{ anotherId }}</div>
      <div class=""><button @click="connectRtc">connect</button></div>
      <div class="">myID; {{ myId }}</div>
    </div>
  </div>
</template>

<style scoped>
.another_id {
  width: 500px;
}
</style>