import { environment } from '../../app/environment';
export const AppConfig = {

  baseUrl: environment.envName == 'prod' ? 'http://healthamin.com/' : 'http://localhost:3000',
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
    doctors:            'DoctorsTable/',
    users:              environment.envName + '/UserTable/',
    scheduledJobs:      environment.envName + '/Scheduled_Jobs/',
    caredOnes:          environment.envName + '/CaredOnes/',
    medicineReminders:  environment.envName + '/Medicine_Reminders/',
    exerciseTracker:    environment.envName + '/Exercise_Tracker/',
    observers:          environment.envName + '/Observers/',
    caretakers:         environment.envName + '/CareTakers/',
    onboardingReview:   environment.envName + '/OnboardingReview/',
    transactionTable:   environment.envName + '/TransactionTable/',
    virtualCaredOne:    environment.envName + '/VirtualCaredOne/',
    virtualObserver:    environment.envName + '/VirtualObserver/',
    virtualCareTaker:   environment.envName + '/VirtualCareTaker/',
    cared1Onboarded:    environment.envName + '/Cared1Onboarded/',
    userIds:            environment.envName + '/UserIds/',
    insights:           environment.envName + '/Insights/',
    deviceReadings:     environment.envName + '/Device_Readings/',
    consultations:      environment.envName + '/Consultations/',
    labTests:           environment.envName + '/LabTests/',
    healthReports:      environment.envName + '/HealthReports/',
    sendMessages:       environment.envName + '/SendMessages/',
    appointments:       environment.envName + '/Appointments/',
    testPricing:        environment.envName + '/PathologicalTests/TestPricing/',
    labDetails:         environment.envName + '/PathologicalTests/LabDetails/',
    orderDetails:       environment.envName +  '/Orders/',
    docUsers:           environment.envName + '/DoctorUsers/',
    doctorPages:        environment.envName + '/DoctorPages/',
    pathologicalTestDetails:  environment.envName + '/PathologicalTests',
    website:            environment.envName + '/DoctorPages/localhost/',
    carePaths:          environment.envName + '/CarePathways/',
    HxPaths:            environment.envName + '/PatientHxForms/',
    carePathNames:      environment.envName + '/CarePathNames/',
    HxPathNames:        environment.envName + '/PatientHxFormNames/',
    checkIns:           environment.envName + '/DoctorPages/Check-Ins/',
    queue:              environment.envName + '/DoctorPages/Queue/',
    clinicid:           environment.envName + '/UserTable/clinicId/',
    patientdetails:     environment.envName + '/PatientsInsights/',
    diagnosis:          environment.envName + '/Diagnosis/',
    careSched:          environment.envName + '/CareSchedule/',
    pageAccessTokens:   environment.envName + '/PageAccessTokens/',
    patientHistory:     environment.envName + '/PatientHistory/',
    UserTable:          environment.envName + '/UserTable/',
    FbCampaign:         environment.envName + '/FbCampaign/',
    HealthImage:        environment.envName + '/HealthImage/',
    HumanAPIToken:      environment.envName + '/HumanAPIReturn/',
    HumanAPIData:       environment.envName + '/PatientFitnessData/',
    ActivitySummary:    environment.envName + '/ActivitySummary/',
    Partners:           environment.envName + '/Partners/',
    messagingIds:       environment.envName + '/MessagingIds/',
    careSchedule:       environment.envName + '/CareSchedule/'
  }
}
