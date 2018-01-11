# Cookie
쿠키를 이용한 쇼핑카드 만들기

### 모듈 import

```javaScript
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
```

### 쿠키 미들웨어 등록

- 쿠키파서가 서버의 요청이 들어올 때 쿠키 관련 정보를 해석해서 reqest, response에서 사용할 수 있도록 해준다
- 파서에 키 값을 넣어주면 쿠키를 암호화해서 저장할 수 있다
```javaScript 
app.use(cookieParser('SECRET'));
```

### WorkFlow

- 전체 상품 보여주기

    ```javaScript
    var products = {
        1 : {title : 'the history of web'},
        2 : {title : 'the next web'}
    }
    ```

    ```javaScript
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
    ```

- 카트에 담기

    - 제품을 눌렀을 때 제품 번호로 카트에 담기고 카트 페이지로 넘어감
    - 쿠키가 존재하는직 확인, 없으면 값 설정
    - 쿠기가 있으면 추가된 제품인지 확인

    ```javaScript
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
    ```

- 카트 count+1

    ```javaScript
    app.get('/count', (req, res)=>{
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
    ```

- 카트 확인

    - 쿠키가 없으면 비어있음을 공지, 있으면 목록 보여줌

    ```javaScript
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
    ```
