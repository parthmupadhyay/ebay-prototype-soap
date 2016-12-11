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

exports.userAdvertisements=function(request, response)
{
    var url=baseURL+"/Advertisement?wsdl"
    if(request.session.username) {
        var user_id = request.session.user_id;
        var args = {userId: user_id};
        soap.createClient(url,option, function(err, client)
        {
            client.getAdvertisements(args, function (err, result)
            {
                if (err)
                    console.log(err);
                else
                {
                    if(result.getAdvertisementsReturn)
                    {
                        logger.info(request.session.user_id+ ":loading user advertisement");
                        response.send({"statusCode":200,"userAds":result.getAdvertisementsReturn});
                    }
                    else
                    {
                        response.send({"statusCode":401});
                    }
                }
            });
        });
    }
    else
    {
        response.render('index',{title:"Session expired, please sign in to continue"});
    }
}