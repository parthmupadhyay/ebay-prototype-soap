/**
 * Created by Parth on 11-10-2016.
 */
var mysql=require('./mysql-handler');
var moment=require('moment');
var logger= require('../routes/biddingTracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};
setInterval(function (request,response)
{
    var args = {};
    var biddingurl=baseURL+"/Bidding?wsdl";
    soap.createClient(biddingurl,option, function(err, client) {
        client.getRunningBidProducts(args, function (err, result) {
            if (err)
                console.log(err);
            else
            {
                if(result.getRunningBidProductsReturn)
                {
                    for(var i=0;i<result.getRunningBidProductsReturn.length;i++)
                    {
                        if((Date.now()/1000)>results[i].bidEndTime)
                        {
                            console.log("Bid ended for Product:"+result.getRunningBidProductsReturn[i].product_id);
                            closeBid(result.getRunningBidProductsReturn[i].bid_id);
                            addOrderToAccount(result.getRunningBidProductsReturn[i].bid_id,result.getRunningBidProductsReturn[i].product_id);

                        }
                        else
                        {
                            console.log("Bid still under progress for: "+result.getRunningBidProductsReturn[i].product_id);
                        }
                    }
                }
            }
        });
    });
},500000);

function closeBid(bid_id)
{
    var args = {bidId:bid_id};
    var biddingurl=baseURL+"/Bidding?wsdl";
    soap.createClient(biddingurl,option, function(err, client)
    {
        client.closeBid(args, function (err, result)
        {
            if (err)
                console.log(err);
            else
            {
                console.log("bid closed");
            }
        });
    });
}

function updateQuantity(product_id)
{
    var args = {productId:product_id};
    var biddingurl=baseURL+"/Bidding?wsdl";
    soap.createClient(biddingurl,option, function(err, client)
    {
        client.updateQuantity(args, function (err, result)
        {
            if (err)
                console.log(err);
            else
            {
                console.log("quantity updated");
            }
        });
    });
}

function addOrderToAccount(bid_id,product_id)
{
    var args = {bidId:bid_id};
    var biddingurl=baseURL+"/Bidding?wsdl";
    soap.createClient(biddingurl,option, function(err, client)
    {
        client.getBidDetail(args, function (err, result)
        {
            if(err)
                console.log(err);
            else
            {
                console.log(result.getBidDetailReturn[0]);
                if(result.getBidDetailReturn[0])
                {
                    var date = moment().format('YYYY-MM-DD');
                    var args2=
                    {
                        userId:result.getBidDetailReturn[0].bidder_id,
                        total:result.getBidDetailReturn[0].bid_amount,
                        orderDate:date
                    }
                    soap.createClient(biddingurl,option, function(err, client) {
                        client.addOrder(args2, function (err, result2) {
                            if (err)
                                console.log(err);
                            else
                            {
                                if (result2.addOrderReturn.result)
                                {
                                    //addOrderDetails(result2.addOrderReturn.insertedId,product_id);
                                }
                            }
                        });
                    });

                }
            }
        });
    });
}
