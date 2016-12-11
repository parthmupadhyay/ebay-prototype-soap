/**
 * Created by Parth on 06-10-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var logger=require('../routes/usertracking');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};
exports.profile=function (request,response)
{
    var username=request.param("username");
    console.log(username);
    if(username==undefined)
    {
        username=request.session.username;
        logger.info(request.session.user_id+ ":Loading user profile");
    }
    else
    {
        logger.info(request.session.user_id+ ":loading profile of user:"+username);
    }
    var url=baseURL+"/Profile?wsdl";
    var args = {username: username};
    soap.createClient(url,option, function(err, client) {
        client.loadProfile(args, function (err, result)
        {

            if(err)
                console.log("Error occurred:"+err);
            else
            {var jsonResult = JSON.parse(result.loadProfileReturn);
                console.log("User Profile:",jsonResult)
                response.render('profile',{result:jsonResult});
            }
        });
    });

}

