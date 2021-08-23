/* eslint-env node */

"use strict";

// console color
const red = "\u001b[31m";
const reset = "\u001b[0m";

// environment
const { TARGET_URL } = process.env;

module.exports = {
    async ["Browser Test"](client) {
        const elements = await client.url(TARGET_URL || "http://127.0.0.1:8000/power.html")
              .waitForElementPresent("#mocha-report")
              .findElements("#mocha-report .test .error");

        const result = elements.value;
        const failed = result.length !== 0;
        client.verify.ok(!failed, "Check error elements");

        if (!failed === 0) {
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
