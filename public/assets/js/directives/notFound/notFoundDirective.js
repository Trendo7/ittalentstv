app.directive('notFound', function () {
    return {
        templateUrl: 'assets/js/directives/notFound/notFoundTemplate.htm',
        restrict: 'E',
        scope: {
            info: '=',
            show: '&'
        }
    };
});