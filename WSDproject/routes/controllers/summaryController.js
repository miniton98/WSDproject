import * as Service from "../../services/behaviorService.js";

const getInfo = async({session}) => {
    const info = {
        auth : true,
        email : '',
        id: '',
        week: '',
        month: '',
        avgWeeklyMood: '',
        avgMonthlyMood: '',
        avgWeeklySleepQuality: '',
        avgMonthlySleepQuality: '',
        avgWeeklySleepDur: '',
        avgMonthlySleepDur: '',
        avgWeeklyExerciseDur: '',
        avgMonthlyExerciseDur: '',
        avgWeeklyStudyTime: '',
        avgMonthlyStudyTime: ''
    };
    
    info.email = (await session.get('user')).email;
    info.id = (await session.get('user')).id;

    const w = await Service.getCurrentWeek();
    const m = await Service.getCurrentMonth();
    const week = w.rowsOfObjects()[0];
    const month = m.rowsOfObjects()[0];
    const lastweek = week.week - 1;
    const lastmonth = month.month - 1;
    info.week = `${week.year}-W${lastweek}`;
    info.month = `${month.year}-${lastmonth}`;
    
    const Wparams = await Service.getWeeklyAvg( info.id, info.week);
    const Mparams = await Service.getMonthlyAvg( info.id, info.month);
    const Wavg = Wparams.rowsOfObjects()[0];
    const Mavg = Mparams.rowsOfObjects()[0];

    if (Wparams.rowCount > 0) {
        info.avgWeeklyMood = Wavg.mood;
        info.avgWeeklyExerciseDur = Wavg.ed;
        info.avgWeeklySleepDur = Wavg.sd;
        info.avgWeeklySleepQuality = Wavg.sq;
        info.avgWeeklyStudyTime = Wavg.st;
    }
    if (Mparams.rowCount > 0) {
        info.avgMonthlyMood = Mavg.mood;
        info.avgMonthlyExerciseDur = Mavg.ed;
        info.avgMonthlySleepDur = Mavg.sd;
        info.avgMonthlySleepQuality = Mavg.sq;
        info.avgMonthlyStudyTime = Mavg.st;
    }

    return info;
}

const showSummaryPage = async({render, session}) => {
    
    render('summary.ejs', await getInfo({session}));
}

const postSummaryPage = async({request, session, render}) => {
    const info = await getInfo({session});

    const body = request.body();
    const params = await body.value;
    const week = params.get('week');
    const month = params.get('month');

    info.week = week;
    info.month = month;

    const Wparams = await Service.getWeeklyAvg( info.id, week);
    const Mparams = await Service.getMonthlyAvg( info.id, month);
    const Wavg = Wparams.rowsOfObjects()[0];
    const Mavg = Mparams.rowsOfObjects()[0];

    if (Wparams.rowCount > 0) {
        info.avgWeeklyMood = Wavg.mood;
        info.avgWeeklyExerciseDur = Wavg.ed;
        info.avgWeeklySleepDur = Wavg.sd;
        info.avgWeeklySleepQuality = Wavg.sq;
        info.avgWeeklyStudyTime = Wavg.st;
    }
    if (Mparams.rowCount > 0) {
        info.avgMonthlyMood = Mavg.mood;
        info.avgMonthlyExerciseDur = Mavg.ed;
        info.avgMonthlySleepDur = Mavg.sd;
        info.avgMonthlySleepQuality = Mavg.sq;
        info.avgMonthlyStudyTime = Mavg.st;
    }

    render('summary.ejs', info);
    
}

export{ showSummaryPage, postSummaryPage, getInfo };