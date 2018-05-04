app.service('AccountService', function ($http) {

    this.getLoggedUser = function () {
        return new Promise(function (resolve, reject) {
            $http.get('/api/account')
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

    this.saveChanges = function (user) {
        return new Promise(function (resolve, reject) {
            $http.put('/api/account', user)
                .then(function (response) {
                    resolve(response.data);
                    localStorage.setItem('logged', JSON.stringify(response.data));
                })
                .catch(err => reject(err.data));
        });
    };

});