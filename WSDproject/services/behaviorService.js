import { executeQuery } from "../database/database.js";

const getCurrentDate = async() => {
        //return await executeQuery("SELECT DATE 'today';");
        return await executeQuery("SELECT to_char(current_date, 'IYYY-MM-DD');");
}

const getCurrentWeek = async() => {
    //return await executeQuery("SELECT extract('week' from current_date) as week;");
    return await executeQuery("select extract('isoyear' from current_date) as year, extract('week' from current_date) as week;");
}

const getCurrentMonth = async() => {
    return await executeQuery("select extract('isoyear' from current_date) as year, extract('month' from current_date) as month;");
    //return await executeQuery("SELECT to_char(current_date, 'IYYY-MM');");
}

const getWeekByDate = async(date) => {
    //return await executeQuery("SELECT extract('week' from TO_DATE($1,'YYYY-MM-DD')) as week;", date);
    return await executeQuery("select extract('isoyear' from TO_DATE($1,'YYYY-MM-DD')) as year, extract('week' from TO_DATE($1,'YYYY-MM-DD')) as week;", date);
}

const getMonthByDate = async(date) => {
    return await executeQuery("SELECT to_char(TO_DATE($1,'YYYY-MM-DD'), 'IYYY-MM');", date);
}


const addMorning = async(duration, quality, mood, date, id) => {
    const w = await getWeekByDate(date);
    const m = await getMonthByDate(date);
    const week = w.rowsOfObjects()[0];
    const month = m.rowsOfObjects()[0];
    const vecka = `${week.year}-W${week.week}`;
    await executeQuery("INSERT INTO reported_data (sleep_duration, sleep_quality, morning_mood, date, user_id, week, month) VALUES ($1, $2, $3, $4, $5, $6, $7);", duration, quality, mood, date, id, vecka, month.to_char);
}

const addMorning2 = async(duration, quality, mood, date, id) => {
    await executeQuery("UPDATE reported_data SET sleep_duration = $1, sleep_quality = $2, morning_mood = $3 WHERE date = $4 AND user_id = $5;", duration, quality, mood, date, id);
}

const addEvening = async(exercise_time, study_time, eating_regularity,food_quality, mood, date, id) =>{
    const w = await getWeekByDate(date);
    const m = await getMonthByDate(date);
    const week = w.rowsOfObjects()[0];
    const month = m.rowsOfObjects()[0];
    const vecka = `${week.year}-W${week.week}`;
    await executeQuery("INSERT INTO reported_data (sports_duration, study_duration, eat_reqularity, eat_quality, evening_mood, date, user_id, week, month) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);", exercise_time, study_time, eating_regularity,food_quality, mood, date, id, vecka, month.to_char);
}

const addEvening2 = async(exercise_time, study_time, eating_regularity,food_quality, mood, date, id) => {
    await executeQuery("UPDATE reported_data SET sports_duration = $1, study_duration = $2, eat_reqularity = $3, eat_quality = $4, evening_mood = $5 WHERE date = $6 AND user_id = $7;", exercise_time, study_time, eating_regularity, food_quality, mood, date, id);
}

const getWeeklyAvg = async(id, week) => {
    return await executeQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(10,2)) AS sd, CAST(AVG(sleep_quality) AS DECIMAL(10,2)) AS sq, CAST(AVG(sports_duration) AS DECIMAL(10,2)) AS ed, CAST(AVG(study_duration) AS DECIMAL(10,2)) AS st, CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS mood FROM reported_data WHERE user_id = $1 AND week = $2;", id, week);
}

const getMonthlyAvg = async(id, month) => {
    return await executeQuery("SELECT CAST(AVG(sleep_duration) AS DECIMAL(10,2)) AS sd, CAST(AVG(sleep_quality) AS DECIMAL(10,2)) AS sq, CAST(AVG(sports_duration) AS DECIMAL(10,2)) AS ed, CAST(AVG(study_duration) AS DECIMAL(10,2)) AS st, CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS mood FROM reported_data WHERE user_id = $1 AND month = $2;", id, month);
}


const selectAll = async(id, date) => {
    return await executeQuery("SELECT * FROM reported_data WHERE user_id = $1 AND date = $2;", id, date);
}

const checkReportedMorning = async(id) => {
    return await executeQuery("SELECT * FROM reported_data WHERE morning_mood > 0 AND date = current_date AND user_id = $1;", id);
}

const checkReportedEvening = async(id) => {
    return await executeQuery("SELECT * FROM reported_data WHERE evening_mood > 0 AND date = current_date AND user_id = $1;", id);
}

export { addMorning, getCurrentDate, addMorning2, addEvening2, selectAll, addEvening, getCurrentWeek, getCurrentMonth, getWeekByDate, getMonthByDate, getWeeklyAvg, getMonthlyAvg, checkReportedEvening, checkReportedMorning};