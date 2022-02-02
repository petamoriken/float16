"use strict";

// console color
const red = "\u001b[31m";
const reset = "\u001b[0m";

// environment
const { TARGET_URL } = process.env;

/** @type {import("nightwatch").NightwatchTestFunctions} */
module.exports = {
  /** @param {import("nightwatch").NightwatchBrowser} client */
  async ["Browser Test"](client) {
    const elements = await client.url(
      TARGET_URL || "http://127.0.0.1:8000/power.html",
    )
      .waitForElementPresent("#mocha-report .suite:nth-of-type(4)", 30000)
      .findElements("#mocha-report .test .error");

    const result = elements.value;
    const success = result == null;

    client.verify.ok(success, "Check error elements");
    if (success) {
      return;
    }

    // show error log
    for (const element of result) {
      const id = element.getId();
      const { value: error } = await client.elementIdText(id);
      client.verify.ok(false, `\n\n${red}${error}${reset}\n\n`);
    }
  },

  afterEach(client, done) {
    client.end();
    client.endSauce(done);
  },
};
