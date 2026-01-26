require("dotenv").config();

const connectDb = require("../config/db");
const Tender = require("../models/Tender");
const tenders = require("./tenders");

const run = async () => {
  try {
    await connectDb(process.env.MONGODB_URI);
    await Tender.deleteMany({});
    await Tender.insertMany(tenders);
    console.log(`Seeded ${tenders.length} tenders`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }
};

run();
