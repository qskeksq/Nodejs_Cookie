// 1. 모듈 import
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var count=0;

// 2. 미들웨어 등록
// 쿠키파서가 서버의 요청이 들어올 때 쿠키 관련 정보를 해석해서 reqest, response에서 사용할 수 있도록 해준다
// 파서에 키 값을 넣어주면 쿠키를 암호화해서 저장할 수 있다
app.use(cookieParser('awlefijawefwf3'));

app.get('/count', (req, res)=>{
    // 위에 미들웨어를 사용함으로 두 객체에서 cookie()메소드를 사용할 수 있게 되었다
    // 이렇게 해 줌으로써 response의 Set-Cookie에 count변수로 1이 생김을 알 수 있다
    // 또한 request 객체에 담겨오는 cookies에서 내가 만들어준 count를 꺼내 사용할 수 있다 
    if(req.signedCookies.count){
        // 전송되고 전송할 때는 문자로 주고받기 때문에 숫자로 사용하려면 숫자로 바꿔줘야 한다
        count = parseInt(req.cookies.count);
        count++;
    } else {
        // 없으면 초기화
        count = 0;
    }
    res.cookie('count', count, {signed:true});
    res.send('count : '+count);
});

//--------------------------------
// 쇼핑카트 만들기
//--------------------------------

// 임시 저장소 -> 데이터베이스
var products = {
    1 : {title : 'the history of web'},
    2 : {title : 'the next web'}
}


// 3. express 라우팅

/**
 * 3.1 전체 제품 목록
 */
app.get('/products', (req, res)=>{
    var output = '';
    // name에는 products의 '키'가 리턴된다
    for(var name in products){
        // `${ 이 안을 변수로 사용할 수 있다 }`
        // <li></li>는 HTML 리스트
        // <a href="">는 클릭시 링크로 이동, 역시 ${}를 이용해서 변수를 자유롭게 변경할 수 있다
        output += `
            <li>
                <a href="/cart/${name}">${products[name].title}</a>
            </li>`
        // 객체에서 값을 꺼내는 방법 2가지 사용
        console.log(products[name].title);
    }
    output = `
        <h1>Products</h1>
        <ul>${output}</ul>
        <a href="/cart">Cart</a>`;
    res.send(output);
});

/*
    cart = {
        제품 아이디 : 제품 수량,
        1:2,
        2:3
    }
*/

/**
 * 3.2 카트 추가 페이지
 * 제품을 눌렀을 때 제품 번호로 카트에 담기고 카트 페이지로 넘어감
 * 1. 쿠키의 존재 여부
 * 2. 쿠키 내부 값이 이미 존재하는지 여부
 */ 
app.get('/cart/:id', (req, res)=>{
    var id = req.params.id;
    var cart = {}; 
    // 기존에 쿠키가 존재할 경우
    if(req.signedCookies.cart){
        cart = req.signedCookies.cart;
    } 
    // 카트에 들어갔는데 처음 담은 상품이라면 0부터 시작
    if(!cart[id]){
        cart[id] = 0;
    }
    // +1
    cart[id] = parseInt(cart[id]) + 1;
    // 쿠키 설정
    res.cookie('cart', cart, {signed:true});
    // res.send(cart);
    res.redirect('/cart');
});

// 3.3 카트 페이지
app.get('/cart', (req, res)=>{
    var cart = req.signedCookies.cart;
    if(!cart){
        res.send('Cart is Empty');
    } else {
        var output = '';
        for(var id in cart){
            output += `<li>${id}</li>`
        }
    }
    res.send(`<ul>${output}</ul>`);
});

// 서버 등록
app.listen(3000, function(){
    console.log('server is running');
});