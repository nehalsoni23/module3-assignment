(function(){
'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  function FoundItems(){
    var ddo = {
      templateUrl: 'itemsloaderindicator.template.html',
      scope: {
        foundItem : '<',
        onRemove: '&'
      }
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService){

    var narrow = this;

    narrow.searchTerm = '';

    narrow.narrowItDown = function() {
      narrow.errorMessage = '';
      narrow.foundItems = [];
      var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

      promise.then(function(response){
          narrow.foundItems = response;
      }).then(function(error){
        if(narrow.searchTerm == '' || narrow.foundItems.length <= 0){
            narrow.errorMessage = "Nothing found";
        }
      });
    };

    narrow.removeItem = function (index) {
      MenuSearchService.removeUnwantedItem(index);
    }
  };

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http){

    var service = this;

    var foundItems = [];

    service.getMatchedMenuItems = function(searchTerm){
      return $http({
        method : 'GET',
        url : 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then(function(result){
        if(searchTerm) {
          var found = [];
          angular.forEach(result.data.menu_items, function(value, key){
              if(value.description.toLowerCase().indexOf(searchTerm) !== -1){
                found.push(value);
              }
          });
          foundItems = found;
          return foundItems;
        }
      });
    };

    service.removeUnwantedItem = function (index) {
      foundItems.splice(index, 1);
    };
  }
})();
