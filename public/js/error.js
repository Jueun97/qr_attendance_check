alert("잘못된 정보입니다! 다시 입력해주세요.");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
window.location.href = `/?id=${id}`;
