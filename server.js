const MongoClient = require("mongodb").MongoClient;
const express = require("express");
const body = require("body-parser");
const app = express();

app.set('views', 'ejs');

/* model */
const host = '127.0.0.1';
const port = 27017;
const base = 'local';
const uri = "mongodb://" + host + ":" + port + "/" + base;
const client = new MongoClient(uri);

app.use(body.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/view'));

async function data(filter, res) {
    await client.connect();
    const db = client.db("local");
    const products = db.collection("products");
    await products.find(filter).toArray(function(err, result) {
        result.forEach(function(linha) {
            if (linha.discount > 0)
                linha.discount = linha.price - (linha.price * (linha.discount / 100))
            linha.discount = linha.discount.toFixed(2).replace('.', ',');
            linha.price = linha.price.toFixed(2).replace('.', ',')
        });
        res.render(__dirname + "/view/list.ejs", { products: result });
    });
}

app.get("/", function(req, res) {
    console.log(1);
    data({}, res)
})

app.listen(3000, function() {
    console.log('listening port 3000')
})