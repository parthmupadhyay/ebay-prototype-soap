/**
 * Created by Parth on 29-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var userAdd=require('./Advertisements');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};


exports.addAdvertise=function(request,response)
{
    var user_id= request.session.user_id;
    var productName= request.param("productName");
    var description= request.param("description");
    var price= request.param("price");
    var bidding =request.param("bidding");
    if(bidding=="on")
    {
        bidding=true;
    }
    else
        bidding=false;

    console.log("bidding:"+bidding);
    var quantity=request.param("quantity");
    var url=baseURL+"/Advertisement?wsdl";
    var biddingurl=baseURL+"/Bidding?wsdl"
    var username= request.param("username");
    var data=
    {
        productName:productName,
        sellerId:user_id,
        description:description,
        quantity:quantity,
        price:price,
        isBidProduct:bidding
    }
    var args = {data: data};
    soap.createClient(url,option, function(err, client)
    {
        client.addAdvertise(args, function (err, result)
        {
            if(err)
                console.log(err);
            else
            {
                if(result.addAdvertiseReturn)
                {
                    logger.info(request.session.user_id+ ":added new advertise for selling");
                    logger.info(request.session.user_id+":productname="+productName+" ,Quantity="+quantity+", Price="+price);
                    console.log("Inserted product");
                    console.log(result.addAdvertiseReturn.result);
                    if(bidding) {
                        biddingLogger.info("User_id:" + request.session.user_id + "|| added new product for bidding");
                        biddingLogger.info(request.session.user_id + ":productname=" + productName + " ,Quantity=" + quantity + ", Price=" + price);
                        console.log("Current timestamp:" + Date.now() / 1000);
                        console.log("After 4 days : " + (Date.now() / 1000 + (96 * 60 * 60)));
                        var data2 =
                        {
                            productId: result.addAdvertiseReturn.insertedId,
                            bidStartTime: Date.now() / 1000,
                            bidEndTime: (Date.now() / 1000 + (96 * 60 * 60)),
                            highestBid: price,
                            isBidEnded: 0
                        }
                        var args2 = {data: data2};
                        soap.createClient(biddingurl, option, function (err, client) {
                            client.insertBidProduct(args, function (err, result2) {
                                if (err)
                                    console.log(err);
                                else {
                                    if (result2.insertBidProductReturn) {
                                        response.render('advertisements');
                                    }
                                }
                            });
                        });
                    }
                    else
                    {
                        response.render('advertisements');
                    }
                }
            }
        });

    });

}