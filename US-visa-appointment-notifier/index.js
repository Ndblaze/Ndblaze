const puppeteer = require("puppeteer");
const { parseISO, compareAsc, isBefore, format } = require("date-fns");
require("dotenv").config();

const { delay, logStep } = require("./utils");
const {
  siteInfo,
  IS_PROD,
  NEXT_SCHEDULE_POLL,
  MAX_NUMBER_OF_POLL,
  NOTIFY_ON_DATE_BEFORE,
} = require("./config");

let isLoggedIn = false;
let maxTries = MAX_NUMBER_OF_POLL;

const login = async (page) => {
  logStep("logging in");
  await page.goto(siteInfo.LOGIN_URL);

  const form = await page.$("form#sign_in_form");

  const email = await form.$('input[name="user[email]"]');
  const password = await form.$('input[name="user[password]"]');
  const privacyTerms = await form.$('input[name="policy_confirmed"]');
  const signInButton = await form.$('input[name="commit"]');

  await email.type("ndblaze60@gmail.com");
  await password.type("Ezejames25@");
  await privacyTerms.click();
  await signInButton.click();

  await page.waitForNavigation();

  return true;
};


// let this function be the only printale we have .
const notifyMe = (earliestDate) => {
  const formattedDate = format(earliestDate, "dd-MM-yyyy");
  logStep(`sending an email to schedule for ${formattedDate}`);
  
};

const checkForSchedules = async (page) => {
  logStep("checking for schedules");
  await page.setExtraHTTPHeaders({
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
  });

  console.log(siteInfo.APPOINTMENTS_JSON_URL)
  await page.goto(siteInfo.APPOINTMENTS_JSON_URL);

  const originalPageContent = await page.content();
  const bodyText = await page.evaluate(() => {
    return document.querySelector("body").innerText;
  });

  try {
    //console.log(bodyText);
    const parsedBody = JSON.parse(bodyText);

    if (!Array.isArray(parsedBody)) {
      throw "Failed to parse dates, probably because you are not logged in";
    }

    let dates = []
    dates = parsedBody.map((item) => parseISO(item.date));
    const [earliest] = dates.sort(compareAsc);

    return earliest;
  } catch (err) {
    console.log("Unable to parse page JSON content", originalPageContent);
    console.error(err);
    isLoggedIn = false;
  }
};

const process = async (browser) => {
  logStep(`starting process with ${maxTries} tries left`);

  if (maxTries-- <= 0) {
    console.log("Reached Max tries");
    return;
  }

  const page = await browser.newPage();

  // if(!isLoggedIn) {
  isLoggedIn = await login(page);
  // }

  const earliestDate = await checkForSchedules(page);
  if (earliestDate && isBefore(earliestDate, parseISO("2024-02-29"))) {
    console.log(earliestDate)
    notifyMe(earliestDate);
    
  }else if(earliestDate && isBefore(earliestDate, parseISO("2024-06-01"))){
    console.log(`???????????`)
    console.log(`???????????`)  
    console.log(`???????????`) 
    console.log(`the earlierst is ${earliestDate}`)
    console.log("nothing early")
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
  }else{
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
    console.log(`the earlierst is ${earliestDate}`)
    console.log("nothing early")
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
    console.log(`>>>>>>>>>>>`)
  }

  await delay(NEXT_SCHEDULE_POLL);

  await process(browser);
};

(async () => {
  const browser = await puppeteer.launch(
    !IS_PROD ? { headless: false } : undefined
  );

  try {
    await process(browser);
  } catch (err) {
    console.error(err);
  }

  await browser.close();
})();
