angular.module('ResultsManagerApp', ['ui.bootstrap']);
var PaginationDemoCtrl = function($scope) {
   
    $scope.viewby = 10;
    $scope.totalItems = $scope.data.length;
    $scope.currentPage = 4;
    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5; //Number of pager buttons to show

    $scope.setPage = function(pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.setItemsPerPage = function(num) {
        $scope.itemsPerPage = num;
        $scope.currentPage = 1; //reset to first paghe
    }
};