/**
 * Created by Parth on 30-09-2016.
 */
var ejs= require('ejs');
var mysql_handler = require('../routes/mysql-handler');
var moment= require('moment');
var bcrypt= require('bcrypt-nodejs');
var soap = require('soap');
var baseURL = "http://localhost:8080/ebayLab3/services";
var option = {
    ignoredNamespaces : true
};

exports.checkUserName=function(request,response)
{
    var url=baseURL+"/SignUp?wsdl"
    var username= request.param("username");
    var args = {username: username};
    soap.createClient(url,option, function(err, client)
    {
        client.checkUserName(args, function (err, result)
        {
            //console.log(result.checkUserNameReturn);
            if(result.checkUserNameReturn)
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        });
    });

}

exports.checkEmail=function(request,response)
{
    var email= request.param("email");
    var url=baseURL+"/SignUp?wsdl"
    var args = {email: email};
    soap.createClient(url,option, function(err, client)
    {
        client.checkEmail(args, function (err, result)
        {
            //console.log(result.checkEmailReturn);
            if(result.checkEmailReturn)
            {
                response.send({'statusCode' : 401});

            }
            else
            {
                response.send({'statusCode' : 200});
            }
        });
    });
}


exports.registerUser=function(request,response)
{
    var form1=JSON.parse(request.param("formdata"));
    var username=request.param("username");
    var firstName=form1.firstName;
    var lastName=form1.lastName
    var password= bcrypt.hashSync(form1.password);
    var contactNo=request.param("contactNo");
    var address=request.param("address");
    var birthdate=request.param("birthdate");
    var email= form1.email;
    var date = moment().format('YYYY-MM-DD H:mm:ss');
    var data=
    {
        username:request.param("username"),
        firstName:form1.firstName,
        lastName:form1.lastName,
        password:form1.password,
        contactNo:request.param("contactNo"),
        address:request.param("address"),
        birthdate:request.param("birthdate"),
        email: form1.email,
        lastloggin : moment().format('YYYY-MM-DD H:mm:ss')
    }
    console.log("Register:",data);
    data=JSON.stringify(data);
    var url=baseURL+"/SignUp?wsdl"
    var args = {userData: data};
    soap.createClient(url,option, function(err, client)
    {
        client.register(args, function (err, result)
        {
            //console.log(result.checkEmailReturn);
            if(result.registerReturn)
            {
                response.render('index', { title: "Account succesfully created, please sign in to continue" });

            }
            else
            {
                response.send({'statusCode' : 401});
            }
        });
    });


}

exports.signOut=function(request,response)
{
    request.session.destroy();
    response.render("index",{ title: 'Successfully signed out' });
}

