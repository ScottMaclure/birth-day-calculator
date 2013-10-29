/*global angular*/
/*exported DatepickerCtrl, InfoCtl*/

// Declare our own module.
angular.module('birthDayCalculator', ['ui.bootstrap']);

// Services

// Simple service to pass around the dt selected by the user.
angular.module('birthDayCalculator').service('birthDayService', function () {

    var defaultOptions = {
        numberOfDaysToCalculate: 100
    };

    // Key point is to make data an object so Angular can monitor for changes (rather than primitives).
    var data = {
        dt: null,
        options: defaultOptions,
        info: {
            futureBirthDates: []
        }
    };

    /**
     * Work out future birth-days.
     * @param  {[type]} dt                      [description]
     * @param  {[type]} numberOfDaysToCalculate [description]
     * @return {[type]}                         [description]
     */
    function calculateDatesInAdvance (dt, numberOfDaysToCalculate) {

        var dates = [];

        if (!(dt instanceof Date)) {
            return dates;
        }

        for (var i = 1; i <= numberOfDaysToCalculate; i++) {
            dates.push(new Date(dt.getFullYear() + i, dt.getMonth(), dt.getDate()));
        }

        return dates;
    }

    // Return service object to caller
    // This is an API of sorts.
    return {

        getData: function () {
            return data;
        },

        setDt: function (newDt) {
            data.dt = newDt;
            this.updateInfo(newDt);
        },

        updateInfo: function (newDt) {
            data.info = {
                todo: 'testing: ' + ((typeof newDt === 'object' && newDt instanceof Date) ? 'Blah' : 'N/A'),
                futureBirthDates: calculateDatesInAdvance(newDt, data.options.numberOfDaysToCalculate)
            };
        }

    };

});

// Controllers

var DatepickerCtrl = function ($scope, $timeout, birthDayService) {

    // Link the controller data to the service data. Angular handles the rest.
    $scope.data = birthDayService.getData();

    $scope.dateOptions = {
        'year-format': '\'yy\'',
        'starting-day': 1
    };

    $scope.clear = function () {
        birthDayService.setDt(null);
    };

    $scope.today = function () {
        birthDayService.setDt(new Date());
    };

    // Open the datepicker
    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };

    // Watch for changes to primitive, and recalcuate by calling service.
    $scope.$watch('data.dt', function(newValue) {
        birthDayService.updateInfo(newValue);
    });

};

var InfoCtl = function ($scope, birthDayService) {
    $scope.data = birthDayService.getData();
};