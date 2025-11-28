const mongoose=require("mongoose");
const Listening=require("../models/listing.js");
const initData=require("./data.js");
// const mongoUrl='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl = process.env.ATLASTDBURl;

main()
.then(()=>{
    console.log("connect to dbs");
})
.catch(err=>console.log(err))
async function main() {
    await mongoose.connect(dbUrl);
} 

const initDb=async ()=>{
    await Listening.deleteMany({});
    initData.data=initData.data.map((obj) => ({
		...obj,
		owner: "690ba1ee48766e5d48d4173a",
	}));
    await Listening.insertMany(initData.data);
    console.log("data initialize");
}
initDb();