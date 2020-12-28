const express = require('express')
const hbs = require('hbs')
    //const mongodb = require('mongodb')

const app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb+srv://tee:1234560@cluster0.oahuu.mongodb.net/test';
app.get('/', async(req, res) => {
    let client = await MongoClient.connect(url); // await : ket noi xong moi chay. cau lenh tiep theo
    let dbo = client.db("ToyShop");
    let results = await dbo.collection("toys").find({}).toArray();
    res.render('index', { model: results })

})
app.get('/insert', (req, res) => {
    res.render('newProduct');
})
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/doInsert', async(req, res) => {
    let nameI = req.body.txtName;
    let priceI = req.body.txtPrice;
    let client = await MongoClient.connect(url); // await : ket noi xong moi chay. cau lenh tiep theo
    let dbo = client.db("ToyShop");
    let newProduct = { productName: nameI, price: priceI };
    await dbo.collection("toys").insertOne(newProduct);
    res.redirect('/');
})
app.get('/search', (req, res) => {
    res.render('search')
})
app.post('/doSearch', async(req, res) => {
    let nameI = req.body.txtName;
    let priceI = req.body.txtPrice;

    let regex = new RegExp('lego.|lego', 'i');
    if (nameI.match(regex)) {
        console.log('yes');

    } else {
        console.log('no');
    }
    let client = await MongoClient.connect(url); // await : ket noi xong moi chay. cau lenh tiep theo
    let dbo = client.db("ToyShop");
    let results = await dbo.collection("toys").find({ productName: nameI }).toArray();
    res.render('index', { model: results })

})
app.get('/delete', async(req, res) => {
    let id = req.query.id;
    let ObjectID = require('mongodb').ObjectID;
    let condition = { "_id": ObjectID(id) };
    let client = await MongoClient.connect(url); // await : ket noi xong moi chay. cau lenh tiep theo
    let dbo = client.db("ToyShop");
    await dbo.collection("toys").deleteOne(condition)
    res.redirect('/');

})


var PORT = process.env.PORT || 3000;
app.listen(PORT)
console.log('Server is running on  ')