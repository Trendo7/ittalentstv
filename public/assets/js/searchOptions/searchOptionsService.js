app.service('SearchOptionsService', function ($http) {

    //gets search suggestions
    this.showSearchSuggestions = function (searchWords) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/searchOptions/' + searchWords)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    }

});