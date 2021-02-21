const fs = require('fs');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const util = require('util');
const request = require('request');
require('dotenv').config();

const USERNAME = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

(async () => {
  // const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const chrome = await chromeLauncher.launch();
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port
  };

  // Connect to it using puppeteer.connect().
  const resp = await util.promisify(request)(`http://localhost:${options.port}/json/version`);
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({ browserWSEndpoint: webSocketDebuggerUrl });

  //auth setup
  const page = await browser.newPage();
  await page.goto('https://secure.tesco.com/account/en-GB/login?from=https%3A%2F%2Fwww.tesco.com%2Fgroceries%2Fen-GB%2F');

  const emailInput = await page.$('input[name="username"]');
  await emailInput.type(USERNAME);
  const passwordInput = await page.$('input[name="password"]');
  await passwordInput.type(PASSWORD);
  await Promise.all([
    page.$eval('#sign-in-form', form => form.submit()),
    page.waitForNavigation(),
  ]);

  await page.close();

  const runnerResult = await lighthouse('https://www.tesco.com/groceries/en-GB/', options);

  const data = {
    fetchTime: runnerResult.lhr.fetchTime,
    firstContentfulPaint:
      runnerResult.lhr.audits['first-contentful-paint'].numericValue
  };

  const historicalData = JSON.parse(fs.readFileSync('data.json'));

  historicalData.push(data);

  fs.writeFileSync('data.json', JSON.stringify(historicalData));

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalUrl);
  console.log(
    'Performance score was',
    runnerResult.lhr.categories.performance.score * 100
  );
  
  await browser.disconnect();
  await chrome.kill();
})();
