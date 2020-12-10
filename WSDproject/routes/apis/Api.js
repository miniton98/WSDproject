import * as apiServis from "../../services/apiService.js";


const getWeekSummary = async() => {
    const res = await apiServis.getWeekSummary();
    const avg = res.rowsOfObjects();
    //console.log(avg);
    const json = JSON.stringify(avg);
    console.log(json);
    response.status = 200;
    //return json;
    response.body = json;
}

const getDaySummary = async({params, response}) => {
    let date = `${params.year}-${params.month}-${params.day}`;
    if (params.day.length === 1){
        date = `${params.year}-${params.month}-0${params.day}`;
    }
    const res = await apiServis.getDaySummary(date);
    const avg = res.rowsOfObjects()[0];
    const json = JSON.stringify(avg);
    //console.log(json);
    response.status = 200;
    //return json;
    response.body = json;

}
 
export {getWeekSummary, getDaySummary};