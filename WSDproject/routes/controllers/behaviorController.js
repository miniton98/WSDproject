import * as Service from "../../services/behaviorService.js";
import { validate, required, isNumeric, minNumber, maxNumber, isInt } from "../../deps.js";

const getData = async({session}) => {
    const data = {
        date: '',
        sleep_duration: '',
        sleep_quality: '',
        mood: '',
        exercise_time: '',
        study_time: '',
        eating_regularity: '',
        food_quality: '',
        morning_filled: false,
        evening_filled: false,
        errors: null,
        auth : true,
        email : '',
        id: ''
    };

    const date = await Service.getCurrentDate();
    data.date = (date.rowsOfObjects()[0]).to_char;
  
    data.email = (await session.get('user')).email;
    data.id = (await session.get('user')).id;

    const morning = await Service.checkReportedMorning(data.id);
    const evening = await Service.checkReportedEvening(data.id);
    if (morning.rowCount > 0){
        data.morning_filled = true;
    }
    if (evening.rowCount > 0){
        data.evening_filled = true;
    }

    
    return data;
}

const validationRulesMorning = {
    sleep_duration: [required, isNumeric, minNumber(0)],
};

const validationRulesEvening = {
    exercise_time: [required, isNumeric, minNumber(0)],
    study_time: [required, isNumeric, minNumber(0)]
};

const showBehaviorPage = async({render, session}) => {
    render('behavior.ejs', await getData({session}));
}


const postMorning = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const data = await getData({session});

    data.date = params.get('date');
    //för att fixa ett fel som ja int vet varifrån de kommer
    if (params.get('sleep_duration') === ''){
        data.sleep_duration = params.get('sleep_duration');
    } else {
        data.sleep_duration = Number(params.get('sleep_duration'));
    }
    //data.sleep_duration = params.get('sleep_duration');
    data.sleep_quality = params.get('sleep_quality');
    data.mood = params.get('mood');

    const[passes, errors] = await validate(data, validationRulesMorning);
    
    if (passes) {
        //laga en if sats var den kollar om usern och datumet , så tar den update table istället för insert
        const res = await Service.selectAll(data.id, data.date);
        if (res.rowCount > 0) {
            await Service.addMorning2(data.sleep_duration, data.sleep_quality, data.mood, data.date, data.id);
        } else {
            await Service.addMorning(data.sleep_duration, data.sleep_quality, data.mood, data.date, data.id);
        }
        //await session.set('morning', true);
        response.redirect('/behavior/reporting');
    }
    data.errors = errors;
    render('behavior.ejs', data);
}

const postEvening = async({request, response, session, render}) => {
    const body = request.body();
    const params = await body.value;
    const data = await getData({session});

    data.date = params.get('date');
   //för att fixa ett fel som ja int vet varifrån de kommer
    if (params.get('exercise_time') === ''){
        data.exercise_time = params.get('exercise_time');
    } else {
        data.exercise_time = Number(params.get('exercise_time'));
    }
    if (params.get('study_time') === ''){
        data.study_time = params.get('study_time');
    } else {
        data.study_time = Number(params.get('study_time'));
    }
    //data.exercise_time = params.get('exercise_time');
    //data.study_time = params.get('study_time');
    data.eating_regularity = params.get('eating_regularity')
    data.food_quality = params.get('food_quality')
    data.mood = params.get('mood');

    const[passes, errors] = await validate(data, validationRulesEvening);
    
    if (passes) {
         //laga en if sats var den kollar om usern och datumet , så tar den update table istället för insert
        const res = await Service.selectAll(data.id, data.date);
        if (res.rowCount > 0) {
            await Service.addEvening2(data.exercise_time, data.study_time, data.eating_regularity, data.food_quality, data.mood, data.date, data.id);
        } else {
            await Service.addEvening(data.exercise_time, data.study_time, data.eating_regularity, data.food_quality, data.mood, data.date, data.id);
        }
        //await session.set('evening', true);
        response.redirect('/behavior/reporting');
    }
    data.errors = errors;
    render('behavior.ejs', data);
}

export {showBehaviorPage, postMorning, postEvening, getData};