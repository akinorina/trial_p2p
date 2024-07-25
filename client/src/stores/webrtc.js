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

  // videos
  const videoLocal = ref()
  const videoRemote = ref()

  // MediaDevices
  console.log('navigator', navigator)
  if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    // List cameras and microphones.
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }

  // UserMedia
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

  function init() {
    // 初期設定
    peer.value = new Peer({
      protocol: 'https',
      host: 'espresso.local',
      port: 443,
      path: '/peer-server',
      // proxied: true,
      // config: { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }], 'sdpSemantics': 'unified-plan' }
    })
    setTimeout(() => {
      // console.log('peer.value', peer.value)
      // console.log('peer.value.id', peer.value.id)
      myId.value = peer.value.id
    }, 3000)

    // チャット 着信
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

    // Video通話接続 着信
    peer.value.on('call', function (call) {
      console.log('--- on.call() ---');

      navigator.mediaDevices.getUserMedia(
        {
          video: {
            facingMode: 'environment'
          },
          audio: false
        },
        function (localStream) {
          console.log('--- getUserMedia() --- ')

          call.answer(localStream) // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            console.log('--- getUserMedia() - on.stream 1 --- ')
            // Show stream in some video/canvas element.
            videoRemote.value.srcObject = remoteStream
            videoRemote.value.play()

            console.log('--- getUserMedia() - on.stream 2 --- ')
            videoLocal.value.srcObject = localStream
            videoLocal.value.play()

            console.log('--- getUserMedia() - on.stream 3 --- ')
          })
        },
        function (err) {
          console.log('Failed to get local stream', err)
        }
      )
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

  // Video通話接続
  function call() {
    console.log('--- call() ---');

    navigator.mediaDevices.getUserMedia(
      { video: true, audio: false },
      function (localStream) {
        console.log('--- call() - localStream 1 ---');
        videoLocal.value.srcObject = localStream
        videoLocal.value.play()
        console.log('--- call() - localStream 2 ---');

        // call
        console.log('call to ', yourId.value)
        var call = peer.value.call(yourId.value, localStream)
        console.log('--- call() ---', call);
        call.on('stream', function (remoteStream) {
          console.log('--- call() - remoteStream 1 ---');
          // Show stream in some video/canvas element.
          videoRemote.value.srcObject = remoteStream
          videoRemote.value.play()
          console.log('--- call() - remoteStream 2 ---');
        })
      },
      function (err) {
        console.log('Failed to get local stream', err)
      }
    )
  }

  function tmpRun() {
    console.log('--- tmpRun() ---')

    getUserMedia(
      { video: true, audio: false },
      function (localStream) {
        console.log('--- call() - localStream 1 ---');
        videoLocal.value.srcObject = localStream
        videoLocal.value.play()
        console.log('--- call() - localStream 2 ---');

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
    myId,
    yourId,
    videoLocal,
    videoRemote,
    messageData,
    sendMessages,
    init,
    connectTo,
    send,
    call,
    tmpRun
  }
})
