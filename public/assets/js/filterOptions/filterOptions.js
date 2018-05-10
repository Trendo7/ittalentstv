function filterOptions (scope) {
    scope.options = [
        {description: 'Most Popular', value: '-viewCount'},
        {description: 'Title', value: 'title'},
        {description: 'Likes', value: '-likedByUserIDs.length'},
        {description: 'Upload Date', value: '-uploadDate'}
    ];

    scope.sortSelect = '';
    scope.sortedBy = '';

    scope.changeOption = function(option){
        scope.sortedBy = option.description;
        scope.sortSelect = option.value;
    };
    
}