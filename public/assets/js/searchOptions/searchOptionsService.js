app.service('SearchOptionsService', function ($http) {

    //gets search suggestions
    this.showSearchSuggestions = function (searchWords) {
        return new Promise(function (resolve, reject) {
            $http.get('http://localhost:3000/searchOptions/' + searchWords)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    }

});