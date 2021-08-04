const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require("dotenv").config();

let mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: process.env.DB_HOST,		//db접속주소
    port: process.env.DB_PORT,					//db접속포트
    user: process.env.DB_USER,					//db접속id
    password: process.env.DB_PASSWORD,		//db접속pw
    database: process.env.DB_DATABASE	
});

let _url = null;
const app = express()
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
function weekCount(today) {
    let year = today.getFullYear();
    let countDay = new Date(year, 0, 1);
    let week = 1;

    while (today > countDay) {
        countDay.setDate(countDay.getDate() + 1);
        let countNum = countDay.getDay();
        if (countNum == 0)
            week++;
        
    }
    return week;
}

let newToday = new Date();
let newMonth = newToday.getMonth() + 1;
let newDate = newToday.getDate();

newMonth = newMonth >= 10 ? newMonth : '0' + newMonth;
newDate = newDate >= 10 ? newDate : '0' + newDate;

app.get('/', async (req, res) => {
    let day = new Date().getDay();
    const month = new Date().getMonth();
    const date = new Date().getDate();
    const statusExpiredDate = new Date(2021, month, date, 23, 0, 0);
    day = 0;
    time = 14;
    let check = true;
    const id = req.query.id;

    if (day === 0 && id) {
        res.cookie('check', 'false');
        if (req.cookies.status) {
            if (id) {
                check = false;
                res.redirect('/');
            }
            else
                _url = '/html/exception.html';
        }
        else if (req.cookies.name) {
            try {
                
                res.cookie('status', 'accepted', { expires: statusExpiredDate });
                _url = '/html/approval.html';
            } catch (err) {
                res.send("failed");
            }
        }
        else
            _url = '/html/index.html';
    }
    else
        _url = '/html/exception.html';
    
    if (check) {
        res.sendFile(__dirname + _url);
    }
   
})
app.get('/error',(req,res) => {
	_url = '/html/error.html';
	res.sendFile(__dirname + _url);		
})
app.get('/admin', (req, res) => {
    if (req.cookies.check === 'true') {
        _url = '/html/manage.html';
        res.sendFile(__dirname + _url)
    }
    else
        res.redirect('/');
})
app.post('/check_attendance', async (req, res) => {
    const year = req.body.birthYear;
    const name = req.body.name;
    const id = req.body.id;
    const expiredDate = new Date('December 31, 2021 23:59:59')
    const week = weekCount(new Date())-1;
    
    try {
	const check = await pool.query(`select @ERCODE`);
        const key = '@ERCODE';
        const value = check[0][0][key];
	if(value === '03'){
           res.redirect(`/error/?id=${id}`);
	}
	else{
	   res.cookie('name',escape(name),{expires: expiredDate});
	   res.cookie('year',year,{expires:expiredDate});
           res.redirect(`/?id=${id}`);
	}
	} catch (err) {
	    res.redirect(`/error/?id=${id}`);
    	}
    
})

app.post('/password', (req,res) => {
    const password = req.body.password;
    if (password === 'kcch1234!') {
        res.cookie('check','true');
        res.redirect('/admin');
    }
    else {
        res.cookie('check','false');
        _url = '/html/password.html';
        res.sendFile(__dirname + _url);
    }
})

//////////////////////////// 관리자모드 ///////////////////////////
//관리자모드
//전체 데이터 http://localhost:3000/information 으로 전송
app.get('/information', async function (req, res) {
    
    try {
        const query1 = await pool.query(`CALL select_checkinfo(@selectQuery)`);
        const query2 = await pool.query(`select @selectQuery`);
        const key = '@selectQuery';
        const value = query2[0][0][key];
        const result = await pool.query(value);
        res.send(result[0]);
        return result;
    } catch (err) {
        res.send("failed");
    }
})

//관리자모드
//수정
app.post('/update', async (req, res) => {
    let originalName = req.body.originalName; // 수정 전 이름
    let newName = req.body.newName; // 수정 후 이름
    let originalbirthYear = req.body.originalBirthYear; // 수정 전 또래
    let newBirthYear = req.body.newBirthYear; // 수정 후 또래
    try {
        const result = await pool.query(`call update_userinfo('${originalName}', '${originalbirthYear}', '${newName}', '${newBirthYear}', @Err)`);
        const result2 = await pool.query('select @Err');
        res.send("succeed");
        return result;
    } catch (err) {
        res.send("failed")
    }
})
app.post('/update__week', async (req, res) => {
    let name = req.body.name; 
    let birthYear = req.body.birthYear; 
    let date = req.body.date; 
    let value = req.body.value; 
    try {
        const result = await pool.query(`CALL update_checkinfo('${name}','${birthYear}','${date}','${value}', @ERCODE)`);
        res.send("succeed");
        return result;
    } catch (err) {
        res.send("failed")
    }

})


//0605 update
//날짜 th 수정
app.post('/update__date', async(req, res) =>{
    let olddate = req.body.olddate;
    let newdate = req.body.newdate;

    try {
        const result = await pool.query(`CALL update_daysinfo(${olddate}, ${newdate}, @ErCode)`);
        res.send("succeed");
        return result;
    } catch(err) {
        console.log(err);
        res.send("failed");
    }

})



//관리자모드
//날짜 추가
app.post('/createDate', (req, res) => {
    const date = req.body.createNewDate; //추가하는 날짜
    try {
        const result = pool.query(`CALL insert_daysinfo(${date}, @ErCode)`)
    } catch(err) {
	console.log(err);
    }
    res.redirect('/admin');
})


//관리자모드
//사용자 추가
app.post('/create', (req, res) => {
    const createBirthYear = req.body.createBirthYear; // 추가하는 사용자 또래
    const createName = req.body.createName; // 추가하는 사용자 이름
    const week = weekCount(new Date())-1;
    try {
        const result = pool.query(`CALL insert_userinfo('${createName}', '${createBirthYear}', '${week}', @WEEK)`)
    } catch (err) {
	console.log(err);
    }

    res.redirect('/admin');
})

//관리자모드
//삭제
app.post('/delete', async(req, res) => {
    let deleteBirthYear = req.body.deleteBirthYear; // 삭제할 사용자 또래
    let deleteName = req.body.deleteName; // 삭제할 사용자 이름
   try {
        const result = await pool.query(`call delete_userinfo('${deleteName}', '${deleteBirthYear}')`);
        res.send("succeed!");
    } catch(err) {
        console.log(err);
        res.send("failed");
    }
})

//0605 update
//날짜 th 삭제
app.post('/delete__date', async(req, res) => {
    let date = req.body.deleteNewDate;
    try {
        const result = await pool.query(`CALL delete_daysinfo(${date}, @ErCode)`);
        res.redirect('/admin');
    } catch(err) {
        console.log(err);
        res.send("failed");
    }
    //res.redirect('/admin');
})

app.post('/status', (req, res) => {
    current_status = req.body.status;
    
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
