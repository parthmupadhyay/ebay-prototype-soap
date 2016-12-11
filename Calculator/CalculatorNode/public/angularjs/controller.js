var cal = angular.module('calcApp', []);
cal.controller('calcController', ['$scope', '$http',function($scope, $http) {

    $scope.calculate = function(e){
        var op = e.target.getAttribute('data-value');
        console.log("In controller");

        $http({
            method : "GET",
            url : '/calculate',
            params : {
                val1 : $scope.val1,
                val2 : $scope.val2,
                op : op
            }
        }).success(function(result){
            if(result.status == 200){

                console.log(result.data);
                $scope.ans = result.data;
            }
            else{
                console.log(result.data);

                $scope.ans = "Enter Valid Values ";
            }
        });
    }

}]);
