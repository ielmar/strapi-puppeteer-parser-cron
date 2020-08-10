'use strict';

// Require the puppeteer module.
const puppeteer = require("puppeteer");
const iPhone = puppeteer.devices[ 'iPhone 8' ];
const cheerio = require("cheerio");

const monthsArray = [
  {order: 1, month: 'Yanvar'},
  {order: 2, month: 'Fevral'},
  {order: 3, month: 'Mart'},
  {order: 4, month: 'Aprel'},
  {order: 5, month: 'May'},
  {order: 6, month: 'İyun'},
  {order: 7, month: 'İyul'},
  {order: 8, month: 'Avqust'},
  {order: 9, month: 'Sentyabr'},
  {order: 10, month: 'Oktyabr'},
  {order: 11, month: 'Noyabr'},
  {order: 12, month: 'Dekabr'}
]

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

module.exports = {

  "30 * * * * *":  () => {

    (async () => {
      try {

        // 1 - Create a new browser.
        const browser = await puppeteer.launch({
          headless: false,
          slowMo: 100,
          args: [
              "--no-sandbox",
              '--window-size=1024,728',
              "--disable-setuid-sandbox"
          ],
        });

        // 2 - Open a new page on that browser.
        const page = await browser.newPage();

        // set viewport
        await page.setViewport({
            width: 300,
            height: 768,
            // width: 1024,
            // height: 768,
            deviceScaleFactor: 1,
            isMobile: true
        });

        // emulate iPhone 8
        await page.emulate(iPhone);

        await page.setDefaultNavigationTimeout( 90000 );

        await page.setJavaScriptEnabled(false);

        // open the first page
        await page.goto('https://sabah.az', {waitUntil: 'networkidle2'});

        // get all the links
        const news_links = await page.evaluate((selector) => {
          const anchors_node_list = document.querySelectorAll(selector);
          const anchors = [...anchors_node_list];
          return anchors.map(link => link.href);
        }, 'div.pt-1 > div > a')

        // open every link and get data
        for (let i = 0; i < news_links.length; i++) {

          let link = news_links[i];

          await page.goto(link, {waitUntil: 'networkidle2'});

          // wait for the content
          await page.waitForSelector('.text_m');

          // get the title text
          let title = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.innerText;
          }, 'div.text_title_m > p')

          // extract extra_title from title
          let extra_title = title.split(' - ')[1]

          // if extra title exists, set title again
          if(extra_title !== undefined) title = title.split(' - ')[0]
          else extra_title = ''

          // get the img src
          let image_link = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.src;
          }, 'div.detal_img_m > img')

          // get the time
          let publish_time = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.innerText;
          }, 'body > div.background_color > div.detal_m > div.cl-wrap > div.dc-wrap > div:nth-child(1) > div:nth-child(1)')

          // get the time
          let publish_date = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.innerText;
          }, 'body > div.background_color > div.detal_m > div.cl-wrap > div.dc-wrap > div:nth-child(2) > div:nth-child(1)')

          // get the category
          let category = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.innerText;
          }, 'body > div.background_color > div.detal_m > div.cl-wrap > div.dc-wrap > div:nth-child(1) > div:nth-child(2)')

          // get the content
          let content = await page.evaluate((selector) => {
            let dom = document.querySelector(selector);
            return dom.innerText;
          }, '.text_m')

          const newsObj = {
            link,
            image_link,
            title,
            extra_title,
            publish_time,
            publish_date,
            category,
            content
          }

          await page.waitFor(1000)
        }

        await browser.close();
        console.log(success("Browser Closed"));
      } catch (err) {

        // Catch and display errors
        console.log(err);
        await browser.close();
        console.log("Browser Closed");
      }
    })();
  },
};
