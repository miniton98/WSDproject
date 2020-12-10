import { executeQuery } from "../database/database.js";


const getUser = async(email) => {
    return await executeQuery("SELECT * FROM project_users WHERE email = $1;", email);
}

const addUser = async(email, hash) => {
    await executeQuery("INSERT INTO project_users (email, password) VALUES ($1, $2);", email, hash);
}

const getAvgMoodToday = async(id) => {
    return await executeQuery("SELECT CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS avg FROM reported_data WHERE user_id = $1 AND date = TIMESTAMP 'today';", id);
}

const getAvgMoodYesterday = async(id) => {
    return await executeQuery("SELECT CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS avg FROM reported_data WHERE user_id = $1 AND date = TIMESTAMP 'yesterday';", id);
}

const getCurrentTime = async() => {
    //at GMT + 0
    const time = await executeQuery("SELECT current_time(0);");
    return time.rowsOfObjects()[0];
}

export {getUser, addUser, getAvgMoodToday, getAvgMoodYesterday, getCurrentTime};