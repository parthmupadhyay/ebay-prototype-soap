var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var moment= require('moment');
var logger=require('../routes/usertracking');
var biddingLogger= require('../routes/biddingTracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};
exports.addOrderEntry=function (request,response)
{
    var user_id=request.session.user_id;
    var total=request.param("total");
    var date = moment().format('YYYY-MM-DD');
    var orderUrl=baseURL+"/Order?wsdl";
    var args = {userId: user_id,total:total,date:date};
    soap.createClient(orderUrl,option, function(err, client)
    {
        client.addOrderEntry(args, function (err, result)
        {
            if (err)
                console.log(err);
            else
            {
                if(result.addOrderEntryReturn.result)
                {
                    response.send({"statusCode":200,"order_id":result.addOrderEntryReturn.insertedId});
                }
                else
                {
                    response.send({"statusCode":401});
                }
            }
        });
    });
}

exports.addOrderDetails=function(request,response)
{
    var order_id=request.param("order_id");
    var cartData=request.param("cartData");
    var flag=true;
    for(var i=0;i<cartData.length;i++)
    {
        var data=
        {
            productId:cartData[i].product_id,
            productName:cartData[i].product_name,
            quantity:cartData[i].quantity,
            price:cartData[i].price,
            orderId:order_id
        }
        var orderUrl=baseURL+"/Order?wsdl";
        var args = {data:JSON.stringify(data)};
        soap.createClient(orderUrl,option, function(err, client) {
            client.addOrderDetails(args, function (err, result) {
                if (err)
                    console.log(err);
                else
                {
                    if(result.addOrderDetailsReturn)
                        console.log(result.addOrderDetailsReturn);
                    else
                    {
                        console.log("failed");
                        flag=false;
                    }
                }
            });
        });
    }
    if(flag)
         response.send({"statusCode":200});
    else
        response.send({"statusCode":401});
}

exports.updateSellers=function (request,response)
{
    var cartData=request.param("cartData");
    var flag=true;
    for(var i=0;i<cartData.length;i++)
    {
        var orderUrl=baseURL+"/Order?wsdl";
        var args = {data:JSON.stringify(data)};
        soap.createClient(orderUrl,option, function(err, client) {
            client.addOrderDetails(args, function (err, result) {
                if (err)
                    console.log(err);
                else
                {
                    if(!result.updateSellersReturn)
                        flag=false;
                }
            });
        });
    }
    if(flag)
        response.send({"statusCode":200});
    else
        response.send({"statusCode":401});

}

exports.emptyCart=function (request,response)
{
    var user_id=request.session.user_id;
    var cartUrl=baseURL+"/Cart?wsdl";
    var args = {userId: user_id};
    soap.createClient(cartUrl,option, function(err, client) {
        client.emptyCart(args, function (err, result) {
            if (err)
                console.log(err);
            else
            {
                if(result.emptyCartReturn)
                    response.send({"statusCode":200});
                else
                    response.send({"statusCode":401});
            }
        });
    });
}

exports.loadOrders=function (request,response)
{
    var user_id=request.session.user_id;
    var orderUrl=baseURL+"/Order?wsdl";
    var args = {userId: user_id};
    soap.createClient(orderUrl,option, function(err, client) {
        client.loadOrders(args, function (err, result) {
            if (err)
                console.log(err);
            else
            {
                response.send({"statusCode":200,"orders":result.loadOrdersReturn});
            }
        });
    });
}


exports.loadOrderDetails=function (request,response)
{
    var orders=request.param("orders");
    var flag=true;
    var orderList= [];

    var temp=0;
    logger.info(request.session.user_id+ ":"+request.session.username+" clicked on view orders, loading orders");
    for(var i=0;i<orders.length;i++)
    {

        var order_id=orders[i].order_id;
        var order_date=orders[i].order_date;
        var orderUrl=baseURL+"/Order?wsdl";
        var args = {orderId: order_id};
        soap.createClient(orderUrl,option, function(err, client) {
            client.loadOrderDetails(args, function (err, result) {
                if (err)
                    console.log(err);
                else
                {
                    for(var i=0;i<result.loadOrderDetailsReturn.length;i++)
                    {
                        result.loadOrderDetailsReturn[i].order_date=new Date(result.loadOrderDetailsReturn[i].order_date).toDateString();

                        console.log(result.loadOrderDetailsReturn[i].order_date);
                    }
                    orderList.push(result.loadOrderDetailsReturn);
                }
            });
        });
    }
    setTimeout(function ()
    {
        if(temp==orders.length)
        {
            response.send({"statusCode":200,"orderDetails":orderList});
        }
    },300);

}

exports.addToCart=function(request,response)
{
    var cartUrl=baseURL+"/Cart?wsdl";
    var data=
    {
        userId:request.session.user_id,
        productId:request.param("product_id"),
        productName:request.param("product_name"),
        quantity:request.param("quantity"),
        price:request.param("price"),
        sellerId:request.param("seller_id")
    };
    console.log("Added to cart",data);
    var args = {cartItem: JSON.stringify(data)};
    soap.createClient(cartUrl,option, function(err, client)
    {
        client.addToCart(args, function (err, result)
        {
            if(err)
                console.log(err);
            else
            {
                if(result.addToCartReturn==true)
                {
                    response.send({'statusCode' : 200});
                }
                else
                {
                    response.send({'statusCode' : 401});
                }
            }
        });
    });

}

exports.loadCart=function (request,response)
{
    var cartUrl=baseURL+"/Cart?wsdl";
    var args = {userId: request.session.user_id};
    soap.createClient(cartUrl,option, function(err, client)
    {
        client.loadCart(args, function (err, result)
        {
            if(err)
                console.log(err);
            else
            {
                console.log(result.loadCartReturn);
                response.send({'statusCode' : 200,'cartData':JSON.parse(result.loadCartReturn)});
            }
        });
    });
}

exports.removeFromCart=function(request,response)
{
    var cartUrl=baseURL+"/Cart?wsdl";
    var cart_id=request.param("cart_id");
    var args = {cartId: cart_id};
    soap.createClient(cartUrl,option, function(err, client) {
        client.removeFromCart(args, function (err, result)
        {
            if(err)
                console.log(err);
            else
            {
            if(result.removeFromCartReturn)
                response.send({"statusCode":200});
            else
                response.send({"statusCode":401});
            }
        });
    });
}

exports.updateCartItem=function(request,response)
{
    var cartUrl=baseURL+"/Cart?wsdl";
    var cart_id=request.param("cart_id");
    var quantity=request.param("quantity")

    var args = {cartId: cart_id,quantity:quantity};
    soap.createClient(cartUrl,option, function(err, client)
    {
        client.updateCartItem(args, function (err, result)
        {
            if (err)
                console.log(err);
            else
            {
                if(result.updateCartItemReturn)
                    response.send({"statusCode":200});
                else
                    response.send({"statusCode":401});
            }
        });
    });
}

exports.bidForProduct=function (request,response)
{

    var bidAmount= request.param("bidAmount");
    var product_id=request.param("product_id");
    var user_id=request.session.user_id;
    var query1="select bid_id from bidProduct where product_id="+product_id;
    biddingLogger.info("User ID:"+user_id+"||Bidding for product:"+product_id+"||BidAmount:"+bidAmount);
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            var query2="insert into bid_detail(bid_id,bid_amount,bidder_id,bid_time) values("+result[0].bid_id+","+bidAmount+","+user_id+","+Date.now()/1000+")";
            mysql_handler.execute(function (err,result1)
            {
                if(err)
                {
                    console.log("Error occurred:"+err);
                }
                else
                {
                    logger.info(request.session.user_id+ ":"+request.session.name+" bidded "+bidAmount+" for product="+product_id);
                    response.send({"statusCode":200});
                    updatePrice(bidAmount,product_id);
                    biddingLogger.info("User ID:"+user_id+"||Current Price for Product:"+product_id+" updated to:"+bidAmount);
                }
            },query2);

        }
    },query1);


}

function updatePrice(bidAmount,product_id)
{
    var query="update products set price ="+bidAmount+" where product_id="+product_id+";";
    mysql_handler.execute(function (err,result)
    {
        if(err)
        {
            console.log("Error occurred:"+err);
        }
        else
        {
            logger.info("Current price for product="+product_id+" changed to "+bidAmount);
            console.log("Price Updated");

        }
    },query);
}