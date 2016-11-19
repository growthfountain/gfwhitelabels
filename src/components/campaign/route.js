// Polyfill webpack require.ensure.
if (typeof require.ensure !== `function`) require.ensure = (d, c) => c(require);    

module.exports = Backbone.Router.extend({
  routes: {
    'api/campaign': 'list',
    'api/campaign/:id': 'detail',
    'api/campaign/:id/pdf': 'pdf',
    'api/campaign/:id/invest': 'investment',
  },

  pdf() {
    // add scripts

    let p = document.createElement("script");
    p.type = "text/javascript";
    p.src = "/js/pdfmake.js";
    $("head").append(p);
    debugger;

    let s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "/js/vfs_fonts.js";
    $("head").append(s);

    debugger;

    var docDefinition = { 
      Roboto: {
        normal: '/fonts/Roboto-Regular.ttf',
        bold: '/fonts/Roboto-Medium.ttf',
        italics: '/fonts/Roboto-Italic.ttf',
        bolditalics: '/fonts/Roboto-Italic.ttf'
      },
      content: 'This is an sample PDF printed with pdfMake' 
    };

    // open the PDF in a new window
    pdfMake.createPdf(docDefinition).open();

    // print the PDF (temporarily Chrome-only)
    pdfMake.createPdf(docDefinition).print();

    // download the PDF (temporarily Chrome-only)
    pdfMake.createPdf(docDefinition).download('optionalName.pdf');
  },

  list() {
    require.ensure([], () => {
      const Model = require('./models.js');
      const View = require('./views.js');
      const campaigns = new Model.collection();

      campaigns.fetch({
        success: (collection, response, options) => {

          $('body').scrollTo(); 
          $('#content').html('');
          new View.list({
            collection: collection,
          }).render();

          /*
          setTimeout(() => {
            app.cache[window.location.pathname] = i.$el.html();
          }, 500);

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
          if (response.responseJSON.detail == 'Invalid token.') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
          }
        },
      });

    });
  },

  detail(id) {
    require.ensure([], () => {
      const View = require('./views.js');

      api.makeCacheRequest(raiseCapitalUrl + "/" + id).
        then((modelData) => {
          let i = new View.detail({
            el: '#content',
            model: modelData,
          });
          i.render();
          if(location.hash && $(location.hash).length) {
              setTimeout(function(){$(location.hash).scrollTo(65);}, 100);
          } else {
              $('#content').scrollTo();
          }
          app.hideLoading();
      });
    })
  },

  investment(id) {
    require.ensure([], () => {
      if (!app.user.is_anonymous()) {
        const Model = require('./models.js');
        //const investModel = require('../investment/models.js');
        const View = require('./views.js');

        var a1 = api.makeCacheRequest(Urls['investment-list'](), 'OPTIONS');
        var a2 = api.makeCacheRequest(Urls['campaign-detail'](id));

        $.when(a1, a2).
          then((metaData, campaignModel) => {
            console.log(metaData, campaignModel);
            var i = new View.investment({
              el: '#content',
                campaignModel: new Model.model(campaignModel[0]),
                fields: metaData[0].actions.POST
            });
            i.render();
            //app.cache[window.location.pathname] = app.views.campaign[id].$el.html();
            $('#content').scrollTo();
            app.hideLoading();
          })
        } else {
          app.routers.navigate(
            '/account/login', {trigger: true, replace: true}
          );
        }
    });
  },
});
