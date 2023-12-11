const { Builder } = require('selenium-webdriver');

let driver;
(async () => {
  try {
    driver = await new Builder().forBrowser('chrome').build();
    
    await driver.get('https://www.google.co.jp/');
    await driver.sleep(5000);
  }
  catch(error) {
    console.error(error);
  }
  finally {
    if(driver) {
      await driver.quit();
    }
  }
})();