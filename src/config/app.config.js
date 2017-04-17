"use strict";
var environment_1 = require("../app/environment");
exports.AppConfig = {
    baseUrl: environment_1.environment.envName == 'prod' ? 'http://healthamin.com/' : 'http://localhost:3000',
    stagingUrl: 'http://healthamin.com/',
    web: {
        appID: "1133564906671009"
    },
    messenger: {
        prod: {
            appID: "207389912960881",
            pageID: "1173783939313940",
        },
        dev: {
            appID: "190268531392461",
            pageID: "164483500652387",
        }
    },
    zoho: {
        ZOHO_CRM_AUTH_KEY: '02c37a08fc4700e9d848f4e2e0bc3436'
    },
    google: {
        SEARCH_API_KEY: 'AIzaSyAD6g1Bs2ZRmRFqHP0QIrMViadzHr6BrhM'
    },
    database: {
        doctors: 'DoctorsTable/',
        users: environment_1.environment.envName + '/UserTable/',
        scheduledJobs: environment_1.environment.envName + '/Scheduled_Jobs/',
        caredOnes: environment_1.environment.envName + '/CaredOnes/',
        medicineReminders: environment_1.environment.envName + '/Medicine_Reminders/',
        exerciseTracker: environment_1.environment.envName + '/Medicine_Reminders/',
        observers: environment_1.environment.envName + '/Observers/',
        caretakers: environment_1.environment.envName + '/CareTakers/',
        onboardingReview: environment_1.environment.envName + '/OnboardingReview/',
        virtualCaredOne: environment_1.environment.envName + '/VirtualCaredOne/',
        virtualObserver: environment_1.environment.envName + '/VirtualObserver/',
        virtualCareTaker: environment_1.environment.envName + '/VirtualCareTaker/',
        cared1Onboarded: environment_1.environment.envName + '/Cared1Onboarded/',
        userIds: environment_1.environment.envName + '/UserIds/'
    }
};
//# sourceMappingURL=app.config.js.map