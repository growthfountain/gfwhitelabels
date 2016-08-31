
let appRoutes = Backbone.Router.extend({
    routes: {
      '': 'mainPage',
      'api/campaign': 'campaignList',
      'api/campaign/:id': 'campaignDetail',
      'api/campaign/:id/invest': 'campaignInvestment',
    },
    back: function(event) {
        var url = event.target.pathname;
        $('#content').undelegate();
        $('form').undelegate();
        $('.popover').popover('hide')
        if(app.cache.hasOwnProperty(event.target.pathname) == false) {
            window.history.back();
            app.routers.navigate(
                event.target.pathname,
                {trigger: true, replace: false}
            );
        } else {
            $('#content').html(app.cache[event.target.pathname]);
            app.routers.navigate(
                event.target.pathname,
                {trigger: false, replace: false}
            );
        }
        app.hideLoading();
    },

    campaignList: function() {

        require.ensure(['models/campaign', 'views/campaign'], function(require) {
            let model = require('models/campaign');
            let view = require('views/campaign');

            app.collections.campaigns = new model.collection();
            app.collections.campaigns.fetch({
                success: (collection, response, options) => {

                    $('#content').html('');
                    app.views.campaigns = new view.list({
                        el: '#content',
                        collection: collection,
                    });
                    app.views.campaigns.render();

                    setTimeout(() => {
                        app.cache[window.location.pathname] = app.views.campaigns.$el.html();
                    }, 500);

                    /*
                    let filterView = new CampaignFilterView();
                    filterView.render();

                    $('#content').append(_.template($('#campaignListT').html())());

                    collection.forEach(function(model) {
                        let campaignView = new CampaignListView({
                            model: model,
                            template: campaignItemListT,
                        });
                        campaignView.render();
                    });
                    */
                    app.hideLoading();
                },
                error: (model, response, options) => {
                    // ToDo
                    // Move that check to global check
                    if(response.responseJSON.detail == 'Invalid token.') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.reload();
                    }
                },

            });
        });
    },

    campaignDetail: function(id) {
        require.ensure(['models/campaign', 'views/campaign'], function(require) {


        app.getModel('campaign', model.model, id, function(model) {
            app.views.campaign[id] = new view.detail({
                el: '#content',
                model: model,
            });
            app.views.campaign[id].render();
            //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
            $('#content').scrollTo();

            app.hideLoading();
        });
    },

    campaignInvestment: function(id) {
        if(!app.user.is_anonymous()) {
            let model = require('models/campaign');
            let investModel = require('models/investment');
            let view = require('views/campaign');

            app.getModel('campaign', model.model, id, function(campaignModel) {
                $.ajax(_.extend({
                        url: serverUrl + Urls['investment-list'](),
                }, app.defaultOptionsRequest)).done((response) => {
                    var i = new view.investment({
                        el: '#content',
                        model: new investModel.model(),
                        campaignModel: campaignModel,
                        fields: response.actions.POST
                    });
                    i.render();
                    //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
                    $('#content').scrollTo();

                    app.hideLoading();
                })
            });
        } else {
            app.routers.navigate(
                '/account/login',
                {trigger: true, replace: true}
            );
        }
    },
});
