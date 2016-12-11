var soap = require('soap');
var base = "http://localhost:8080/Calculator/services/";
var response = require('./responseGenerator');

exports.calculate = function(req,res){
	var option = {
			ignoredNamespaces : true	
		};
	 var url = base+"Operation?wsdl";
	 var value1= req.param('val1');
    var value2= req.param('val2');


	  var args = {v1:value1,v2: value2};
	  try{
	  soap.createClient(url,option, function(err, client) {

          var operation = req.param('op');
          console.log("Operation= " + operation);
          if (!isNaN(value1) && !isNaN(value2)) {

              switch (operation) {
                  case 'add':
                      client.add(args, function (err, result) {
                          if (err) {
                              res.send(response.responseGenerator(400, null));
                          }
                          if (result) {
                              console.log(result);

                              res.send(response.responseGenerator(200, result.addReturn));
                          }
                      });
                      break;

                  case 'sub':
                      client.sub(args, function (err, result) {
                          if (err) {
                              res.send(response.responseGenerator(400, null));
                          }
                          if (result) {
                              console.log(result);

                              res.send(response.responseGenerator(200, result.subReturn));
                          }
                      });
                      break;

                  case 'mul':
                      client.mul(args, function (err, result) {
                          if (err) {
                              res.send(response.responseGenerator(400, null));
                          }
                          if (result) {
                              console.log(result);

                              res.send(response.responseGenerator(200, result.mulReturn));
                          }
                      });
                      break;

                  case 'div':
                      if (req.param('val2') == 0) {

                          console.log("Divide By Zero");

                          res.send(response.responseGenerator(200, "INFINITY"));

                      }
                      else {
                          client.div(args, function (err, result) {
                              if (err) {
                                  res.send(response.responseGenerator(400, null));
                              }
                              if (result) {
                                  console.log(result);

                                  res.send(response.responseGenerator(200, result.divReturn));
                              }
                          });
                          break;
                      }
              }
          }else{

              res.send(response.responseGenerator(200, "Enter Both The Number Values"));

          }
      }

      );}catch(Exception){
	  	console.log("Divide By Zero");
	  }


};

exports.index = function(req, res){
  res.render('index', { title: 'Calculator'});
};
