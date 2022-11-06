Strapi - Puppeteer Website Parser
============
This is a web scraper which uses Strapi as a headless backend with Sqlite as a database and Puppeteer for scraping data. It is used for scraping latest added news to the news site https://sabah.az. Cron is used to run Puppeteer in interval and parse the website for any newly added post.  

---
## Setup
Clone this repo to your desktop and run `yarn install` to install all the dependencies.

---

## Usage
After you clone this repo to your desktop, go to its root directory and run `yarn install` to install its dependencies.

Once the dependencies are installed, you can run `yarn start` to start the application. You will then be able to access it at localhost:3001. You will need to set up administrator login after first install. 

Add a folder `.tmp` and create a file named `data.db` under it.
