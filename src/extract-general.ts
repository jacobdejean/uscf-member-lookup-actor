import * as cheerio from "cheerio";

type DataPointType = "row" | "other";

const dataPoints: Record<string, DataPointType> = {
    "Regular Rating": "row",
    "Quick Rating": "row",
    "Blitz Rating": "row",
    "Online-Regular Rating": "row",
    "Online-Quick Rating": "row",
    "Online-Blitz Rating": "row",

    "Overall Ranking": "row",
    "State Ranking": "row",

    "Correspondence Rating": "row",
    State: "row",
    Gender: "row",
    "Expiration Dt.": "row",
    "Last Change Dt.": "row",

    Name: "other",
    ID: "other",
};

export type USChessMemberGeneral = {
    [Property in keyof typeof dataPoints]: string;
};

const blankData: USChessMemberGeneral = {
    ...Object.keys(dataPoints).reduce(
        (prev, curr) => ({
            ...prev,
            [curr]: "--",
        }),
        {},
    ),
};

export default function extractGeneral(
    htmlContent: string,
): USChessMemberGeneral {
    const $ = cheerio.load(htmlContent);

    const errorMessage = $('font[color="A00000"] b').text().trim();
    const isInvalid =
        errorMessage.includes("Error") ||
        errorMessage.includes("Could not retrieve data");

    if (isInvalid) {
        return blankData;
    }

    const idAndName = $('font[size="+1"] b').text().split(": ");
    const id = idAndName[0];
    const fullName = idAndName[1];

    const points: { [key: string]: string } = {};
    $("tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length >= 2) {
            const pointType = $(cells[0]).text().trim();
            if (
                Object.keys(dataPoints).includes(pointType) &&
                dataPoints[pointType] === "row"
            ) {
                const pointValue = $(cells[1])
                    .find("b")
                    .text()
                    .trim()
                    .split(" ")[0];
                points[pointType] = pointValue;
            }
        }
    });

    return {
        ...points,
        Name: fullName,
        ID: id,
    };
}
