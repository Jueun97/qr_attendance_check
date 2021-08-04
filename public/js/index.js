const birthYear = document.querySelector('.birthYear');
let minYear = 65;
let maxYear = 2;
while(1){
    let year = document.createElement('option');
    if(Math.floor(maxYear / 10) === 0 ){
        year.setAttribute('value','0' + maxYear);
        year.innerHTML = '0' + maxYear;
    }else{
        year.setAttribute('value', maxYear);
        year.innerHTML = maxYear;
    }
    maxYear--;

    if(maxYear === -1){
        maxYear = 99;
    }
    birthYear.appendChild(year);

    if(maxYear === minYear)
        break;
}
const passwordContainer = document.querySelector('.passwordContainer'); 
const userInfoBox = document.querySelector('.container');
document.querySelector('.fa-user').addEventListener('click',()=>{
passwordContainer.style.display = 'block';
userInfoBox.style.display = 'none';

})
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
document.querySelector('.form__item-id').value = id;
function onCancle(){
passwordContainer.style.display = 'none';
userInfoBox.style.display = 'flex';
}
