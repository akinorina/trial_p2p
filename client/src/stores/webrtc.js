import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Peer } from 'peerjs'

export const useWebrtcStore = defineStore('webrtc', () => {
  // host name.
  const hostName = ref('host')

  // my peer name.
  const myName = ref('')

  // my Peer ID.
  const myPeerId = ref('')

  // 送受信メッセージデータ
  const messageData = ref([])

  // videos
  const videoLocal = ref()
  const videoRemote = ref()

  // peer
  const peer = ref(null)

  // data connection
  const dataConn = ref()

  // media connection
  const mediaConn = ref()

  // UserMedia
  const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

  function open(options) {
    // Peerサーバー接続
    peer.value = new Peer({
      host: options.host,
      port: options.port,
      path: options.path
    })
    peer.value.on('open', () => {
      myPeerId.value = peer.value.id
    })
    peer.value.on('disconnected', () => {
      myPeerId.value = ''
    })

    // Data Connection 着信
    peer.value.on('connection', (conn) => {
      dataConn.value = conn;

      dataConn.value.on('open', () => {
        const sendData = { who: hostName.value, message: '接続しました。' }
        dataConn.value.send(sendData)
        messageData.value.push(sendData)
      })

      dataConn.value.on('data', (data) => {
        messageData.value.push(data)
      })

      dataConn.value.on('close', () => {
        dataConn.value.close()
      })
    })

    // Media Coonection 着信
    peer.value.on('call', function (call) {
      mediaConn.value = call

      getUserMedia(
        { video: true, audio: false },
        function (localStream) {
          mediaConn.value.answer(localStream) // Answer the call with an A/V stream.

          mediaConn.value.on('stream', (remoteStream) => {
            videoRemote.value.srcObject = remoteStream
            videoRemote.value.play()

            videoLocal.value.srcObject = localStream
            videoLocal.value.play()
          })

          mediaConn.value.on('close', () => {
            videoLocal.value.pause()
            videoLocal.value.srcObject = null
            videoRemote.value.pause()
            videoRemote.value.srcObject = null
            mediaConn.value.close()
          })
        },
        function (err) {
          console.log('Failed to get local stream', err)
        }
      )
    })
  }

  // Data Connection 発信
  function connectData(remoteId) {
    dataConn.value = peer.value.connect(remoteId)

    dataConn.value.on('open', () => {
      const sendData = { who: hostName.value, message: '接続しました。' }
      dataConn.value.send(sendData)
      messageData.value.push(sendData)
    })

    dataConn.value.on('data', (data) => {
      messageData.value.push(data)
    })

    dataConn.value.on('close', () => {
      dataConn.value.close()
    })
  }

  // Data Connection メッセージの送信
  function sendData(sendText) {
    const sendData = { who: myName.value, message: sendText };
    dataConn.value.send(sendData)
    messageData.value.push(sendData)
  }

  // Media Coonection 発信
  function connectMedia(remoteId) {
    getUserMedia(
      { video: true, audio: false },
      function (localStream) {
        videoLocal.value.srcObject = localStream
        videoLocal.value.play()

        // call
        mediaConn.value = peer.value.call(remoteId, localStream)

        mediaConn.value.on('stream', function (remoteStream) {
          videoRemote.value.srcObject = remoteStream
          videoRemote.value.play()
        })

        mediaConn.value.on('close', () => {
          videoLocal.value.pause()
          videoLocal.value.srcObject = null
          videoRemote.value.pause()
          videoRemote.value.srcObject = null
          mediaConn.value.close()
        })
      },
      function (err) {
        console.log('Failed to get local stream', err)
      }
    )
  }

  function disconnectData() {
    dataConn.value.close();
  }

  function disconnectMedia() {
    videoLocal.value.pause()
    videoLocal.value.srcObject = null
    videoRemote.value.pause()
    videoRemote.value.srcObject = null
    mediaConn.value.close()
  }

  function close() {
    peer.value.disconnect();
    myPeerId.value = ''
  }

  return {
    myName,
    myPeerId,
    messageData,
    videoLocal,
    videoRemote,

    open,
    close,
    connectData,
    sendData,
    disconnectData,
    connectMedia,
    disconnectMedia,
  }
})
