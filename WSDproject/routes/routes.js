import { Router } from "../deps.js";
import * as authController from "./controllers/authController.js";
import * as behaviorController from "./controllers/behaviorController.js";
import * as summaryController from "./controllers/summaryController.js";
import * as Api from "./apis/Api.js"

const router = new Router();
//authentication routes
router.get('/', authController.landingpage);
router.get('/auth/login', authController.showLoginForm);
router.get('/auth/register', authController.showRegistrationForm);
router.post('/auth/login', authController.postLoginForm);
router.post('/auth/register', authController.postRegistrationForm);
router.get('/auth/logout', authController.logout);
//reporting routes
router.get('/behavior/reporting', behaviorController.showBehaviorPage);
router.post('/behavior/reporting/morning', behaviorController.postMorning);
router.post('/behavior/reporting/evening', behaviorController.postEvening);
//summary routes
router.get('/behavior/summary', summaryController.showSummaryPage);
router.post('/behavior/summary', summaryController.postSummaryPage);
//api routes
router.get('/api/summary', Api.getWeekSummary);
router.get('/api/summary/:year/:month/:day', Api.getDaySummary);


export { router };