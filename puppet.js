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

  "*/3 * * * *":  () => {

    (async () => {
      try {

        // get unfinished last 30 news item
        const lastNewsItems = await strapi.query('parsednews').find({ isParsed: 0, _limit: 30 })

        // 1 - Create a new browser.
        const browser = await puppeteer.launch({
          headless: false,
          executablePath: process.env.CHROME_BIN || null,
          args: [
            "--no-sandbox",
            '--window-size=1024,728',
            "--disable-setuid-sandbox"],
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

        // disable js to get rid of ads
        await page.setJavaScriptEnabled(false);

        // open the first page
        await page.goto('https://sabah.az');

        // 4 - Get the content of the page.
        let content = await page.content();

        // 1 - Load the HTML
        const $ = cheerio.load(content);

        $('.pt-1 div a').each((i, el) => {

          const link = el.attribs.href
          const image_link = el.children[1].children[1].attribs.src
          const publish_time = el.children[1].children[3].children[3].children[0].data
          const publishDate = el.children[1].children[5].children[3].children[0].data
          const title = el.children[1].children[7].children[0].data
          const extraTitle = el.children[1].children[7].children[1].children.length > 0 ? el.children[1].children[7].children[1].children[0].data: ''

          // prepare sql like publish datetime
          const [day, month, year] = publishDate.split(' ')
          const monthIdx = monthsArray.filter(idx => idx.month === month)[0].order

          const publish_date = `${year}-${monthIdx.length>1?monthIdx:'0'+monthIdx}-${day.length>1?day:'0'+day}`

          const newsItem = {
            link,
            image_link,
            title,
            extraTitle,
            publish_time,
            publish_date
          }

          const alreadyAdded = lastNewsItems.filter(item => item.link === link)

          // insert news to strapi if not already added
          if (alreadyAdded.length == 0) {

            strapi.services.parsednews.create(newsItem);
          }
        })

        // await browser.close();
        await page.close();
        console.log("Page Closed 1");
      } catch (err) {

        // Catch and display errors
        console.log(err);
        await browser.close();
        console.log("Browser Closed");
      }
    })();
  },

  "*/30 * * * * *":  () => {

    (async () => {
      try {

        // get unfinished last 30 news item
        const lastNewsItems = await strapi.query('parsednews').find({ isParsed: 0, _limit: 1 })

        // 1 - Create a new browser.
        const browser = await puppeteer.launch({
          headless: false,
          executablePath: process.env.CHROME_BIN || null,
          args: [
            "--no-sandbox",
            '--window-size=1024,728',
            "--disable-setuid-sandbox",
            // '--headless', 
            // '--disable-gpu', 
            // '--disable-dev-shm-usage'
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

        // disable js to get rid of ads
        await page.setJavaScriptEnabled(false);

        lastNewsItems.forEach(async(newsItem) => {

          console.log('https://sabah.az'+newsItem.link)

          // open the news page
          await page.goto('https://sabah.az'+newsItem.link);

          // // Get the content of the page.
          // let content = await page.content();

          // await page.waitForSelector('#xeber_yazi')

          // // Load the HTML
          // const $ = cheerio.load(content);

          // console.log($('#xeber_yazi').html())

          // await page.goBack()
        })

        // // open the first page
        // await page.goto('https://sabah.az');

        // // 4 - Get the content of the page.
        // let content = await page.content();

        // // 1 - Load the HTML
        // const $ = cheerio.load(content);


        await browser.close();
        console.log("Browser Closed 2");
      } catch (err) {

        // Catch and display errors
        console.log(err);
        await browser.close();
        console.log("Browser Closed 2 error");
      }
    })();
  },
};
