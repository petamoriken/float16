"use strict";

// console color
const red = "\u001b[31m";
const reset = "\u001b[0m";

// environment
const { TARGET_URL } = process.env;

function asyncElementIdText(client, element) {
    return new Promise(resolve => {
        client.elementIdText(element, e => {
            resolve(e.value);
        });
    });
}

module.exports = {
    ["browser test"](client) {
        client.url(TARGET_URL || "http://localhost:8000/docs/test/power.html").pause(1000);

        client.elements("css selector", "#mocha-report .fail .error", async e => {
            const elements = e.value;

            // assert
            client.verify.ok(elements.length === 0);

            // show error log
            if(elements.length !== 0) {
                const promises = [];
                for(const value of elements) {
                    promises.push(asyncElementIdText(client, value.ELEMENT));
                }

                const errors = await Promise.all(promises);
                for(const error of errors) {
                    console.error(red + error + "\n" + reset);
                }
            }
        });
    },

    afterEach(client, done) {
        client.customSauceEnd();
        setTimeout(done, 500);
    }
};