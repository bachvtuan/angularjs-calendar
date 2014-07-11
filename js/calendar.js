var calendarApp = angular.module('calendarApp',[]);

calendarApp.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

calendarApp.controller('calendarCtrl', ['$scope','$window',
  function($scope, $window) {
    $scope.cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // these are human-readable month name labels, in order
    $scope.cal_months_labels = ['January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August', 'September','October', 'November', 'December'];

    // these are the days of the week for each month, in order
    $scope.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    $scope.init = function(){
      $scope.cal_current_date = new Date(); 
      $scope.generateCalendar();      
    }

    $scope.doClickMonth = function( date_type ){

      if (date_type == "current_month")
        return;
      if (date_type == "previous_month")
        return $scope.setMonth(-1);
      else
        return $scope.setMonth(1);
    }

    $scope.getMonthLength = function( month, year ){
      var monthLength = $scope.cal_days_in_month[month];
      
      // compensate for leap year
      if (month == 1) { // February only!
        if((year % 4 == 0 && year % 100 != 0) || year % 400 == 0){
          monthLength = 29;
        }
      }
      return monthLength;
    }

    $scope.generateCalendar = function(){

      $scope.month = $scope.cal_current_date.getMonth();
      $scope.year  = $scope.cal_current_date.getFullYear();

      // get first day of month
      var firstDay = new Date($scope.year, $scope.month, 1);
      $scope.startingDay = firstDay.getDay();
      
      // find number of days in month
      $scope.monthLength = $scope.getMonthLength( $scope.month, $scope.year );

      //Get last month to get monthLength of last month
      $scope.last_month = angular.copy( $scope.cal_current_date );
      $scope.last_month.setMonth( $scope.last_month.getMonth() -1 );
    

      $scope.lastMonthLength = $scope.getMonthLength( $scope.last_month.getMonth(), $scope.last_month.getFullYear() );

      if ( $scope.startingDay > 0 ){
        $scope.start_day_last_month = $scope.lastMonthLength - $scope.startingDay  + 1;
        //$scope.start_day_last_month  can be 28,26,27,etc.
      }

      $scope.start_day_next_month = 1;
        
      $scope.calendar_result = [];

      var day = 1;
      //Loop weeks
      for ( var i =0; i < 6; i++ ){
        //it's all week contain days of next month
        if (  day > $scope.monthLength ){
          break;
        }

        $scope.calendar_result[i] = [];
        //Loop day in week
        for ( var j = 0; j < 7; j++  ){
          if ( i == 0 && j < $scope.startingDay ){
            $scope.calendar_result[i].push({type:'previous_month',day:$scope.start_day_last_month++});
          }
          else if ( day <= $scope.monthLength ){
            $scope.calendar_result[i].push({type:'current_month',day:day++});
          }
          else{
           $scope.calendar_result[i].push({type:'next_month',day:$scope.start_day_next_month++}); 
          }
        }
      }
      $scope.monthName = $scope.cal_months_labels[$scope.month];
    }

    //Can jump to previous or next month, depend on the value
    $scope.setMonth = function(value){
      $scope.cal_current_date.setMonth( $scope.cal_current_date.getMonth() + value  );
      
      $scope.generateCalendar();
    }

  }
]);
