var app = angular.module('lazy-testing', []);
app.controller('lazy-testing-controller', function ($scope, $http) {
    $scope.data = [];
    $scope.members = [];
    $scope.pdfUrl = '/api/pdf';
    $scope.loadData = function () {
        $http.get('/api/current')
            .then(function (response) {
                    //success
                    $scope.data = response.data.tests;
                    $scope.members = response.data.members;
                },
            function (response) {
                // error
                alert('AN ERROR! Damn you. I order you to go fix whatever you broke...');
            });
    };
    $scope.loadData();
    
    $scope.autoAssign = function () {
        if (!confirm("Are you sure? This action is irreversable and everyone will hate you for it.")) {
            return;
        }
        $http.get('/api/autoassign')
                    .then(function (response) {
            $scope.loadData();
        },
                    function (response) {
            // error
            alert('AN ERROR! Damn you. I order you to go fix whatever you broke...');
        });
    };
    
    $scope.reset = function () {
        if (!confirm("Are you sure? This action is irreversable and everyone will hate you for it.")) {
            return;
        }
        $http.get('/api/reset')
                    .then(function (response) {
            $scope.loadData();
        },
                    function (response) {
            // error
            alert('AN ERROR! Damn you. I order you to go fix whatever you broke...');
        });
    };
    
    $scope.toggle = function (element) {
        if (!$scope[element]) {
            $scope[element] = true;
        } else {
            $scope[element] = !$scope[element];
        }
    };
    
    $scope.get = function (element) {
        return $scope[element] === true;
    };
    
    $scope.save = function (parentIndex, index) {
        var response = {
            feature: parentIndex,
            scenario: index,
            tester: $scope.data[parentIndex].scenarios[index].tester,
            passing: $scope.data[parentIndex].scenarios[index].passing,
            comment: $scope.data[parentIndex].scenarios[index].comment
        };
        
        $http.post('/api/current', response)
                    .then(function (response) {
            //done
            $scope.loadData();
        },
                    function (response) {
            // error
            alert('AN ERROR! Damn you. I order you to go fix whatever you broke...');
        });
    };
    
    $scope.updatePdf = function () {
        $scope.pdfUrl = '/api/pdf' + "?whyNoIframeReload=" + (new Date()).getTime();
    };
    
    $scope.boolToStr = function (item) {
        return item ? 'Yes' : 'No';
    };
    
    $scope.loadNew = function () {
        if (!confirm("Are you sure? This action is irreversable and everyone will hate you for it.")) {
            return;
        }
        $http.get('/api/update')
					.then(function (response) {
            //done
            $scope.loadData();
        },
                    function (response) {
            // error
            alert('AN ERROR! Damn you. I order you to go fix whatever you broke...');
        });
    };
    
    $scope.format = function (data) {
        return data.replace(/\n/g, '<br />');
    };
});

app.filter('html', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});