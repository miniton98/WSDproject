IN CASE IT IS NOT POSSIBLE TO READ THE README.md FILE!!!

README file for the project in Web Software Development course at Aalto university.

DATABASE SET UP:
The Program uses a postgre database, such as elephantSQL. It uses the following database tables 'reported_data' and 'project_users'. The database tables and their CREATE TABLE queries are presented below.

CREATE TABLE reported_data (
    id SERIAL PRIMARY KEY,
    sleep_duration FLOAT(1),
    sleep_quality INT,
    sports_duration FLOAT(1),
    study_duration FLOAT(1),
    eat_reqularity INT,
    eat_quality INT,
    morning_mood INT,
    evening_mood InT,
    user_id INT,
    date DATE,
    week VARCHAR(10),
    month VARCHAR(10)
);

CREATE TABLE project_users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(320) NOT NULL,
    password VARCHAR(60) NOT NULL 
); 

DATE Format: YYYY-MM-DD
week Format: YYYY-'W'WW     ex. 2020-W49
month Format: YYYY-MM


RUNNING THE PROGRAM:

if the file is zipped, you need to extract everything to an unzipped folder.
The project should have the following structure:
WSDproject:
    config
        config.js
    database
        database.js
    middlewares
        middlewares.js
    routes
        apis
            Api.js
        controllers
            authController.js
            behaviorController.js
            summaryController.js
        routes.js
    services
        apiService.js
        authService.js
        behaviorService.js
    statics
    tests
        test.js
    utils
    views
        partials
            error.ejs
            footer.ejs
            header.ejs
        behavior.ejs
        index.ejs
        login.ejs
        register.ejs
        summary.ejs
    .env
    app.js
    deps.js
    README.md

Your database credentials should be added to the .env file in the root path, as the project uses it for environmental variables. If there is no .env file create one in the root path and add the database configurations in the following format:
PGHOST = "databser host server address"
PGDATABASE = "database and user identifier"
PGPASSWORD = "database password"

After these steps is it possible to run the program locally from its root folder 'WSDproject', by running the app.js file using the following command:
deno run --allow-net --allow-read --allow-env --unstable app.js

When it is running go to the browser and typ in http://localhost:7777 This should bring you to the starting page of the application, and you can start using it. 

PROGRAM FUNCTIONALITY:
On the landingpage there is a short description of the program. To get started one has to first register a user and then login. Once logged in, is there the logged in users email visible and at the top right corner is a logout button. Furthermore, it is possible to access the reporting page of the application once logged in. On the reporting page is there 2 forms visible, the one indicated with the title 'Morning' is used for reporting morning behavior and the other one titled 'Evening' is for reporting evening behavior. It is also possible to access the summary page while logged in. The summary page contains a summury of your data for the last week and month. It is possible to change the week and month using the date fields at the top of the page. 
Additionally, does the application come with two apis, on can be accessed at http://localhost:7777/api/summary wich return a json object containing a summary of de data from all users for the last 7 days. And the other at http://localhost:7777/api/summary/"year"/"month"/"day", it gives a summary of the data from all users for the specific day.

In the database file, is there commented out the structure for a database pool. This is however not used as trying to utilize the connection pool gives the following error: Error: Unknown response for startup: E


RUNNING THE TESTS:

The tests can be found in the folder tests. 
The tests can be run from the tests path using: 
deno test --allow-env --allow-net --allow-read --unstable test.js

when running the tests must one insert the database credentials manually, as it has some problems accessing the environmentalvariables from the .env file in test mode. Thus, is there a database field commented out in the config.js file, this database configuration is used for testing. Please add you own test database there while running tests and comment out the one using environmental variables. Additionally, for some tests to pass must one comment out redirects in the code, as deno tests do not support redirects. These locations are commented in the code, but they can be found in the following functions:
middlewares.js -> authentication()
authController.js -> postLoginForm()
authController.js -> postRegistrationForm()

The test include a addUser test, for this to work must not the user we are trying to add excist in the data base. To get around this must one either clear the database table using: DELETE FROM project_users; or alternatively modify the user that we are adding. 

The project is not uploaded to heroku, so there is no link from where it can be accessed.