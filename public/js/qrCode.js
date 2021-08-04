const button = document.querySelector('.button');
const qrCode = document.querySelector('.qrCode');
const message = document.querySelector('.message');
const audio = document.querySelector('.audio');
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
button.addEventListener('click', () => {
button.style.display = 'none';
qrCode.style.display = 'block';
message.innerHTML = "준비 완료";
audio.currentTime = 0;
audio.play();
});
console.log("qrCode.html... id: ", id); 	

switch(id){
    case '1':
        qrCode.src='/qrCode/qr1.jpeg';
        break;
    case '2':
        qrCode.src='/qrCode/qr2.png';
        break;
    case '3':
        qrCode.src='/qrCode/qr3.png';
break;;
case '4':
        qrCode.src='/qrCode/qr4.png';
        break;
    case '5':
        qrCode.src='/qrCode/qr5.png';
        break;
    case '6':
        qrCode.src='/qrCode/qr6.png';
        break;
  default:
        message.innerHTML = '잘못된 url 입니다. 다시 확인해주세요.';
        button.style.display = 'none';
        qrCode.style.display = 'none';
}
let socket = io();
socket.on(`check${id}`, function (data) {
    console.log(unescape(data));
    onChecked(data);

data = "";
console.log("name: ", data,id);
});
function onChecked(data) {

let now = new Date();
let hour = now.getHours();
let min = now.getMinutes();
let sec = now.getSeconds();
    console.log("qr.html...checked..id: ", id, " ", hour, ":", min, ":", sec);
button.click();
    message.innerHTML = `${unescape(data)}님 출석체크 완료되었습니다.`;
}
