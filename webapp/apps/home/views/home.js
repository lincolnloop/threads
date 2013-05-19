define(['marionette'], function (Marionette) {

    var HomeView = Marionette.CollectionView.extend({

        initialize: function () {
            console.log('HomeView:initialize');
        }

    });

    return HomeView;

});
