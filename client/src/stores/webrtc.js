import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Peer } from 'peerjs'

export const useWebrtcStore = defineStore('webrtc', () => {
  // my peer name.
  const myName = ref('')

  // my Peer ID.
  const myPeerId = ref('')

  // peer
  const peer = ref(null)

  // data connection
  const dataConn = ref()

  // 送受信メッセージデータ
  const messageData = ref([])

  function init(options) {
    // Peerサーバー接続
    peer.value = new Peer({
      host: options.host,
      port: options.port,
      path: options.path
    })
    peer.value.on('open', () => {
      myPeerId.value = peer.value.id
    })

    // Data Connection 着信
    peer.value.on('connection', (conn) => {
      dataConn.value = conn;

      conn.on('open', () => {
        const firstMsg = 'hello! my name is ' + myName.value
        const sendData = { who: myName.value, message: firstMsg }
        conn.send(sendData)
        messageData.value.push(sendData)
      })

      conn.on('data', (data) => {
        messageData.value.push(data)
      })
    })
  }

  // Data Connection 発信
  function connect(destId) {
    dataConn.value = peer.value.connect(destId)

    dataConn.value.on('open', () => {
      const sendData = { who: myName.value, message: 'hi! my name is ' + myName.value };
      dataConn.value.send(sendData)
      messageData.value.push(sendData)
    })

    dataConn.value.on('data', (data) => {
      messageData.value.push(data)
    })
  }

  // メッセージの送信
  function send(sendText) {
    const sendData = { who: myName.value, message: sendText };
    dataConn.value.send(sendData)
    messageData.value.push(sendData)
  }

  return { myName, myPeerId, messageData, init, connect, send }
})
