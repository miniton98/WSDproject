import { executeQuery } from "../database/database.js";

const getWeekSummary = async() => {
    const res = await executeQuery("SELECT (CURRENT_DATE - 7) AS date;");
    const date = res.rowsOfObjects()[0];
    return await executeQuery("SELECT AVG(sleep_duration) AS Sleep_Duration, CAST(AVG(sleep_quality) AS DECIMAL(10,2)) AS Sleep_Quality, AVG(sports_duration) AS Exercise_duration, AVG(study_duration) AS Study_Time, CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS Mood FROM reported_data WHERE date > TO_DATE($1, 'YYYY-MM-DD') GROUP BY date;", date.date);
}

const getDaySummary = async(date) => {
    return await executeQuery("SELECT AVG(sleep_duration) AS Sleep_Duration, CAST(AVG(sleep_quality) AS DECIMAL(10,2)) AS Sleep_Quality, AVG(sports_duration) AS Exercise_duration, AVG(study_duration) AS Study_Time, CAST((AVG(morning_mood) + AVG(evening_mood))/2 AS DECIMAL(10,2)) AS Mood FROM reported_data WHERE date = TO_DATE($1, 'YYYY-MM-DD');", date);
}

export {getWeekSummary, getDaySummary};