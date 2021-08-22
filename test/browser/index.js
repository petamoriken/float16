/* eslint-env node */

"use strict";

// console color
const red = "\u001b[31m";
const reset = "\u001b[0m";

// environment
const { TARGET_URL } = process.env;

function asyncElementIdText(client, element) {
    return new Promise((resolve) => {
        client.elementIdText(element, (e) => {
            resolve(e.value);
        });
    });
}

module.exports = {
    ["@petamoriken/float16 test"](client) {
        client.url(TARGET_URL || "http://127.0.0.1:8000/power.html")
              .waitForElementPresent("#mocha-report");

        client.elements("css selector", "#mocha-report .fail .error", async (e) => {
            const elements = e.value;

            // assert
            client.verify.ok(elements.length === 0);

            // show error log
            if(elements.length !== 0) {
                const promises = [];
                for (const value of elements) {
                    promises.push(asyncElementIdText(client, value.ELEMENT));
                }

                const errors = await Promise.all(promises);
                for (const error of errors) {
                    console.error(red + error + "\n" + reset);
                }
            }
        });
    },

    afterEach(client, done) {
        client.end();
        client.endSauce(done);
    },
};
