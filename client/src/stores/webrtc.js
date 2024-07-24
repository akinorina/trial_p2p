import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Peer } from 'peerjs'

export const useWebrtcStore = defineStore('webrtc', () => {
  // my peer name.
  const myName = ref('')

  // peer
  const peer = ref(null)

  // data connection
  const dataConn = ref()

  // 送信メッセージ
  const sendMessages = ref('')

  // 送受信メッセージデータ
  const messageData = ref([])

  // my ID.
  const myId = ref('')
  // const myId = computed(() => peer.value.id)

  // your ID.
  const yourId = ref('')

  function init() {
    peer.value = new Peer({
      host: '192.168.11.3',
      port: 9000,
      path: '/'
    })
    setTimeout(() => {
      // console.log('peer.value', peer.value)
      // console.log('peer.value.id', peer.value.id)
      myId.value = peer.value.id
    }, 3000)

    // 接続された
    peer.value.on('connection', (conn) => {
      console.log('--- on connection ---', conn)

      conn.on('data', (data) => {
        // Will print 'hi!'
        // console.log('--- recieved ---')
        // console.log(data)
        messageData.value.push({ who: '相手', message: data })
      })

      conn.on('open', () => {
        const firstMsg = 'hello! my name is ' + myName.value
        conn.send(firstMsg)
        messageData.value.push({ who: '私', message: firstMsg })
      })
    })
  }

  function connectTo() {
    console.log('--- connectTo() ---')
    dataConn.value = peer.value.connect(yourId.value)

    dataConn.value.on('open', () => {
      const messages = 'hi! my name is ' + myName.value
      dataConn.value.send(messages)
      messageData.value.push({ who: '私', message: messages })
    })
  }

  function send() {
    console.log('--- send() ---')
    dataConn.value.send(sendMessages.value)
    messageData.value.push({ who: '私', message: sendMessages.value })
  }

  return { myName, myId, yourId, messageData, sendMessages, init, connectTo, send }
})
