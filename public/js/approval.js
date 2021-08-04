const data = document.cookie.split(';');
console.log(data);
data.forEach(item => {
    if(item.includes('year')){
        year = item.split('=')[1];
        console.log(item.split('=')[1])
    }
    else if(item.includes('name')){
        name = unescape( item.split('=')[1]);
    }
})
const userInfo = document.querySelector('.userInfo');
userInfo.innerHTML = `${year}또래 ${unescape(name)}`;

const passwordContainer = document.querySelector('.passwordContainer');
const userInfoBox = document.querySelector('.container');
document.querySelector('.fa-user').addEventListener('click',()=>{

    passwordContainer.style.display = 'block';
    userInfoBox.style.display = 'none';
    
})
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch(`http://193.123.254.109:3030/`, {
        method: 'POST', // or 'PUT'
        mode: 'no-cors',  //이부분!!!!!!!!
        referrer: 'no-referrer',
        headers: {
            'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    body : JSON.stringify({ //server.js에 전달할 json 형태
       id,
       name
    })
})

function onCancle(){
    passwordContainer.style.display = 'none';
    userInfoBox.style.display = 'block';
}
 let deleteCookie = function(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
    }
    document.querySelector('.fa-cookie-bite').addEventListener('click',()=>{
        let check = confirm("정보를 삭제하시겠습니까? (잘못 입력한 정보인 경우!!)");

        if(check){
        deleteCookie('name');
        deleteCookie('year');
    deleteCookie('status');

        window.location.href = `/?id=${id}`;
        }
    })
setTimeout(reFresh,5000);
function reFresh(){
    window.location.href = '/';
    
}
