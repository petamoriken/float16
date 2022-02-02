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
    let elements = null;
    let success = false;

    try {
      elements = await client.url(
        TARGET_URL || "http://127.0.0.1:8000/power.html",
      )
        .waitForElementPresent("#mocha-report .suite:nth-of-type(4)", 30000)
        .findElements("#mocha-report .test .error");
    } catch (e) {
      if (e.name === "NoSuchElementError") {
        success = true;
      } else {
        // unexpected error
        throw e;
      }
    }

    client.verify.ok(success, "Check error elements");
    if (success) {
      return;
    }

    // show error log
    const result = elements.value;
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
