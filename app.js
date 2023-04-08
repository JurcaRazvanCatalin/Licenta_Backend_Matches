const express = require("express");
const cron = require("node-cron");
const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
require("dotenv").config();
const app = express();
const Matches = require("./Collections/Model");
const matches = require("./Collections/matches");
const collectionService = require("./Collections/Service");
mongoose.set("strictQuery", true);
const PORT = process.env.PORT;

const createMatches = async (match) => {
  if (
    (await Matches.findOne({
      awayTeam: match.awayTeam,
      homeTeam: match.homeTeam,
      date: match.date,
    })) == null
  ) {
    collectionService.createRecord(match);
  } else {
    await Matches.findOneAndUpdate(
      {
        awayTeam: match.awayTeam,
        homeTeam: match.homeTeam,
        date: match.date,
      },
      match,
      {
        new: true,
        runValidators: true,
      }
    );
  }
};

let browser;
const data = [];
const scrapeMatches = async () => {
  try {
    const pages = await browser.newPage();
    for (i = 1396; i <= 1406; i = i + 10) {
      if (i === 1396) {
        for (j = 1883; j <= 1884; j++) {
          if (j === 1883) {
            for (z = 6884; z <= 6901; z++) {
              await pages.goto(
                `https://baschet.ro/liga-nationala-de-baschet-masculin/rezultate?faza=${i}&grupa=${j}&etapa=${z}`
              );
              const html = await pages.evaluate(() => document.body.innerHTML);
              const $ = await cheerio.load(html);
              $(
                "#app > div.container > div > div.col-lg-9 > div > div > table > tbody > tr"
              ).each((i, element) => {
                const parameter = $(element)
                  .find("td:nth-child(1)")
                  .find("div")
                  .find("div:nth-child(1)")
                  .find("span")
                  .text();
                if (parameter === "-") {
                  const link = `${$(element).attr("data-link")}`;
                  data.push({ link });
                } else {
                  const link = `${$(element).attr("data-link")}/statistici`;
                  data.push({ link });
                }
              });
            }
          } else if (j === 1884) {
            for (z = 6902; z <= 6919; z++) {
              await pages.goto(
                `https://baschet.ro/liga-nationala-de-baschet-masculin/rezultate?faza=${i}&grupa=${j}&etapa=${z}`
              );
              const html = await pages.evaluate(() => document.body.innerHTML);
              const $ = await cheerio.load(html);
              $(
                "#app > div.container > div > div.col-lg-9 > div > div > table > tbody > tr"
              ).each((i, element) => {
                const parameter = $(element)
                  .find("td:nth-child(1)")
                  .find("div")
                  .find("div:nth-child(1)")
                  .find("span")
                  .text();
                if (parameter === "-") {
                  const link = `${$(element).attr("data-link")}`;
                  data.push({ link });
                } else {
                  const link = `${$(element).attr("data-link")}/statistici`;
                  data.push({ link });
                }
              });
            }
          }
        }
      } else if (i === 1406) {
        for (j = 1893; j <= 1894; j++) {
          if (j === 1893) {
            for (z = 6954; z <= 6963; z++) {
              await pages.goto(
                `https://baschet.ro/liga-nationala-de-baschet-masculin/rezultate?faza=${i}&grupa=${j}&etapa=${z}`
              );
              const html = await pages.evaluate(() => document.body.innerHTML);
              const $ = await cheerio.load(html);
              $(
                "#app > div.container > div > div.col-lg-9 > div > div > table > tbody > tr"
              ).each((i, element) => {
                const parameter = $(element)
                  .find("td:nth-child(1)")
                  .find("div")
                  .find("div:nth-child(1)")
                  .find("span")
                  .text();
                if (parameter === "-") {
                  const link = `${$(element).attr("data-link")}`;
                  data.push({ link });
                } else {
                  const link = `${$(element).attr("data-link")}/statistici`;
                  data.push({ link });
                }
              });
            }
          } else if (j === 1894) {
            for (z = 6964; z <= 6971; z++) {
              await pages.goto(
                `https://baschet.ro/liga-nationala-de-baschet-masculin/rezultate?faza=${i}&grupa=${j}&etapa=${z}`
              );
              const html = await pages.evaluate(() => document.body.innerHTML);
              const $ = await cheerio.load(html);
              $(
                "#app > div.container > div > div.col-lg-9 > div > div > table > tbody > tr"
              ).each((i, element) => {
                const parameter = $(element)
                  .find("td:nth-child(1)")
                  .find("div")
                  .find("div:nth-child(1)")
                  .find("span")
                  .text();
                if (parameter === "-") {
                  const link = `${$(element).attr("data-link")}`;
                  data.push({ link });
                } else {
                  const link = `${$(element).attr("data-link")}/statistici`;
                  data.push({ link });
                }
              });
            }
          }
        }
      }
    }
    // for (i = 1410; i <= 1411; i++) {
    //   if (i === 1410) {
    //     let j = 1908;
    //     for (z = 7010; z <= 7012; z++) {
    //       await pages.goto(
    //         `https://baschet.ro/liga-nationala-de-baschet-masculin/rezultate?faza=${i}&grupa=${j}&etapa=${z}`
    //       );
    //       const html = await pages.evaluate(() => document.body.innerHTML);
    //       const $ = await cheerio.load(html);
    //       $(
    //         "#app > div.container > div > div.col-lg-9 > div > div > table > tbody > tr"
    //       ).each((i, element) => {
    //         const parameter = $(element)
    //           .find("td:nth-child(1)")
    //           .find("div")
    //           .find("div:nth-child(1)")
    //           .find("span")
    //           .text();
    //         if (parameter === "-") {
    //           const link = `${$(element).attr("data-link")}`;
    //           data.push({ link });
    //         } else {
    //           const link = `${$(element).attr("data-link")}/statistici`;
    //           data.push({ link });
    //         }
    //       });
    //     }
    //   }
    // }
    // console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

const scrapeMatchDescription = async (url, page) => {
  try {
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(html);
    const homeTeam = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div:nth-child(1) > h2 > a"
    ).text();
    const awayTeam = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div:nth-child(3) > h2 > a"
    ).text();

    let homeTeamColor;
    let awayTeamColor;
    if (homeTeam === "CSM CSU Oradea") {
      homeTeamColor = "#a51117";
    } else if (awayTeam === "CSM CSU Oradea") {
      awayTeamColor = "#a51117";
    }
    if (homeTeam === "U BT Cluj-Napoca") {
      homeTeamColor = "#f1f2f9";
    } else if (awayTeam === "U BT Cluj-Napoca") {
      awayTeamColor = "#f1f2f9";
    }
    if (homeTeam === "Rapid București") {
      homeTeamColor = "#ab363d";
    } else if (awayTeam === "Rapid București") {
      awayTeamColor = "#ab363d";
    }
    if (homeTeam === "FC Argeș Pitești") {
      homeTeamColor = "#2e2460";
    } else if (awayTeam === "FC Argeș Pitești") {
      awayTeamColor = "#2e2460";
    }
    if (homeTeam === "BC CSU Sibiu") {
      homeTeamColor = "#ffdd00";
    } else if (awayTeam === "BC CSU Sibiu") {
      awayTeamColor = "#ffdd00";
    }
    if (homeTeam === `SCM "U" Craiova`) {
      homeTeamColor = "#21539d";
    } else if (awayTeam === `SCM "U" Craiova`) {
      awayTeamColor = "#21539d";
    }
    if (homeTeam === `CSM Ploiești`) {
      homeTeamColor = "#0a62bc";
    } else if (awayTeam === `CSM Ploiești`) {
      awayTeamColor = "#0a62bc";
    }
    if (homeTeam === `CSM Târgu Mureș`) {
      homeTeamColor = "#3d457c";
    } else if (awayTeam === `CSM Târgu Mureș`) {
      awayTeamColor = "#3d457c";
    }
    if (homeTeam === `CSM VSKC Miercurea Ciuc`) {
      homeTeamColor = "#e63834";
    } else if (awayTeam === `CSM VSKC Miercurea Ciuc`) {
      awayTeamColor = "#e63834";
    }
    if (homeTeam === `CSM Târgu Jiu`) {
      homeTeamColor = "#4e6183";
    } else if (awayTeam === `CSM Târgu Jiu`) {
      awayTeamColor = "#4e6183";
    }
    if (homeTeam === `SCM Timișoara`) {
      homeTeamColor = "#44286b";
    } else if (awayTeam === `SCM Timișoara`) {
      awayTeamColor = "#44286b";
    }
    if (homeTeam === `CS Dinamo Bucureşti`) {
      homeTeamColor = "#e01d23";
    } else if (awayTeam === `CS Dinamo Bucureşti`) {
      awayTeamColor = "#e01d23";
    }
    if (homeTeam === `CSO Voluntari`) {
      homeTeamColor = "#7dcaea";
    } else if (awayTeam === `CSO Voluntari`) {
      awayTeamColor = "#7dcaea";
    }
    if (homeTeam === `CSM ABC Athletic Constanța`) {
      homeTeamColor = "#3b50ae";
    } else if (awayTeam === `CSM ABC Athletic Constanța`) {
      awayTeamColor = "#3b50ae";
    }
    if (homeTeam === `CSM Galaţi`) {
      homeTeamColor = "#3364ba";
    } else if (awayTeam === `CSM Galaţi`) {
      awayTeamColor = "#3364ba";
    }
    if (homeTeam === `CSA Steaua București`) {
      homeTeamColor = "#2d53a5";
    } else if (awayTeam === `CSA Steaua București`) {
      awayTeamColor = "#2d53a5";
    }
    if (homeTeam === `CSM Focșani`) {
      homeTeamColor = "#76c4f0";
    } else if (awayTeam === `CSM Focșani`) {
      awayTeamColor = "#76c4f0";
    }
    if (homeTeam === `ACS Laguna Sharks București`) {
      homeTeamColor = "#333536";
    } else if (awayTeam === `ACS Laguna Sharks București`) {
      awayTeamColor = "#333536";
    }

    let homeTeamScore = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div:nth-child(1) > span"
    ).text();
    let awayTeamScore = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div:nth-child(3) > span"
    ).text();
    const referee = $(
      "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(7)"
    )
      .text()
      .replace("Arbitru", "")
      .replace(":", "")
      .trim();
    const arena = $(
      "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(10)"
    ).text();
    const date = $(
      "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(4)"
    )
      .text()
      .replace(".", "-")
      .replace(".", "-");
    const matchDate = new Date(`${date.split("-").reverse().join("-")}`);
    // console.log(matchDate)
    const matchTime = $(
      "#app > div:nth-child(2) > div > div > div.info-slider > ul > li:nth-child(5)"
    ).text();
    const homeTeamLogo = $(
      "#app > div:nth-child(4) > div > div > div > div > div.d-flex.align-items-center.mb-4 > img"
    ).attr("src");
    const awayTeamLogo = $(
      "#app > div:nth-child(6) > div > div > div > div > div.d-flex.align-items-center.mb-4 > img"
    ).attr("src");

    const first_pts = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(1) > td:nth-child(2)"
    ).text();
    const second_pts = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(1) > td:nth-child(3)"
    ).text();
    const third_pts = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(1) > td:nth-child(4)"
    ).text();
    const fourth_pts = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(1) > td:nth-child(5)"
    ).text();
    const first_pts_a = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(2) > td:nth-child(2)"
    ).text();
    const second_pts_a = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(2) > td:nth-child(3)"
    ).text();
    const third_pts_a = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(2) > td:nth-child(4)"
    ).text();
    const fourth_pts_a = $(
      "#app > div:nth-child(2) > div > div > div.match-details > div.score > table > tbody > tr:nth-child(2) > td:nth-child(5)"
    ).text();

    const homeTeamStats = $(
      "#app > div:nth-child(4) > div > div > div > div > div.statistic-table-container > table > tbody > tr"
    )
      .map((i, element) => {
        const playerName = $(element)
          .find("th:nth-child(2)")
          .find("a")
          .text()
          .replace("\n", "")
          .trim();
        const playerNumber = $(element)
          .find("th:nth-child(1)")
          .text()
          .replace("\n", "")
          .trim();
        const minutesPlayed = $(element)
          .find("td:nth-child(3)")
          .text()
          .replace("\n", "")
          .trim();
        const two_fgm = $(element).find("td:nth-child(4)").text();
        const two_fga = $(element).find("td:nth-child(5)").text();
        const two_fgp = $(element)
          .find("td:nth-child(6)")
          .text()
          .replace("%", "");
        const three_fgm = $(element).find("td:nth-child(7)").text();
        const three_fga = $(element).find("td:nth-child(8)").text();
        const three_fgp = $(element)
          .find("td:nth-child(9)")
          .text()
          .replace("%", "");
        const ftm = $(element).find("td:nth-child(10)").text();
        const fta = $(element).find("td:nth-child(11)").text();
        const ftp = $(element).find("td:nth-child(12)").text().replace("%", "");
        const reb = $(element).find("td:nth-child(15)").text();
        const ass = $(element).find("td:nth-child(16)").text();
        const fouls = $(element).find("td:nth-child(17)").text();
        const tov = $(element).find("td:nth-child(20)").text();
        const blocks = $(element).find("td:nth-child(21)").text();
        const pts = $(element).find("td:nth-child(22)").text();
        return {
          playerName,
          playerNumber,
          minutesPlayed,
          two_fgm,
          two_fga,
          two_fgp,
          three_fgm,
          three_fga,
          three_fgp,
          ftm,
          fta,
          ftp,
          reb,
          ass,
          fouls,
          tov,
          blocks,
          pts,
        };
      })
      .get();

    const awayTeamStats = $(
      "#app > div:nth-child(6) > div > div > div > div > div.statistic-table-container > table > tbody > tr"
    )
      .map((i, element) => {
        const playerName = $(element)
          .find("th:nth-child(2)")
          .find("a")
          .text()
          .replace("\n", "")
          .trim();
        const playerNumber = $(element)
          .find("th:nth-child(1)")
          .text()
          .replace("\n", "")
          .trim();
        const minutesPlayed = $(element)
          .find("td:nth-child(3)")
          .text()
          .replace("\n", "")
          .trim();
        const two_fgm = $(element).find("td:nth-child(4)").text();
        const two_fga = $(element).find("td:nth-child(5)").text();
        const two_fgp = $(element)
          .find("td:nth-child(6)")
          .text()
          .replace("%", "");
        const three_fgm = $(element).find("td:nth-child(7)").text();
        const three_fga = $(element).find("td:nth-child(8)").text();
        const three_fgp = $(element)
          .find("td:nth-child(9)")
          .text()
          .replace("%", "");
        const ftm = $(element).find("td:nth-child(10)").text();
        const fta = $(element).find("td:nth-child(11)").text();
        const ftp = $(element).find("td:nth-child(12)").text().replace("%", "");
        const reb = $(element).find("td:nth-child(15)").text();
        const ass = $(element).find("td:nth-child(16)").text();
        const fouls = $(element).find("td:nth-child(17)").text();
        const tov = $(element).find("td:nth-child(20)").text();
        const blocks = $(element).find("td:nth-child(21)").text();
        const pts = $(element).find("td:nth-child(22)").text();
        return {
          playerName,
          playerNumber,
          minutesPlayed,
          two_fgm,
          two_fga,
          two_fgp,
          three_fgm,
          three_fga,
          three_fgp,
          ftm,
          fta,
          ftp,
          reb,
          ass,
          fouls,
          tov,
          blocks,
          pts,
        };
      })
      .get();
    const homeTeamPts = {
      first_pts,
      second_pts,
      third_pts,
      fourth_pts,
    };
    const awayTeamPts = {
      first_pts_a,
      second_pts_a,
      third_pts_a,
      fourth_pts_a,
    };
    const match = {
      awayTeam,
      homeTeam,
      awayTeamScore,
      homeTeamScore,
      homeTeamColor,
      awayTeamColor,
      referee,
      arena,
      matchDate,
      matchTime,
      awayTeamLogo,
      homeTeamLogo,
      homeTeamPts: homeTeamPts,
      awayTeamPts: awayTeamPts,
      awayTeamStats: awayTeamStats,
      homeTeamStats: homeTeamStats,
    };
    createMatches(match);
  } catch (err) {
    console.error(err);
  }
};

app.get("/", (req, res) => {
  res.send("Meciuri");
});

const initRoutes = () => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
  app.use(express.json());
  app.use("/api/v1/matches", matches);
};

const startServer = () => {
  app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`));
};

const database = () => {
  if (mongoose.connect(process.env.MONGO_URI))
    console.log("Connected to Database");
};

const main = async () => {
  browser = await puppeteer.launch({ headless: false });
  const descriptionPage = await browser.newPage();
  const matches = await scrapeMatches();
  console.log(matches.length);
  for (i = 0; i <= matches.length - 1; i++) {
    await scrapeMatchDescription(matches[i].link, descriptionPage);
  }
};

const startApp = () => {
  startServer();
  database();
  initRoutes();
};
main();
startApp();
cron.schedule("0 0 * * *", main, {});
