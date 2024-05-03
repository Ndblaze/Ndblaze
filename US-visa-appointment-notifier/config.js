module.exports = {
  loginCred: {
    EMAIL: process.env.EMAIL, 
    PASSWORD: process.env.PASSWORD,
  },

  siteInfo: {
    COUNTRY_CODE: "en-ca",
    SCHEDULE_ID: "51352475", 
    FACILITY_ID: "",
  
    get APPOINTMENTS_JSON_URL() {   
      return `https://ais.usvisa-info.com/${this.COUNTRY_CODE}/niv/schedule/${this.SCHEDULE_ID}/appointment/days/92.json?appointments[expedite]=false`;
    }, //https://ais.usvisa-info.com/en-ca/niv/schedule/51352475/appointment/days/92.json?appointments[expedite]=false
                                                                                     // calgary 89 ottawa 92 vancover 95 toronto 94
    get APPOINTMENTS_JSON_URLV() {
      return `https://ais.usvisa-info.com/${this.COUNTRY_CODE}/niv/schedule/${this.SCHEDULE_ID}/appointment/days/95.json?appointments[expedite]=false`;
    }, //https://ais.usvisa-info.com/en-ca/niv/schedule/51352475/appointment/days/92.json?appointments[expedite]=false
                                                                                     // calgary 89 ottawa 92 vancover 95 toronto 94
  
    get LOGIN_URL() {      
      return `https://ais.usvisa-info.com/${this.COUNTRY_CODE}/niv/users/sign_in`;
    },  
  },             
  IS_PROD: process.env.NODE_ENV === "prod", 
  NEXT_SCHEDULE_POLL: process.env.NEXT_SCHEDULE_POLL || 5_000, // default to 30 seconds
  MAX_NUMBER_OF_POLL: process.env.MAX_NUMBER_OF_POLL || 250, // number of polls before stopping
  NOTIFY_ON_DATE_BEFORE: process.env.NOTIFY_ON_DATE_BEFORE || "2024-06-01", // in ISO format i.e YYYY-MM-DD
};
 