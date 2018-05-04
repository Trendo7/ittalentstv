app.service('UserCheckService', function ($http) {
    //Check if selected user exists and provides user data
    this.checkUser = function (id) {
        return new Promise(function (resolve, reject) {
            $http.get('/api/userCheck/' + id)
                .then(function (response) {
                    resolve(response.data);
                })
                .catch(err => reject(err));
        });
    };

});