/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var bcrypt=require('bcrypt-nodejs');
var logger=require('../routes/usertracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};

exports.signIn=function(request,response)
{

    var username= request.param("username");
    var password= request.param("password");
    var signUrl=baseURL+"/Login?wsdl";
    var args = {username: username,password: password};
    soap.createClient(signUrl,option, function(err, client) {
        client.login(args, function(err, result)
        {
            var jsonResult=JSON.parse(result.loginReturn);
            if(jsonResult.statusCode==200)
            {
                console.log(jsonResult);
                request.session.username = username;
                request.session.user_id= jsonResult.userid;
                request.session.lastloggin=jsonResult.lastloggin;
                response.render('product');
            }
            else
            {
                logger.info("failed signin attempt for user :"+username);
                response.render("index",{title:"Invalid username/password"});
            }
        });
    });
}

exports.loadProducts=function(request,response)
{
    var loadProductUrl=baseURL+"/Product?wsdl";
    if(request.session.user_id)
    {
        console.log(request.session.user_id);
        var user_id = request.session.user_id;
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var args = {userid: user_id};
        soap.createClient(loadProductUrl,option, function(err, client)
        {
            client.loadProducts(args, function (err, result)
            {
                var jsonResult = JSON.parse(result.loadProductsReturn);
                console.log(jsonResult);
                response.send({"statusCode":200,"products":jsonResult});
            });
        });
    }
    else
    {
        response.send({"statusCode":401});
    }

}
