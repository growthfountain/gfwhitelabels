module.exports = Backbone.Router.extend({
  routes: {
    'formc/introduction/:id': 'introduction',
    'formc/team-members/:id/add/:type/:index': 'teamMemberAdd',
    'formc/team-members/:id': 'teamMembers',
    'formc/related-parties/:id': 'relatedParties',
    'formc/use-of-proceeds/:id': 'useOfProceeds',
    'formc/risk-factors/:id/market': 'riskFactorsMarket',
    'formc/risk-factors/:id/financial': 'riskFactorsFinancial',
    'formc/risk-factors/:id/operational': 'riskFactorsOperational',
    'formc/risk-factors/:id/competitive': 'riskFactorsCompetitive',
    'formc/risk-factors/:id/personnel': 'riskFactorsPersonnel',
    'formc/risk-factors/:id/legal': 'riskFactorsLegal',
    'formc/risk-factors/:id/misc': 'riskFactorsMisc',
    'formc/risk-factors/:id': 'riskFactors',
    'formc/financial-condition/:id': 'financialCondition',

  },
  introduction(id) {
    const View = require('components/formc/views.js');
    var i = new View.introduction({
      el: '#content',
      // fields: meta[0].actions.POST,
      // model: new Model.model(model[0][0] || {}),
      fields: {
        failed_to_comply: {
          label: "Failed to Comply",
          required: false,
          type: 'radio',
          validate: function(name, attrs, formData) {

          },
        },
        cc_number: {
          label: "Credit Card",
          required: true,
          type: 'string',
        }
      },
      model: new Backbone.Model({
        // failed_to_comply: 'It was the best of times.',
        id: id,
        failed_to_comply: '',
      }),
    });
    app.hideLoading();
    i.render();
  },
  
  teamMembers(id) {
    const View = require('components/formc/views.js');
    // var i = new View.memberDirector({
    var i = new View.teamMembers({
      el: '#content',
      fields: {},
      model: new Backbone.Model({
        id: id,
        members:[{"bio":"I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart. I am smart","first_name":"Arthur","last_name":"Yip","title":"CEO","photo":"https://s3.amazonaws.com/growthfountain-development/filer_public/c1/02/c102632a-b9d3-4ce3-b6ff-25758553e82d/3001585_121246046_2.jpg?v=60730","growup":"Brooklyn","linkedin":"https://arthuryip.xyz","state":"AR","college":"Memorial University of Newfoundland","facebook":"https://arthuryip.xyz","type":"member","email":"arthuryip723@gmail.com"},{"bio":"","first_name":"asdg","last_name":"","title":"","photo":"","growup":"","linkedin":"","state":"","college":"","facebook":"","type":"advisor","email":""}],
        // members:[],
      }),
    });
    i.render();
    app.hideLoading();
    $('#content').scrollTo();
  },

  teamMemberAdd(id, type, index) {
    const View = require('components/formc/views.js');

    const addForm = new View.teamMemberAdd({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      type: type,
      index: index,
      fields: {
        previous_positions: {},
        experiences: {},
      },
    });
    addForm.render();
    app.hideLoading();
  },

  relatedParties(id) {
    const View = require('components/formc/views.js');
    const i = new View.relatedParties({
      el: '#content',
      model: new Backbone.Model({
        id: id,
        had_transactions: 'yes'
      }),
      fields: {
        transactions: {},
      },

    });
    i.render();
    app.hideLoading();
  },

  useOfProceeds(id) {
    const View = require('components/formc/views.js');
    const i = new View.useOfProceeds({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactors(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactors({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsMarket(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsMarket({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsFinancial(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsFinancial({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsOperational(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsOperational({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsCompetitive(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsCompetitive({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsPersonnel(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsPersonnel({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsLegal(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsLegal({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  riskFactorsMisc(id) {
    const View = require('components/formc/views.js');
    const i = new View.riskFactorsMisc({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

  financialCondition(id) {
    const View = require('components/formc/views.js');
    const i = new View.financialCondition({
      el: '#content',
      model: new Backbone.Model({
        id: id,
      }),
      // fields: {},

    });
    i.render();
    app.hideLoading();
  },

});