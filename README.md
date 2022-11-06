Strapi - Puppeteer Website Parser
============

## About The Project

This is a web scraper which uses Strapi as a headless backend with Sqlite as a database and Puppeteer for scraping data. It is used for scraping latest added news to the news site https://sabah.az. Cron is used to run Puppeteer in interval and parse the website for any newly added post. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage
After you clone this repo to your desktop, go to its root directory and run `yarn install` to install its dependencies.

Once the dependencies are installed, you can run `yarn start` to start the application. You will then be able to access it at localhost:3001. You will need to set up administrator login after first install. 

Add a folder `.tmp` and create a file named `data.db` under it.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* NodeJS
* ExpressJS
* MySQL
* Node-Cron

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Elmar Ismayilov - [Twitter](https://twitter.com/i_elmar) - [LinkedIn](https://www.linkedin.com/in/elmar-ismayilov-5b125318/)

Project Link: [https://github.com/ielmar/strapi-puppeteer-parser-cron](https://github.com/ielmar/strapi-puppeteer-parser-cron)

<p align="right">(<a href="#readme-top">back to top</a>)</p>