/**
 * Created by Milen on 6.7.2017 г..
 */

var app = angular.module('OrderForm', []);

app.service('cart', function($http){
	var service = this;
	service.read = function(){
		return $http.get('/ajax/cart');
	};
	service.update = function(data){
		return $http.post('/ajax/cart', {
			cart: data
		});
	};
	service.init = function(){
		return $http.get('/ajax/cart/environment');
	};
	return service;
});
app.directive('validNumber', function () {
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			ngModelCtrl.$parsers.push(function (val) {
				var clean = val.replace(/[^0-9]+/g, '');
				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				//ngModelCtrl.$setValidity('invalid', clean !== '');
				ngModelCtrl.$validate();

				return clean;
			});
			element.bind('keypress', function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});
app.controller('OrderFormController', function($scope, cart, $http){
	$scope.loading = true;
	$scope.checkout = {comment: ''};
	cart.init().then(function(response){
		$scope.env = response.data;
		$scope.loading = false;
		$scope.stats = updateStats();
	});

	cart.read().then(function(response){
		$scope.cartData = response.data.cart && angular.isDefined(response.data.cart.billing) ? response.data.cart : { billing: {country: 'BG'}, delivery: {country: 'BG'}, products: {}, comment: ''};

		if( angular.isArray($scope.cartData.products) )
			$scope.cartData.products = {};
		//setTimeout(function(){if( angular.isDefined(PRINT_PAGE)) window.print()}, 1000);
	});

	$scope.$watch('cartData', function(){
		//console.log('change');
		if( !$scope.loading  ){
			var data = angular.copy($scope.cartData);
			for(i in data.products ){
				if( data.products[i] > 0 ){
				}else{
					delete data.products[i];
				}
			}
			cart.update(data).then(function(response){
				if( !response.data.success ){
					if( confirm(response.data.message) )
						location.reload();
					else
						location.reload();
				}
			});
		}

		$scope.stats = updateStats();
	}, true);

	$scope.getPrice = function(productId){
		var price = 0;
		if( angular.isDefined($scope.cartData) && angular.isDefined($scope.env) && angular.isDefined($scope.env.prices[productId])){
			var productPrice = $scope.env.prices[productId].price;
			for( key in $scope.cartData.products ){
				if( $scope.cartData.products.hasOwnProperty(key) && key.indexOf(productId + ';') === 0 ){
					price += $scope.cartData.products[key] * productPrice;
				}
			}
		}
		return (price).toFixed(2);
	};

	$scope.getSets = function(productId){
		var count = 0;
		if( !$scope.cartData ) return 0;
		for( key in $scope.cartData.products ){
			if( $scope.cartData.products.hasOwnProperty(key)  && key.indexOf(productId + ';') === 0 ){
				count += $scope.cartData.products[key] * 1;
			}
		}
		return count;
	};

	$scope.getHolds = function(productId){
		var count = $scope.getSets(productId);
		if( angular.isDefined($scope.env) && angular.isDefined($scope.env.prices[productId])) {
			count *= $scope.env.prices[productId].num_sub_items * 1;
		}
		return count;
	};

	$scope.getBoltStats = function( boltId ){
		var count = 0, productId;
		if( angular.isUndefined($scope.env) || !$scope.cartData )
			return count;

		for(key in $scope.cartData.products){
			if( !$scope.cartData.products.hasOwnProperty(key) ) continue;
			productId = key.split(';')[0];
			if( angular.isDefined( $scope.env.bolts[ productId ] ) && angular.isDefined($scope.env.bolts[productId][boltId]) ){
				count += $scope.cartData.products[key] * $scope.env.bolts[productId][boltId];
			}
		}
		return count;
	};
	$scope.clearCart = function(){
		$scope.cartData.products = {};
	};
	$scope.getTotal = function(){
		var price = 0;
		if( angular.isDefined($scope.env)){
			price = $scope.stats.total.total;
		}
		return (price).toFixed(2) ;
	};
	$scope.copyBilling = function(){
		var obj = angular.copy($scope.cartData.billing);
		delete obj.vat_number;
		angular.extend($scope.cartData.delivery, obj);
	};
	$scope.getDiscount = function(){
		if( angular.isDefined($scope.env) && $scope.env.discount > 0){
			return ($scope.getTotal() * (($scope.env.discount)/100)).toFixed(2);
		}else{
			return 0;
		}
	};

	function updateStats(){
		var stats = {
			holds: {
				sets: 0,
				pieces: 0,
				total: 0
			},
			closedcell: {
				sets: 0,
				pieces: 0,
				total: 0
			},
			plywood: {
				sets: 0,
				pieces: 0,
				total: 0
			},
			total: {
				sets: 0,
				pieces: 0,
				total: 0
			}
		}, productId, product, item;
		if( angular.isDefined($scope.env) && angular.isDefined($scope.cartData)) {
			for(key in $scope.cartData.products) {
				item = $scope.cartData.products[key];
				productId = key.split(';')[0];
				product = $scope.env.prices[productId];



				if( product.product_type === 'holds' ){
					coll = 'holds';
				}else{
					if( product.material * 1 === 34 ){
						coll = 'plywood';
					}else{
						coll = 'closedcell';
					}
				}

				if( !(coll === 'closedcell' && product.parent * 1 > 0) )
					stats[coll].sets += item * 1;
				stats[coll].pieces += parseInt(product.num_sub_items) * item;
				stats[coll].total += 1 * product.price * item;
				if( !(coll === 'closedcell' && product.parent * 1 > 0) )
					stats.total.sets += item * 1;
				stats.total.pieces += parseInt(product.num_sub_items) * item;
				stats.total.total += 1 * product.price * item;

			}
		}
		return stats;
	}

	$http.get('/countries.json').then(function(response){
		//console.log(response.data);
		//$scope.cartData.billing = {country: 'BG'};
		//$scope.cartData.delivery = {country: 'BG'};
		$scope.countries = response.data;
	});
	$scope.debug = function(){
		$scope.billingForm.$setSubmitted();
		$scope.deliveryForm.$setSubmitted();
		if( $scope.billingForm.$invalid || $scope.deliveryForm.$invalid || $scope.stats.total.pieces === 0 ) return;

		if( confirm('Are you sure you wish to complete your order.') ){
			var data = angular.merge({}, $scope.cartData);
			for(i in data.products ){
				if( data.products[i] > 0 ){
				}else{
					delete data.products[i];
				}
			}
			data.env = $scope.env;
			data.stats = updateStats();
			//console.info(data);
			$scope.loading = true;
			$http.post('/ajax/cart/checkout', data).then(function(response){
				if( response.data.success ){
					//data.delivery = {country: 'BG'};
					data.products = {};
					data.comment = '';
					delete data.env;
					delete data.stats;
					console.log(data.products);
					cart.update(data).then(function(){
						location.href = response.data.redirect;
					});
				}else{
					if( confirm(response.data.message) ){
						location.reload();
					}else{
						location.reload();
					}
				}
				//$scope.loading = false;
			});
		}


	}
});
