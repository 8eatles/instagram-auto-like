const { Builder, By, until } = require("selenium-webdriver");
const envFound = require("dotenv").config();

if (!envFound) {
  throw new Error("⚠️  Could not find .env file  ⚠️");
}

const { argv, env, exit } = process;

if (argv.length !== 3) {
  console.log(`usage: \n\t${argv[0]} ${argv[1]} targetUser`);
  exit(1);
}

const targetUser = argv[2];

const login = async (driver) => {
  const username = env.USERNAME;
  const password = env.PASSWORD;

  await driver.get("https://www.instagram.com/accounts/login/");
  await driver.wait(until.elementLocated(By.id("loginForm")));

  await driver
    .findElement(By.xpath('//input[@name="username"]'))
    .sendKeys(username);
  await driver
    .findElement(By.xpath('//input[@name="password"]'))
    .sendKeys(password);

  await driver.findElement(By.xpath("//button[@type='submit']")).click();

  // Pass to remember login info
  await driver.wait(
    until.elementLocated(By.xpath('//button[text()="나중에 하기"]'))
  );
  await driver.findElement(By.xpath("//button[text()='나중에 하기']")).click();

  // Pass to set alarm dialog
  await driver.wait(
    until.elementLocated(By.xpath('//button[text()="나중에 하기"]'))
  );
  await driver.findElement(By.xpath("//button[text()='나중에 하기']")).click();
};

const likePath =
  "//*[local-name()='svg' and @aria-label='좋아요']//parent::span//parent::div//parent::button";
const unlikePath =
  "//*[local-name()='svg' and @aria-label='좋아요 취소']//parent::span//parent::div//parent::button";
const sharePath =
  "//*[local-name()='svg' and @aria-label='게시물 공유']//parent::div//parent::button";
const nextPath = "//a[text()='다음']";

const like = async (driver) => {
  await driver.get(`https://www.instagram.com/${targetUser}/`);
  await driver.wait(until.elementLocated(By.xpath("//article")));
  await driver.findElement(By.xpath("//article/div/div/div/div/a")).click();

  while (true) {
    await driver.wait(until.elementLocated(By.xpath(sharePath)));
    try {
      await driver.findElement(By.xpath(unlikePath));
      break;
    } catch (e) {
      await driver.findElement(By.xpath(likePath)).click();
      await driver.wait(until.elementLocated(By.xpath(unlikePath)));
      await driver.findElement(By.xpath(nextPath)).click();
    }
  }
};

(async function example() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await login(driver);
    await like(driver);
    await driver.wait(until.titleIs("test1234"));
  } finally {
    await driver.quit();
  }
})();
