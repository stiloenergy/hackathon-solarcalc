var solarApp = angular.module('solarcap-app', []);

solarApp.controller('SearchCtrl', [
  '$scope',
  function ($scope) {
    $scope.doSearch = function () {
      search($scope.address)
    }
  }
]);

solarApp.directive('radio', function ($timeout) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function ($scope, $element, $attributes, ngModel) {
      var value = $attributes.radio;

      $timeout(function () {
        if (ngModel.$modelValue == value) {
          $element.addClass('active');
        }
      });

      $element.on('click', function () {
        $('.btn-group .btn').each(function () {
          $(this).removeClass('active');
        });

        $element.addClass('active');

        if (ngModel) {
          $scope.$apply(function () {
            ngModel.$setViewValue(value);
          });
        }
      });
    }
  }
});



