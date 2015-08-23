define('views/setupWizard',[
    'services/log',
    'services/ng-stages',
    'services/ng-settings',
    'angular'
],function(log) {
    var moduleName = 'setupWizard';
    return angular.module(moduleName,[]).controller(moduleName+'Ctrl',[
        '$scope', '$stages', '$settings', '$filter',
        function($scope, $stages, $settings, $filter) {
            log('init wizard ctrl');
            $scope.log = log.get();
			$scope.tab = 1;
			console.log($settings);

			$scope.showNext = function(tab){
				return ( 1 < tab && tab < 7);
			};
			
			$scope.showPrev = function(tab){
				return ( 2 < tab && tab < 7);
			};
			
			// Tournament Settings retrieve and save functions
			$settings.init().then(function(res) {
                $scope.settings = res;
				
				/* $scope.settings.event = {
					date: $filter("date")(Date.now(), 'yyyy-MM-dd')
				};*/
            });

            $scope.save = function() {
                return $settings.save();
            };

            
        }
    ]);
});
