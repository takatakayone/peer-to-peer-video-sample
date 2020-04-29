
let localStream;

navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(stream => {
    const videoElm = document.getElementById('my-video');
    videoElm.srcObject = stream;
    videoElm.play();

    localStream = stream;
  }).catch( error => {
    console.error("mediaDevice.getUserMedia() error:", error);
    return;
  });


let peer = null;
const peerId = "TestPeerId" + Math.floor((Math.random() * 100) + 1);
const apiKey = "api_key";

$('document').ready(function() {
  $('#authenticate-button').click(function() {
    $.post('http://localhost:3000/authenticate',
      {
        peerId: peerId,
        sessionToken: 'session_token'
      }, function (credential) {
        // $('#result').text(JSON.stringify(credential, null, 2));

        peer = new Peer(peerId, {
          key: apiKey,
          credential: credential,
          debug: 3
        });

        // PeerId(電話番号みたいなもの)の取得の処理
        peer.on('open', () => {
          document.getElementById('my-id').textContent = peer.id;

        });

        // 着信の処理
        peer.on('call', mediaConnection => {
          mediaConnection.answer(localStream);
          setEventListener(mediaConnection);
        });

        // エラーイベント
        peer.on('error', err => {
          alert(err.message);
        });

        // closeイベント
        peer.on('close', () => {
          alert('通信が切断しました。');
        });


      }
    ).fail(function () {
      alert('Peer Authentication Failed');
    });
  });
});


// 発信の処理
document.getElementById('make-call').onclick = () => {
  const theirID = document.getElementById('their-id').value;
  const mediaConnection = peer.call(theirID, localStream);
  setEventListener(mediaConnection);
};

const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    const videoElm = document.getElementById('their-video');
    videoElm.srcObject = stream;
    videoElm.play();
  })
};

