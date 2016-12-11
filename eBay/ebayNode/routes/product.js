/**
 * Created by Parth on 03-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};
exports.productDetails=function (request,response)
{
    var productDetailUrl=baseURL+"/Product?wsdl";
    if(request.session.username) {
        var product_id = request.param("productID");
        var username = request.session.username;
        var lastloggin = request.session.lastloggin;
        var user_id = request.session.user_id;
        var args = {productId: product_id};
        soap.createClient(productDetailUrl,option, function(err, client)
        {
            client.loadProductDetails(args, function (err, result)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    var jsonResult = JSON.parse(result.loadProductDetailsReturn);
                    console.log(jsonResult);
                    response.render('productDetail', {productDetail: jsonResult});
                }
            });
        });
    }
    else
    {
        response.render('index',{title:"Sign in to continue"});
    }
}