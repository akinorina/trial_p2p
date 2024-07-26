import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Peer } from 'peerjs'

export const useWebrtcStore = defineStore('webrtc', () => {
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

  // UserMedia
  const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

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

    // Media Coonection 着信
    peer.value.on('call', function (call) {
      // console.log('--- on.call() ---');

      getUserMedia(
        { video: true, audio: false },
        function (localStream) {
          // console.log('--- getUserMedia() --- ')

          call.answer(localStream) // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            // console.log('--- getUserMedia() - on.stream 1 --- ')
            // Show stream in some video/canvas element.
            videoRemote.value.srcObject = remoteStream
            videoRemote.value.play()

            // console.log('--- getUserMedia() - on.stream 2 --- ')
            videoLocal.value.srcObject = localStream
            videoLocal.value.play()

            // console.log('--- getUserMedia() - on.stream 3 --- ')
          })
        },
        function (err) {
          console.log('Failed to get local stream', err)
        }
      )
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

  // Data Connection メッセージの送信
  function send(sendText) {
    const sendData = { who: myName.value, message: sendText };
    dataConn.value.send(sendData)
    messageData.value.push(sendData)
  }

  // Media Coonection 発信
  function call(remoteId) {
    console.log('--- call() ---');

    getUserMedia(
      { video: true, audio: false },
      function (localStream) {
        // console.log('--- call() - localStream 1 ---');
        videoLocal.value.srcObject = localStream
        videoLocal.value.play()
        // console.log('--- call() - localStream 2 ---');

        // call
        // console.log('call to ', remoteId)
        var call = peer.value.call(remoteId, localStream)
        // console.log('--- call() ---', call);
        call.on('stream', function (remoteStream) {
          // console.log('--- call() - remoteStream 1 ---');
          // Show stream in some video/canvas element.
          videoRemote.value.srcObject = remoteStream
          videoRemote.value.play()
          // console.log('--- call() - remoteStream 2 ---');
        })
      },
      function (err) {
        console.log('Failed to get local stream', err)
      }
    )
  }

  // ローカルのカメラの動作確認
  function runLocalMedia() {
    // console.log('--- tmpRun() ---')
    getUserMedia(
      { video: true, audio: false },
      function (localStream) {
        // console.log('--- call() - localStream 1 ---');

        videoLocal.value.srcObject = localStream
        videoLocal.value.play()

        // console.log('--- call() - localStream 2 ---');

        // setTimeout(() => {
        //   videoLocal.value.pause()
        // }, 5000)
      },
      function (err) {
        console.log('Failed to get local stream', err)
      }
    )
  }

  return {
    myName,
    myPeerId,
    messageData,
    videoLocal,
    videoRemote,
    init,
    connect,
    send,
    call,
    runLocalMedia
  }
})
