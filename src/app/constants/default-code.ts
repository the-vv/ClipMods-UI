export const DEFAULT_MOD_CODE = `
"use strict";
// @ts-check

/**
 * Write the logic for modifying the input texts.
 *
 * Arguments will be passed as $0, $1, $2, ..., based on how many are provided.
 * Example: if inputArgs = ["hello", "world"], then use $0 = "hello", $1 = "world"
 *
 * ⚠️ IMPORTANT: Assign the final output string to response.result
 *
 * @param {string[]} inputArgs
 * @param {{ _: typeof import("lodash"), dateFns: typeof import("date-fns") }} utils
 */
function executeMod(inputArgs, utils) {
    const response = { result: "" };

    const { _, dateFns } = utils;

    const [$0, $1] = inputArgs; // Adjust as needed for more args
    // Write your logic here using $0, $1, _, dateFns, etc.
    // Example: response.result = _.startCase($0 + " " + $1);

    return response;
}
// Below area is usable for declaring utility functions or other global variables

`.trimStart();
