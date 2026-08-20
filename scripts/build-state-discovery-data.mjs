import fs from "node:fs";

const research = JSON.parse(fs.readFileSync("/home/ubuntu/state_discovery_research.json", "utf8"));
const [header, ...rows] = fs.readFileSync("/home/ubuntu/trailtrek-capitals.csv", "utf8").trim().split("\n");
const columns = header.split(",");
const capitalRows = rows.map((row) => Object.fromEntries(row.split(",").map((value, index) => [columns[index], value])));
const fipsByCode = {
  AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09", DE: "10", FL: "12", GA: "13",
  HI: "15", ID: "16", IL: "17", IN: "18", IA: "19", KS: "20", KY: "21", LA: "22", ME: "23", MD: "24",
  MA: "25", MI: "26", MN: "27", MS: "28", MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34",
  NM: "35", NY: "36", NC: "37", ND: "38", OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45",
  SD: "46", TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54", WI: "55", WY: "56",
};

const researchByState = new Map(research.results.map((entry) => [entry.output.state, entry.output]));
const data = capitalRows.map((capital) => {
  const source = researchByState.get(capital.state);
  if (!source) throw new Error(`Missing research for ${capital.state}`);
  const filename = source.image_source_url.split("/File:")[1] ?? "";
  return {
    state: capital.state,
    code: capital.abbreviation,
    fips: fipsByCode[capital.abbreviation],
    capital: capital.capital,
    latitude: Number(capital.latitude),
    longitude: Number(capital.longitude),
    stateFact: source.state_fact,
    historyFact: source.history_fact,
    landmark: source.landmark,
    factSourceUrl: source.fact_source_url,
    imagePageUrl: source.image_source_url,
    imageUrl: filename ? `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=900` : "",
    imageCredit: source.image_credit,
  };
});

const output = `/**\n * State discovery data compiled from cited research and xFront capital coordinate references.\n * Run: node scripts/build-state-discovery-data.mjs\n */\nexport type StateDiscovery = {\n  state: string; code: string; fips: string; capital: string; latitude: number; longitude: number;\n  stateFact: string; historyFact: string; landmark: string; factSourceUrl: string;\n  imagePageUrl: string; imageUrl: string; imageCredit: string;\n};\n\nexport const stateDiscovery: StateDiscovery[] = ${JSON.stringify(data, null, 2)};\n`;
fs.mkdirSync("client/src/data", { recursive: true });
fs.writeFileSync("client/src/data/stateDiscovery.ts", output);
console.log(`Wrote ${data.length} state discovery records.`);
