var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();

const mercadopago = require ('mercadopago')

const url = 'https://davidmessina-mp-ecommerce-node.herokuapp.com/'

mercadopago.configure({

    access_token : 'APP_USR-6317427424180639-042414-47e969706991d3a442922b0702a0da44-469485398',

    integrator_id : 'dev_24c65fb163bf11ea96500242ac130004'

})


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get ('/success', function (req, res){
    console.log(req.query);
    return res.render ('success', {
        payment_type : req.query.payment_type,
        external_reference : req.query.external_reference,
        collection_id : req.query.collection_id
    })
});

app.get ('/pending', function (req, res){
    console.log(req.query);
    return res.render ('pending')
});

app.get ('/failure', function (req, res){
    console.log(req.query);
    return res.render ('failure')
});

app.post ('/notifications', function (req, res) {
    console.log('Notification', req.body)
    res.send(req.body)
    /*res.status(200).end('OK');*/
});

app.post('/buy', function (req, res){

    let preference = {

        back_urls : {
            success : url + 'success',
            pending : url + 'pending',
            failure : url + 'failure', 
        },

        notification_url : url + 'notifications',

        auto_return : 'approved',

        payer : {
            name : 'Lalo',
            surname : 'Landa',
            email : 'test_user_63274575@testuser.com',
            phone : {
                area_code : '11',
                number : 22223333,
            },
            address : {
                zip_code : '1111',
                street_name : 'False',
                street_number : 123,
            }
        },
        
        payment_methods : {

            excluded_payment_methods : [
                { id : 'amex'}
            ],
            
            excluded_payment_types : [
                { id : 'atm'}
            ],

            installments : 6

        },

        items : [
            {
                id : 1234,
                title : 'Nombre del producto seleccionado del carrito del ejercicio',
                description : 'Dispositivo móvil de Tienda e-commerce',
                picture_url : 'https://davidmessina-mp-ecommerce-node.herokuapp.com/assets/samsung-galaxy-s9-xxl.jpg',
                quantity : 1,
                unit_price : 15000,
            }
        ],

        external_reference : 'davidmessina9@gmail.com'
    }

    mercadopago.preferences.create(preference).then(response => {

        console.log(response);

        let respuesta = response.body.init_point

        res.render('buy', {respuesta : respuesta})        

    }).catch(error => {

        console.log(error);

        res.send('error')

    })


});

app.listen(port);