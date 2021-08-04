
const passwordContainer = document.querySelector('.passwordContainer');
const userInfoBox = document.querySelector('.container');
document.querySelector('.fa-user').addEventListener('click', () => {
    passwordContainer.style.display = 'block';
    userInfoBox.style.display = 'none';
})
let check = false;
let attendance = '';
const data = document.cookie.split(';');
data.forEach(item => {
    if (item.includes('status')) {
        check = true;
    }
	
    if (item.includes('attendance')) {
        attendance = item.split('=')[1]
    }
})

if(check)
   document.querySelector('.message').innerHTML = '출석완료'; 
else
    document.querySelector('.message').innerHTML = '출석 불가능!';
let deleteCookie = function (name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
}
document.querySelector('.fa-cookie-bite').addEventListener('click', () => {
    let check = window.prompt("비밀번호를 입력해주세요.")
	
    if (check = 'kcch1234!') {
        deleteCookie('name');
        deleteCookie('year');
        deleteCookie('status');

        window.location.href = `/`;
    }
})
function onCancle() {
    passwordContainer.style.display = 'none';
    userInfoBox.style.display = 'block';
}
