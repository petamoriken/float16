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
    const result = await new Promise((resolve) => {
      client.url(TARGET_URL || "http://127.0.0.1:8000/power.html")
        .waitForElementPresent("#mocha-report .suite:nth-of-type(4)", 30000)
        .elements("css selector", "#mocha-report .test .error", resolve);
    });

    // unexpected error
    client.verify.ok(result.status === 0, "Check unexpected error");
    if (result.status !== 0) {
      throw result.value;
    }

    const success = result.value == null || result.value.length === 0;
    client.verify.ok(success, "Check error elements");

    // show error log
    if (!success) {
      for (const element of result.value) {
        const { value: error } = await client.elementIdText(element.ELEMENT);
        client.verify.ok(false, `\n\n${red}${error}${reset}\n\n`);
      }
    }
  },

  afterEach(client) {
    client.endSauce();
    client.end();
  },
};
