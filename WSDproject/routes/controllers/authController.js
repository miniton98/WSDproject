import * as authService from "../../services/authService.js";
//import {genSalt, compare, hash, genSaltSync, compareSync, hashSync} from "../../deps.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const getData = () => {
    const data = {
      email: '',
      password: '',
      verification: '',
      emailCorrect: null,
      passwordCorrect: null,
      errors: []
    };
    return data;
}


const getNav = () => {
    const nav = {
        auth : false,
        email : '',
        avgToday: 0,
        avgYesterday: 0
    };

    return nav;
}

const landingpage = async({render, session}) => {
    const nav = getNav();
    
    if (session && await session.get('authenticated')){
        nav.auth = true;
        nav.email = (await session.get('user')).email;
        const id = (await session.get('user')).id;
        const amt = await authService.getAvgMoodToday(id);
        const amy = await authService.getAvgMoodYesterday(id);
        if (amt.rowCount > 0){
            const tavg = amt.rowsOfObjects()[0];
            nav.avgToday = tavg.avg;
        }
        if (amy.rowCount > 0){
            const yavg = amy.rowsOfObjects()[0];
            nav.avgYesterday = yavg.avg;
        }
    }
    render('index.ejs', nav);
}


const showLoginForm = ({render}) => {
    render('login.ejs', getData());
}


const showRegistrationForm = ({render}) => {
    render('register.ejs', getData());
}



const postLoginForm = async({request, response, session, render}) => {
    //takes parameters
    const body = request.body();
    const params = await body.value;

    const data = await getData();
    data.email = params.get('email');
    data.password = params.get('password');
  
    // check if the email exists in the database
    const res = await authService.getUser(data.email);
     // take the first row from the results
     const userObj = res.rowsOfObjects()[0];
     
    if (res.rowCount > 0) {
        data.emailCorrect = true;
        //gets hashed password
        const hash = userObj.password;
        //compares passwords
        data.passwordCorrect = await bcrypt.compare(data.password, hash);
    } else {
        data.emailCorrect = false;
    }
    
    if (data.emailCorrect && data.passwordCorrect){
        //sets session cookie to be authenticated
        await session.set('authenticated', true);
        await session.set('user', {
            id: userObj.id,
            email: userObj.email
        });
        response.status = 200;
        response.redirect('/');   //comment out when running tests to pass
    } else {
        data.errors.push('Incorrect email or password.');
        response.status = 401;
        render('login.ejs', data);
    }
}



const postRegistrationForm = async({request, response, render}) => {
    //geting parameters from the form
    const body = request.body();
    const params = await body.value;
    
    const data  = getData();
    data.email = params.get('email');
    data.password = params.get('password');
    data.verification = params.get('verification');

    //checks if the email is already in use
    const existingUsers = await authService.getUser(data.email);
    if (existingUsers.rowCount > 0) {
      data.errors.push('The email is already reserved.');
    }
    if (data.email.length === 0) {
        data.errors.push('Email is required');
    }
    //checks password length
    if (data.password.length < 4) {
        data.errors.push('The password must be a minimum of 4 characters');
    }
    //checks weather the password and the re-entered password are identical
    if (data.password !== data.verification) {
        data.errors.push('The entered passwords did not match');
    }

    if (data.errors.length > 0) {
        response.status = 401;
        render('register.ejs', data);
    } else {
         //hashes the new password and adds the user
        const hash = await bcrypt.hash(data.password);
        authService.addUser(data.email, hash);
        response.status = 200;
        response.redirect('/auth/login'); //comment out when running tests to pass
    }
}

const logout = async({session, response}) => {
    await session.set('authenticated', null);
    await session.set('user', null);

    response.redirect('/');
}

export {landingpage, showLoginForm, showRegistrationForm, postLoginForm, postRegistrationForm, logout, getData, getNav};