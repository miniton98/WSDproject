import { app } from "../app.js";
import { superoak } from "https://deno.land/x/superoak@2.3.1/mod.ts";
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.78.0/testing/asserts.ts";
import * as authController from "../routes/controllers/authController.js";
import * as Service from "../services/behaviorService.js";
import * as authService from "../services/authService.js";

let curdate;

Deno.test("testing getData from authController", () => {
    assertEquals(authController.getData(), {email: "", emailCorrect: null, errors: [],password: "",  passwordCorrect: null, verification: "", });
});

Deno.test("testing getNav", () => {
    assertEquals(authController.getNav(), {
        auth : false,
        email : '',
        avgToday: 0,
        avgYesterday: 0
    });
});

//change the expected value according to the current date in format YYYY-MM-DD
Deno.test("get current date", async() => {
    const today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    const date = `${yyyy}-${mm}-${dd}`;
    const ret = await Service.getCurrentDate();
    const body = ret.rowsOfObjects()[0];
    curdate = body.to_char;
    assertEquals(curdate, date);
});

Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
  }

//change the expected value according to current week and year
Deno.test("get current week", async() => {
    const today = new Date();
    var w = today.getWeek();
    var yyyy = today.getFullYear();
    const ret = await Service.getCurrentWeek();

    assertEquals(ret.rowsOfObjects()[0], { week: w, year: yyyy});
});

//change the expected value according to current year and month in format YYYY-MM
Deno.test("get current month", async() => {
    const today = new Date();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    
    if(mm<10) mm='0'+mm;
    
    const ret = await Service.getCurrentMonth();
    const body = ret.rowsOfObjects()[0];
    assertEquals(body, { month: mm, year: yyyy,});
});

Deno.test("get week by date", async() => {
    const date = '2020-12-07';
    const ret = await Service.getWeekByDate(date);
    const body = ret.rowsOfObjects()[0];
    assertEquals(body, { week: 50, year: 2020,} );
});

Deno.test("get month by date", async() => {
    const date = '2020-11-07';
    const ret = await Service.getMonthByDate(date);
    const body = ret.rowsOfObjects()[0];
    assertEquals(body.to_char, '2020-11' );
});


Deno.test("test add morning", async() => {
    const res = await Service.selectAll(1, '2020-12-23');
    if (res.rowCount > 0) {
        await Service.addMorning2(7, 4, 5, '2020-12-23', 1);
    } else {
        await Service.addMorning(7, 4, 5, '2020-12-23', 1);
    }

    const ret = await Service.selectAll(2, '2020-12-23');
    if (ret.rowCount > 0) {
        await Service.addMorning2(9, 2, 4, '2020-12-23', 2);
    } else {
        await Service.addMorning(9, 2, 4, '2020-12-23', 2);
    }
});

Deno.test("test add evening", async() => {
    const res = await Service.selectAll(1, '2020-12-23');
        if (res.rowCount > 0) {
            await Service.addEvening2(3, 10, 4, 5, 3, '2020-12-23', 1);
        } else {
            await Service.addEvening(3, 10, 4, 5, 3, '2020-12-23', 1);
        }
        const ret = await Service.selectAll(2, '2020-12-23');
        if (ret.rowCount > 0) {
            await Service.addEvening2(1, 8, 3, 3, 5, '2020-12-23', 2);
        } else {
            await Service.addEvening(1, 8, 3, 3, 5, '2020-12-23', 2);
        }
});


//works if not redirected
Deno.test("testing authentication middleware to /behavior", async() =>{
    const testClient = await superoak(app);
    await testClient.post('/behavior/reporting').expect(401);
});

Deno.test("testing authentication middleware to /auth", async() =>{
    const testClient = await superoak(app);
    await testClient.post('/auth/login').expect(200);
});



Deno.test({name: "test api for specific day",
    async fn() {
        const response = await fetch('http://localhost:7777/api/summary/2020/12/23');
    const body = await response.json();
    
    assertEquals(body, {"sleep_duration":8,"sleep_quality":"3.00","exercise_duration":2,"study_time":9,"mood":"4.25"});
    },
    sanitizeResources: false,
    sanitizeOps: false
   
});

//works if not redirected
Deno.test({name: "add user",
    async fn() {
        const testClient = await superoak(app);
        await testClient.post('/auth/register').send('email=test@test.com').send('password=test').send('verification=test').expect(200);
    },
    sanitizeResources: false,
    sanitizeOps: false
   
});


Deno.test({name: "get user and if password is stored as hash",
    async fn() {
        const res = await authService.getUser('test@test.com');
        const user = res.rowsOfObjects()[0];
        assertEquals(user.email, 'test@test.com');
        assertNotEquals(user.password, 'test');
    },
    sanitizeResources: false,
    sanitizeOps: false
   
});

//works if not redirected
Deno.test("login", async() => {
    const testClient = await superoak(app);
    await testClient.post('/auth/login').send('email=test@test.com').send('password=test').expect(200);
});





/*
Deno.test("add user", async() => {
    const testClient = await superoak(app);
    await testClient.post('/auth/register').send('email=test@test.com').send('password=test').send('verification=test').expect(200);
});*/

/*
Deno.test("testing logout", async() => {
    const testClient = await superoak(app);
    let response = await testClient.get("/").set('session', 'authenticated=true').set('session', 'user = {id: id,email: email}').send();
  
    await testClient.get('/auth/logout');
    const session = response.headers['set-session'];
  assertMatch(session, new RegExp('authenticated=null'));
  assertMatch(session, new RegExp('user=null'));
    //assertEquals(await session.get('authenticated'), null);
    //assertEquals(await session.get('user'), null);
});

/*
Deno.test("get user and if password is stored as hash", async() => {
    const res = await authService.getUser('test@test.com');
    const user = res.rowsOfObjects()[0];
    assertEquals(user.email, 'test@test.com');
    assertNotEquals(user.password, 'test');
});*/
