const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/signup.html');
});
app.post('/failure', function(req, res){
    res.redirect('/');
});
app.post('/', function(req, res){
    // console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data ={
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us18.api.mailchimp.com/3.0/lists/a1f0b97a60';
    const options = {
        method: 'Post',
        auth: 'aman:8635a08cab2a3472351fd405b79dd01f-us18'
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            response.on('data', function(data){
                console.log(JSON.parse(data));
            });
            res.sendFile(__dirname+'/success.html');
        }
        else{
            res.sendFile(__dirname+'/failure.html');
        }
    });
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function(req, res){
    console.log('Server is online...');
});

// 8635a08cab2a3472351fd405b79dd01f-us18

// a1f0b97a60