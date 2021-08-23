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
              .findElements("#mocha-report .test");

        const result = elements.value;
        for (const element of result) {
            const id = element.getId();

            const targets = [];
            {
                const { value: { ELEMENT: targetId } } = await client.elementIdElement(id, "xpath", "../preceding-sibling::h1");
                const { value: target } = await client.elementIdText(targetId);
                targets.push(target);

                const { value: { ELEMENT: parentTargetId } } = await client.elementIdElement(targetId, "xpath", "../../preceding-sibling::h1");
                if (parentTargetId !== undefined) {
                    const { value: parentTarget } = await client.elementIdText(parentTargetId);
                    targets.unshift(parentTarget);
                }
            }

            const { value: { ELEMENT: titleId } } = await client.elementIdElement(id, "css selector", "h2");
            const { value: rawTitle } = await client.elementIdText(titleId);
            const title = rawTitle.split("\n")[0];

            const { value: { ELEMENT: errorId } } = await client.elementIdElement(id, "css selector", ".error");
            const failed = errorId !== undefined;

            if (!failed) {
                client.verify.ok(true, `${targets.join(" ")}: ${title}`);
                continue;
            }

            const { value: error } = await client.elementIdText(errorId);
            client.verify.ok(false, `${targets.join(" ")}: ${title}\n\n${red}${error}${reset}\n\n`);
        }
    },

    afterEach(client, done) {
        client.end();
        client.endSauce(done);
    },
};
