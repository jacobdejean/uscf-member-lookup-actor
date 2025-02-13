import axios from "axios";
import invariant from "tiny-invariant";
import { Actor } from "apify";

import { ActorInput, USChessMemberInfo } from "./types.js";
import extractGeneral from "./extract-general.js";

await Actor.init();

const input = await Actor.getInput<ActorInput>();
invariant(input, "400 Input is missing");
invariant(input.id, "400 Input ID is missing");

const uscfBaseUrl = "https://www.uschess.org";
const uscfPageSuffix = ".php";

const memberDataTabPaths = [
    "msa/MbrDtlMain", // General tab
    "msa/MbrDtlMilestones", // More tab
    "msa/MbrDtlRtgSupp", // Rating Supplement tab
    "msa/MbrDtlTnmtDir", // Tournament Director tab
    "msa/MbrDtlTnmtHst", // Tournament History tab
];

// each tab has it's own layout for data so we'll want to handle
// them individually
const uscfMemberUrls = memberDataTabPaths.map(
    (tabPath) => `${uscfBaseUrl}/${tabPath}${uscfPageSuffix}?${input.id}`,
);

// wait for all tabs to download. note these will not be in order
const responses = await Promise.all(
    uscfMemberUrls.map((url) => axios.get(url)),
);

// hold tab date here awaiting consolidation
const tabRecord = new Map();

// so trust axios config instead of array order
responses.forEach((response) => {
    invariant(response.config.url, "500 Failed to parse axios response");
    invariant(response.data, "500 Failed to find response data");
    invariant(
        typeof response.data === "string",
        "500 Response data is not a string",
    );
    invariant(response.data.length, "500 Response data has no length");

    const tabPath = new URL(response.config.url).pathname
        .replace(uscfPageSuffix, "")
        .replace("/", ""); // leading slash
    tabRecord.set(tabPath, selectExtractor(tabPath, response.data));
});

function selectExtractor(tabPath: string, htmlContent: string) {
    switch (tabPath) {
        case "msa/MbrDtlMain":
            return extractGeneral(htmlContent);
        case "msa/MbrDtlMilestones":
        case "msa/MbrDtlRtgSupp":
        case "msa/MbrDtlTnmtDir":
        case "msa/MbrDtlTnmtHst":
        default:
            return {};
    }
}

const memberData = {
    general: tabRecord.get("msa/MbrDtlMain"),
};

invariant(
    input.id === memberData.general.ID,
    "Extracted member info does not match input search",
);

// Save headings to Dataset - a table-like storage.
await Actor.pushData([
    {
        [memberData.general.ID]: memberData,
    },
]);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit().
await Actor.exit();
