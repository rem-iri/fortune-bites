// REST API for fortunes

const express = require("express");
const app = express();
const port = 8088;

// File system
const fs = require("fs").promises

app.use(express.static("public"))
app.use((req, res, next) => {
    // Sanitize here    
    next();
})

app.get("/api/fortune/:category", async function (req, res) {
    let category = req.params.category;
    let fileText = await getFortuneFromFile(category);

    // console.log(req.params.category);
    // console.log(req.body);
    // console.log(req.url);
    // console.log(req.query);

    let fortunesArr = unescape(fileText).split("%");
    let randomIndex = Math.ceil(Math.random() * (fortunesArr.length-2));
    let fortune = fortunesArr[randomIndex];
    
    let result = {"fortune": fortune, "category": category};
    result["fortune"] = fortune;

    res.json(result);
    res.end()    
})
.listen(port, () => {
    console.log(`Running at port ${port}`);
})

function getFortuneFromFile(category) {
    let path = "./datfiles/" + category;
    return fs.readFile(path, "utf-8").then( (value) => { return value });
}