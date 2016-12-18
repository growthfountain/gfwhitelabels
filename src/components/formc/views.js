'use strict';

const formcHelpers = require('./helpers.js');
const formatHelper = require('../../helpers/formatHelper');

const menuHelper = require('helpers/menuHelper.js');
const addSectionHelper = require('helpers/addSectionHelper.js');
const yesNoHelper = require('helpers/yesNoHelper.js');

const dropzoneHelpers = require('helpers/dropzoneHelpers.js');
const riskFactorsHelper = require('helpers/riskFactorsHelper.js');
const validation = require('components/validation/validation.js');

const disableEnterHelper = require('helpers/disableEnterHelper.js');

const leavingConfirmationHelper = require('helpers/leavingConfirmationHelper.js');

const labels = {
  title: 'Title for Risk',
  risk: 'Describe Your Risk',
  market_and_customer_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  financial_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  operational_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  competitive_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  personnel_and_third_parties_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  legal_and_regulatory_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
  miscellaneous_risk: {
    title: 'Title for Risk',
    risk: 'Describe Your Risk',
  },
};

const submitFormc = function submitFormc(e) {
  e.preventDefault();
  let progress = formcHelpers.formcCalcProgress(this.model);

  if(
      progress.introduction == true &&
      progress["team-members"] == true &&
      progress["related-parties"] == true &&
      progress["use-of-proceeds"] == true &&
      progress["risk-factors-market"] == true &&
      progress["risk-factors-financial"] == true &&
      progress["risk-factors-operational"] == true &&
      progress["risk-factors-competitive"] == true &&
      progress["risk-factors-personnel"] == true &&
      progress["risk-factors-legal"] == true &&
      progress["risk-factors-misc"] == true &&
      progress["financial-condition"] == true &&
      progress["outstanding-security"] == true &&
      progress["background-check"] == true
  ) {
    $('#formc_publish_confirm').modal('show');
  } else {
    let errors = {};
    _(progress).each((d, k) => {
      if(k != 'perks') {
        if(d == false)  {
          $('#formc_publish .'+k).removeClass('collapse');
        } else {
          $('#formc_publish .'+k).addClass('collapse');
        }
      }
    });
    $('#formc_publish').modal('toggle');
  }
};

module.exports = {
  introduction: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/introduction',

    events: _.extend({
      'submit form': 'submit',
      'click .submit_formc': submitFormc,
      'keyup #full-name': 'changeSign',
      'click #pay-btn': 'stripeSubmit',
    }, menuHelper.events, yesNoHelper.events, /*leavingConfirmationHelper.events*/),

    preinitialize() {
      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;

      if(this.model.is_paid === false) {
        this.fields.full_name = { 
          required: true 
        };
      }
    },

    render() {
      let template = require('./templates/introduction.pug');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          fullName: app.user.get('first_name') + ' ' + app.user.get('last_name'),
        })
      );

      let eSignForm = this.$('.electronically-sign');
      this.eSignCompanyName = eSignForm.find('#company-name');
      this.eSignFullName = eSignForm.find('#full-name');
      this.eSignPreview = eSignForm.find('.electronically .name');

      return this;
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/team-members';
    },

    stripeSubmit(e) {
      e.preventDefault();

      let $stripeForm = $('.payment-block');

      function validateCard(form, selectors) {

        let number = form.find('#' + selectors.number);
        let expMonth = form.find('#' + selectors.expMonth);
        let expYear = form.find('#' + selectors.expYear);
        let cvc = form.find('#' + selectors.cvc);
        let error = 0;

        $('.help-block').remove();
        if (!Stripe.card.validateCardNumber(number.val())) {
          validation.invalidMsg({ $: $, $el: $('#content') }, selectors.number, ['Please, check card number.']);
          error = 1;
        }

        if (!Stripe.card.validateExpiry(expMonth.val(), expYear.val())) {
          validation.invalidMsg({ $: $, $el: $('#content') }, selectors.expDate, ['Please, check expiration date.']);
          error = 1;
        }

        if (!Stripe.card.validateCVC(cvc.val())) {
          validation.invalidMsg({ $: $, $el: $('#content') }, selectors.cvc, ['Please, check CVC.']);
          error = 1;
        }

        if(error == 1) {
          return null;
        }

        return {
          number: number.val(),
          cvc: cvc.val(),
          exp_month: expMonth.val(),
          exp_year: expYear.val(),
        };
      };

      let $payBtn = $(e.target);
      $payBtn.prop('disabled', true);

      var card = validateCard($stripeForm,
        { number: 'card_number',
          expDate: 'card_exp_date_year__year',
          expMonth: 'card_exp_month__month',
          expYear: 'card_exp_date_year__year',
          cvc: 'card_cvc',
        });

      if (!card) {
        $payBtn.prop('disabled', false);
        return;
      }

      if (!this.eSignFullName.val().trim()) {
        validation.invalidMsg({ $: $ }, 'full-name', ['Check your name']);
        $payBtn.prop('disabled', false);
        return;
      }

      app.showLoading();

      Stripe.setPublishableKey(stripeKey);

      Stripe.card.createToken(card, (status, stripeResponse) => {
        if (stripeResponse.error) {
          validation.invalidMsg({ $: $ }, 'form-section', [stripeResponse.error.message]);
          $payBtn.prop('disabled', false); // Re-enable submission
          $('#certify').scrollTo(20);
          app.hideLoading();
          return;
        }

        api.makeRequest(formcServer + '/' + this.model.id + '/stripe', "PUT", {
          stripeToken: stripeResponse.id
        }).done((formcResponse, statusText, xhr) => {
          if (xhr.status !== 200) {
            validation.invalidMsg({'$': $}, "expiration-block",
              [formcResponse.description || 'Some error message should be here']);

            $payBtn.prop('disabled', false);
            app.hideLoading();
            return;
          }

          //todo; sign data, make request to server
          // let signData = {
          //   type: 'POST',
          //   'company_name': this.eSignCompanyName.val(),
          //   'full_name': this.eSignFullName.val(),
          // };
          //
          // if (this.model.is_paid == false) {
          //   signData.company_name = this.eSignCompanyName.val();
          //   signData.full_name = this.eSignFullName.val();
          // }



          this.model.is_paid = true;
          delete this.fields.full_name;

          $stripeForm.remove();

          this.$('#save-button-block').removeClass('collapse');

          app.hideLoading();

        }).fail((xhr, ajaxOptions, err) => {
          validation.invalidMsg({'$': $}, "expiration-block",
            [xhr.responseJSON.non_field_errors || 'An error occurred, please, try again later.']);

          $payBtn.prop('disabled', false);
          app.hideLoading();
        });

        return false;
      });
    },

    submit(e) {
      e.preventDefault();

      let $target = $(e.target);
      let $submitBtn = $target.find('#pay-btn');
      $submitBtn.prop('disabled', true);

      var data = $target.serializeJSON({ checkboxUncheckedValue: 'false', useIntKeysAsArrayIndex: true });

      // ToDo
      // Fix this
      if (data.failed_to_comply_choice == false) {
        data.failed_to_comply = 'Please explain.';
      }

      api.submitAction.call(this, e, data);

      return false;
    },

    changeSign() {
      this.eSignPreview.text(this.eSignFullName.val());
    },

  }, menuHelper.methods, yesNoHelper.methods, leavingConfirmationHelper.methods)),

  teamMembers: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/team-members',
    events: _.extend({
      'click #submitForm': api.submitAction,
      'click .inviteAction': 'repeatInvitation',
      'blur #full_time_employers,#part_time_employers': 'updateEmployees',
      'click .submit_formc': submitFormc,
      'click .delete-member': 'deleteMember',
    }, menuHelper.events, leavingConfirmationHelper.events),

    preinitialize() {

      // ToDo
      // Hack for undelegate previous events
      for (let k in this.events) {
        $('#content ' + k.split(' ')[1]).undelegate();
      }
    },

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.full_time_employers = { label: 'Full Time Employees' };
      this.fields.part_time_employers = { label: 'Part Time Employees' };
      console.log(this);
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl(data) {
      return '/formc/' + this.model.id + '/related-parties';
    },

    deleteMember: function (e) {
      e.preventDefault();
      let userId = e.currentTarget.dataset.id;

      if (confirm('Are you sure you would like to delete this team member?')) {
        api.makeRequest(
          this.urlRoot.replace(':id', this.model.id) + '/delete',
          'PUT',
          {'user_id': userId}
        ).
        then((data) => {
          let index = this.model.team_members.findIndex((el) => { return el.user_id == userId });
          this.model.team_members.splice(index, 1);
          e.currentTarget.parentElement.parentElement.remove()
          /*
           * ToDo
           * Create right notification error
           *
          if (this.model.team_members.length < 1) {
            this.$el.find('.notification').show();
            this.$el.find('.buttons-row').hide();
          } else {
            this.$el.find('.notification').hide();
            this.$el.find('.buttons-row').show();
          }
          */
        });
      }
    },

    updateEmployees(e) {
      e.preventDefault();
      api.makeRequest(
        this.urlRoot.replace(':id', this.model.id),
        'PUT',
        {
          'full_time_employers': this.el.querySelector('#full_time_employers').value,
          'part_time_employers': this.el.querySelector('#part_time_employers').value,
        }
      );
    },

    repeatInvitation(e) {
      e.preventDefault();
      api.makeRequest(
        formcServer + '/invitation/repeat',
        'PUT',
        {'user_id': e.target.dataset.id}
      ).then((data) => {
        e.target.innerHTML = 'sent';
        e.target.className = 'link-3 invite';
      });
    },

    render() {
      let template = require('./templates/teamMembers.pug');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          roles: ['Shareholder', 'Director', 'Officer'],
          titles: [
            '',
            'CEO/President',
            'Principal Financial Officer/Treasurer',
            'Vice President',
            'Secretary',
            'Controller/Principal Accounting Officer',
          ],
        })
      );
      disableEnterHelper.disableEnter.call(this);
      return this;
    },

  }, menuHelper.methods, addSectionHelper.methods, leavingConfirmationHelper.methods)),

  teamMemberAdd: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/team-members',
    doNotExtendModel: true,
    roles: ['shareholder', 'director', 'officer'],
    events: _.extend({
      'click #submitForm': api.submitAction,
      'click .submit_formc': submitFormc,
    }, addSectionHelper.events, menuHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      if(options.user_id != 'new') {
        let t = options.formc.team_members.filter(function(el) { return el.user_id == options.user_id})[0]
        t.formc_id = options.formc.id;
        t.campaign_id = options.formc.campaign_id;
        t.company_id = options.formc.company_id;
        t.progress = options.formc.progress;
        delete t.id;
        this.model = t;
      } else {
        this.model = {
          formc_id: options.formc.id,
          campaign_id: options.formc.campaign_id,
          company_id: options.formc.company_id,
          progress: options.formc.progress
        };
      }
      this.fields = options.fields;
      this.role = options.role;

      this.labels = {
        first_name: 'First name',
        last_name: 'Last name',
        email: 'Email',
        dob: 'Date of birth',
        principal_occupation: 'Principal Occupation and Name of Employer',
        employer_principal_businesss: "Employer's Principal Business",
        responsibilities: 'Title',
        number_of_shares: 'Number of Shares',
        class_of_securities: 'Class of Securities',
        voting_power_percent: '% of Voting Power Prior to Offering',
        experiences: {
          employer: 'Employer',
          employer_principal: 'Employer Principal',
          title: 'Employer\'s Principal Business',
          responsibilities: 'Title and Responsibilities',
          start_date_of_service: 'Start Date of Service',
          end_date_of_service: 'End Date of Service',
        },
        positions: {
          position: 'Position',
          start_date_of_service: 'Start Date of Service',
          end_date_of_service: 'End Date of Service',
        },
      };
      this.assignLabels();

      this.createIndexes();
      this.buildJsonTemplates('formc');
    },

    render() {
      let template = null;

      this.urlRoot = this.urlRoot.replace(':id', this.model.formc_id);
      if(this.model.hasOwnProperty('user_id')  && this.model.user_id != '') {
        this.model.id = this.model.formc_id;
        this.urlRoot += '/' + this.role + '/' + this.model.user_id;
      } else {
        this.urlRoot += '/' + this.role;
        this.model.title = [];
      }

      if (this.role == 'director') {
        template = require('components/formc/templates/teamMembersDirector.pug');
        this.buildJsonTemplates('formc');
      } else if (this.role == 'officer') {
        template = require('components/formc/templates/teamMembersOfficer.pug');
        this.buildJsonTemplates('formc');
      } else if (this.role == 'shareholder') {
        template = require('components/formc/templates/teamMembersShareHolder.pug');
      }

      require('bootstrap-select/sass/bootstrap-select.scss');
      let selectPicker = require('bootstrap-select');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      this.$el.find('.selectpicker').selectpicker();
      disableEnterHelper.disableEnter.call(this);
      return this;
    },

    _success(data, newData) {
      window.location = '/formc/' + this.model.formc_id + '/team-members';
      /*
      this.model.team_members.push(newData);
      this.undelegateEvents();
      app.routers.navigate(
        '/formc/' + this.model.id + '/team-members',
        { trigger: true, replace: false }
      );
      //return '/campaign/' + this.model.id + '/team-members';
      */
    },

  }, addSectionHelper.methods, menuHelper.methods, leavingConfirmationHelper.methods)),

  relatedParties: Backbone.View.extend(_.extend({
    el: '#content',
    urlRoot: formcServer + '/:id' + '/related-parties',

    events: _.extend({
      'submit form': 'submit',
      'click .submit_formc': submitFormc,
    }, addSectionHelper.events, menuHelper.events, yesNoHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;

      this.labels = {
        transaction_with_related_parties: {
          amount_of_interest: 'Amount of Interest',
          nature_of_interest: 'Nature of Interest in Transaction',
          relationship_to_issuer: 'Relationship to Issuer',
          specified_person: 'Specified Person',
        },
      };
      this.assignLabels();

      this.createIndexes();
      this.buildJsonTemplates('formc');
    },

    submit(e) {
      e.preventDefault();
      let data = $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });

      if (data.transaction_with_related_parties_choice == false) {
        data.transaction_with_related_parties = this.model.transaction_with_related_parties;
      }

      api.submitAction.call(this, e, data);
    },

    render() {
      let template = require('./templates/relatedParties.pug');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      disableEnterHelper.disableEnter.call(this);
      return this;
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl(data) {
      return '/formc/' + this.model.id + '/use-of-proceeds';
    },
  }, addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods, leavingConfirmationHelper.methods)),

  useOfProceeds: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/use-of-proceeds',

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.campaign = options.campaign;

      // this.fields.custom_fn = {fn: (function (value, fn, attr, model, computed) {
      this.fields.use_of_net_proceeds.fn = (function (value, fn, attr, model, computed) {
        if (!this.calculate(null)) throw 'Total Use of Net Proceeds must be equal to Net Proceeds.';
      }).bind(this);

      this.labels = {
        describe: 'Describe your business plan',
        business_plan: 'Please upload your business plan',
        business_plan_file_id: 'Please upload your business plan',
        less_offering_express: {},
        use_of_net_proceeds: {},
      };

      let defaultRows = {
        less_offering_express: ['Commissions and Broker Expenses', 'Misc. Offering Costs (Legal)', 'Misc. Offering Costs (Marketing)', 'Misc. Offering Costs (Admin)'],
        use_of_net_proceeds: ['Salaries, Benefits and Wages', 'Product Development', 'Marketing', 'Operations (Data, Hosting, Fees)', 'Travel, Conferences and Events'],
      };

      for (let key in defaultRows) {
        if (this.model[key].length > 0) continue;
        let titles = defaultRows[key];
        for (let i = 0; i < titles.length; i++) {
          this.model[key].push({max: 0, min: 0, title: titles[i]});
        }
      }
      this.assignLabels();
      this.createIndexes();
      this.buildJsonTemplates('formc');
    },

    events: _.extend({
      'submit form': 'submit',
      'click .submit_formc': submitFormc,
      'change input[type=radio][name=doc_type]': 'changeDocType',
      // 'change .min-expense,.max-expense,.min-use,.max-use': 'calculate',
      'blur .min-expense,.max-expense,.min-use,.max-use': 'calculate',
      'click .add-sectionnew': 'addSectionNew',
      'click .delete-sectionnew': 'deleteRow',
    }, menuHelper.events, dropzoneHelpers.events, leavingConfirmationHelper.events),

    deleteRow(e) {
      this.deleteSectionNew(e);
      this.calculate(null);
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/risk-factors-instruction';
    },

    _getSum(selector) {
        let values = this.$(selector).map(function (e) {
          let result = parseInt($(this).val() ? $(this).val().replace(/[\$\,]/g, '') : 0);
          return result ? result : 0;
        }).toArray();
        if (values.length == 0) values.push(0);
        return values.reduce(function (total, num) { return total + num; });
    },

    calculate(e, warning=true) {
      if (e) {
        let $target = $(e.target);
        // $target.val(formatHelper.formatNumber($target.val()));
      }
      let minRaise = this.campaign.minimum_raise;
      let maxRaise = this.campaign.maximum_raise;

      let minNetProceeds = minRaise - this._getSum('.min-expense');
      let maxNetProceeds = maxRaise - this._getSum('.max-expense');

      this.$('.min-net-proceeds').text('$' + formatHelper.formatNumber(minNetProceeds));
      this.$('.max-net-proceeds').text('$' + formatHelper.formatNumber(maxNetProceeds));

      let minTotalUse = this._getSum('.min-use');
      let maxTotalUse = this._getSum('.max-use');

      this.$('.min-total-use').text('$' + formatHelper.formatNumber(minTotalUse));
      this.$('.max-total-use').text('$' + formatHelper.formatNumber(maxTotalUse));

      // return true if the table is valid in terms of the calculation, else return false
      let minEqual = minNetProceeds == minTotalUse;
      let maxEqual = maxNetProceeds == maxTotalUse
      let result = minEqual && maxEqual;
      if (warning) {
        if (minEqual) {
          $('.min-net-proceeds,.min-total-use').removeClass('red');
        } else {
          $('.min-net-proceeds,.min-total-use').addClass('red');
        }

        if (maxEqual) {
          $('.max-net-proceeds,.max-total-use').removeClass('red');
        } else {
          $('.max-net-proceeds,.max-total-use').addClass('red');
        }
        this.$('.max-total-use').popover(result ? 'hide' : 'show');
      }
      return result;
    },

    changeDocType(e) {
      if (e.target.value == 'describe') {
        this.$('.describe').show();
        this.$('.doc').hide();
      } else if (e.target.value == 'doc') {
        this.$('.describe').hide();
        this.$('.doc').show();
      }
    },

    submit(e) {
      var $target = $(e.target);
      var data = $target.serializeJSON({ useIntKeysAsArrayIndex: true });
      data.use_of_net_proceeds.forEach(function (elem) {
        elem.min = elem.min.replace(/,/g, '');
        elem.max = elem.max.replace(/,/g, '');
      });
      data.less_offering_express.forEach(function (elem) {
        elem.min = elem.min.replace(/,/g, '');
        elem.max = elem.max.replace(/,/g, '');
      });
      api.submitAction.call(this, e, data);
    },

    render() {
      let template = require('./templates/useOfProceeds.pug');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
          maxRaise: this.campaign.maximum_raise,
          minRaise: this.campaign.minimum_raise,
          formatHelper: formatHelper,
          campaignId: this.campaign.id,
        })
      );
      this.$('.max-total-use').popover({
        html: true,
        template: '<div class="popover" role="tooltip" style="border-color:red;"><div class="popover-arrow" style="border-right-color:red;"></div><h3 class="popover-title"></h3><div class="popover-content" style="color:red;"></div></div>'
      });

      this.$('.min-expense,.max-expense,.min-use,.max-use').each(function (idx, elem) {
        let $this = $(this);
        $this.val(formatHelper.formatNumber($this.val()));
      });

      this.calculate(null, false);
      setTimeout(() => { this.createDropzones() } , 1000);
      disableEnterHelper.disableEnter.call(this);
      return this;
    }, 
  }, menuHelper.methods, dropzoneHelpers.methods, addSectionHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsInstruction: Backbone.View.extend(_.extend({
    initialize(options) {
      this.model = options.formc;
    },

    events: _.extend({
      'submit form': 'submit',
      'click .submit_formc': submitFormc,
    }, menuHelper.events),

    submit: api.submitAction,

    render() {
      const template = require('components/formc/templates/riskFactorsInstructions.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          campaignId: this.model.campaign_id,
          values: this.model,
        })
      );
      return this;
    },
  }, menuHelper.methods)),

  riskFactorsMarket: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-market/:index',
    riskType: 'market_and_customer_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'There is a limited market for the Company’s product or services',
          risk: 'Although we have identified what we believe to be a need in the market ' +
                'for our products and services, there can be no assurance that ' +
                'demand or a market will develop or that we will be able to create a viable ' +
                'business. Our future financial performance will depend, at least in part, upon ' +
                'the introduction and market acceptance of our products and services. ' +
                'Potential customers may be unwilling to accept, utilize or recommend any of our ' +
                'proposed products or services. If we are unable to commercialize and market ' +
                'such products or services when planned, we may not achieve any market ' +
                'acceptance or generate revenue.',
        },
        1: {
          title: 'We must correctly predict, identify, and interpret changes in consumer ' +
                  'preferences and demand, offer new products to meet those changes, and ' +
                  'respond to competitive innovation.',
          risk: 'Our success depends on our ability to predict, identify, and interpret the ' +
                'tastes and habits of consumers and to offer products that appeal to consumer ' +
                'preferences. If we do not offer products that appeal to consumers, our sales ' +
                'and market share will decrease. If we do not accurately predict which shifts in ' +
                'consumer preferences will be long-term, or if we fail to introduce new and ' +
                'improved products to satisfy those preferences, our sales could decline. ' +
                'If we fail to expand our product offerings successfully across product ' +
                'categories, or if we do not rapidly develop products in faster growing and ' +
                'more profitable categories, demand for our products could decrease, which ' +
                'could materially and adversely affect our product sales, financial condition, ' +
                'and results of operations.',
        },
        2: {
          title: 'We may be adversely affected by cyclicality, volatility or an extended ' +
                  'downturn in the United States or worldwide economy, or in the industries ' +
                  'we serve.',
          risk: 'Our operating results, business and financial condition could be significantly ' +
                'harmed by an extended economic downturn or future downturns, especially in ' +
                'regions or industries where our operations are heavily concentrated. Further, ' +
                'we may face increased pricing pressures during such periods as customers ' +
                'seek to use lower cost or fee services, which may adversely affect our ' +
                'financial condition and results of operations.',
        },
        3: {
          title: 'Failure to obtain new clients or renew client contracts on favorable terms ' +
                  'could adversely affect results of operations.',
          risk: 'We may face pricing pressure in obtaining and retaining our clients.  ' +
                'On some occasions, this pricing pressure may result in lower revenue from ' +
                'a client than we had anticipated based on our previous agreement with ' +
                'that client. This reduction in revenue could result in an adverse effect on ' +
                'our business and results of operations. Further, failure to renew client ' +
                'contracts on favorable terms could have an adverse effect on our business. ' +
                'If we are not successful in achieving a high rate of contract renewals on ' +
                'favorable terms, our business and results of operations could be adversely ' +
                'affected.',
        },
        4: {
          title: 'Our business and results of operations may be adversely affected if we are ' +
                  'unable to maintain our customer experience or provide high quality customer ' +
                  'service.',
          risk: 'The success of our business largely depends on our ability to provide superior ' +
                'customer experience and high quality customer service, which in turn depends ' +
                'on a variety of factors, such as our ability to continue to provide a reliable ' +
                'and user-friendly website interface for our customers to browse and purchase ' +
                'our products, reliable and timely delivery of our products, and superior after ' +
                'sales services. If our customers are not satisfied, our reputation and ' +
                'customer loyalty could be negatively affected.',
        },
      };
      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsMarket.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsFinancial: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-financial/:index',
    riskType: 'financial_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'The amount of capital the Company is attempting to raise in the Offering ' +
                'is not enough to sustain the Company\'s current business plan.',
          risk: 'In order to achieve the Company\'s near and long-term goals, the Company ' +
                'will need to procure funds in addition to the amount raised in this offering. ' +
                'There is no guarantee the Company will be able to raise such funds on ' +
                'acceptable terms or at all. If we are not able to raise sufficient capital ' +
                'in the future, we will not be able to execute our business plan, our ' +
                'continued operations will be in jeopardy and we may be forced to cease ' +
                'operations and sell or otherwise transfer all or substantially all of our ' +
                'remaining assets.',
        },
        1: {
          title: 'Our company may need additional funding in the future, which may not ' +
                'be available.',
          risk: 'The Company’s operations may require additional capital sooner than currently ' +
                'anticipated.  If the Company is unable to obtain additional capital if needed, ' +
                'in the amount and at the time needed, this may restrict planned or ' +
                'future development; limit our company’s ability to take advantage of ' +
                'future opportunities; negatively affect its ability to implement its business ' +
                'strategies and meet its goals; and possibly limit its ability to continue ' +
                'operations. The company’s working capital requirements may significantly vary ' +
                'from those currently anticipated.',
        },
        2: {
          title: 'Our company may be required to take on debt which could result in limitations ' +
                  'on our business.',
          risk: 'If the Company incurs indebtedness, a portion of its cash flow will have ' +
                'to be dedicated to the payment of principal and interest on such indebtedness. ' +
                'Typical loan agreements also might contain restrictive covenants, which may ' +
                'impair the Company’s operating flexibility. Such loan agreements would also ' +
                'provide for default under certain circumstances, such as failure to meet ' +
                'certain financial covenants. A default under a loan agreement could result in ' +
                'the loan becoming immediately due and payable and, if unpaid, a judgment in ' +
                'favor of such lender which would be senior to the rights of shareholders of ' +
                'the Company. A judgment creditor would have the right to foreclose on any of ' +
                'the Company\'s assets resulting in a material adverse effect on the Company\'s ' +
                'business, operating results or financial condition.',
        },
        3: {
          title: 'The Company has prepared only unaudited financial statements in connection ' +
                  'with this offering, which may not be reliable.',
          risk: 'In addition to the unaudited financial statement presented, we expect to ' +
                'prepare financial statements on a periodic basis. The financial data presented ' +
                'has not been audited or reviewed. In preparing the financial statements, ' +
                'we have made certain assumptions concerning our business and the market which ' +
                'may not be accurate.  Investors are encouraged to review any statements with an ' +
                'independent accountant and should not invest if they believe that they have ' +
                'insufficient information.',
        },
        4: {
          title: 'The Company’s future revenue goals are unpredictable and may fluctuate.',
          risk: 'The Company has forecasted its capitalization requirements based on sales ' +
                'goals and cost containment measures; any changes to these forecasts could make ' +
                'it difficult for the company to achieve its projected growth, which would ' +
                'affect available cash and working capital, ultimately affecting the Company\'s ' +
                'financial condition. This could put the investor at risk of losing their ' +
                'investment.',
        },
        5: {
          title: 'Our operating costs are unpredictable and our operating results may ' +
                'fluctuate due to factors that are difficult to forecast and not within ' +
                'our control.',
          risk: 'In addition to general economic conditions and market fluctuations, significant ' +
                'operating cost increases could adversely affect us due to numerous factors, ' +
                'many of which are beyond our control. Increases in operating costs would likely ' +
                'negatively impact our operating income, and could undermine our ability to grow ' +
                'our business.Our past operating results may not be accurate indicators of ' +
                'future performance, and you should not rely on such results to predict our ' +
                'future performance.',
        },
      };

      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsFinancial.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsOperational: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-operational/:index',
    riskType: 'operational_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'We have a limited operating history upon which you can e valuate ' +
                  'our performance.',
          risk: 'We have a limited history upon which an evaluation of our prospects and ' +
                'future performance can be made. Our proposed operations are subject to all ' +
                'business risks associated with new enterprises. The likelihood of our creation ' +
                'of a viable business must be considered in light of the problems, expenses, ' +
                'difficulties, complications, and delays frequently encountered in connection ' +
                'with the inception of a business, operation in a competitive industry, and the ' +
                'continued development of advertising, promotions, and a corresponding ' +
                'client base.',
        },
        1: {
          title: 'We plan to implement new lines of business or offer new products and service.',
          risk: 'In developing and marketing new lines of business and/or new products and ' +
                'services, we may invest significant time and resources. Initial timetables for ' +
                'the introduction and development of new lines of business and/or new products ' +
                'or services may not be achieved and price and profitability targets may not ' +
                'prove feasible. We may not be successful in introducing new products and ' +
                'services in response to industry trends or developments in technology, or ' +
                'those new products may not achieve market acceptance. As a result, we could ' +
                'lose business, be forced to price products and services on less advantageous ' +
                'terms to retain or attract clients, or be subject to cost increases. ' +
                'As a result, our business, financial condition or results of operations may ' +
                'be adversely affected.',
        },
        2: {
          title: 'If the Company fails to achieve certain operational goals it may incur ' +
                  'significant losses and there can be no assurance that the Company will ' +
                  'become a profitable business.',
          risk: 'The Company’s ability to become profitable depends upon successfully executing ' +
                'on operational goals, such as successful marketing efforts and generating ' +
                'cash flow from operations. There can be no assurance that this will occur. ' +
                'Unanticipated operational problems and executional expenses may impact whether ' +
                'the Company is successful.  If the Company sustains losses over an extended ' +
                'period of time, it may be unable to continue in business and may need to make ' +
                'significant modifications to its stated strategies. Although the management ' +
                'team may have had some success in the past, they may be unable to meet future ' +
                'business objectives due to unanticipated operations challenges.',
        },
        3: {
          title: 'Incidents of hacking, identity theft, cyberterrorism or climate change may ' +
                  'adversely impact our operations.',
          risk: 'Our business operations may at times be dependent upon digital technologies, ' +
                'including information systems, infrastructure and cloud applications. ' +
                'The U.S. government has issued public warnings that indicate that such ' +
                'business information technology might be susceptible to cyber security threats, ' +
                'including hacking, identity theft and acts of cyberterrorism. Additionally, ' +
                'our critical systems may be vulnerable to damage or interruption from ' +
                'earthquakes, storms, terrorist attacks, floods, fires, power loss, ' +
                'telecommunications failures, computer viruses, computer denial of service ' +
                'attacks, or other attempts to harm the systems, whether man made or ' +
                'acts of nature. Many of these systems will not be fully redundant, ' +
                'and disaster recovery planning cannot account for all eventualities. ' +
                'As cyber incidents continue to evolve and as severe weather related events ' +
                'become more extreme, we may be required to expend additional resources to ' +
                'modify or enhance our protective measures or to investigate and remediate any ' +
                'vulnerability to cyber incidents or natural disasters.',
        },
        4: {
          title: 'Certain future relationships have not been established and existing ' +
                  'relationships are not guaranteed to endure.',
          risk: 'The Company has established and will establish certain relationships with ' +
                'others. We will need to maintain such relationships and, in some cases, ' +
                'establish new ones or replace existing ones. There will be several agreements ' +
                'and documents that remain to be negotiated, executed, and implemented with ' +
                'respect to certain aspects of our planned operations. In some cases, ' +
                'the parties with whom we would need to establish a relationship may not ' +
                'yet be identified. If we are unable to enter into these agreements or ' +
                'relationships on satisfactory terms, our operations could be delayed or ' +
                'curtailed, expenses could be increased, and profitability and the likelihood ' +
                'of returns to investors could be adversely affected.',
        },
        5: {
          title: 'We may experience defects and system failures which would harm our business ' +
                  'and reputation and expose us to potential liability.',
          risk: 'We may encounter delays when developing new products and services. ' +
                'Alternatively, any new products and services may in the future contain ' +
                'undetected errors or defects when first introduced.  Defects, errors or ' +
                'delays in development of our products or services could result in an ' +
                'interruption of business operations; a delay in market acceptance; ' +
                'additional development and remediation costs; diversion of technical and ' +
                'other resources; a loss of customers; negative publicity; or exposure ' +
                'to liability claims.  Any one or more of the foregoing occurrences could have ' +
                'a material adverse effect on our business, financial condition and results ' +
                'of operations, or could cause our business to fail.',
        },
        6: {
          title: 'Our advertising and marketing efforts may be costly and may not achieve ' +
                  'desired results.',
          risk: 'Although we target our advertising and marketing efforts on current and ' +
                'potential customers who we believe are likely to be in the market for the ' +
                'products we sell, we cannot assure you that our advertising and marketing ' +
                'efforts will achieve our desired results. In addition, we periodically adjust ' +
                'our advertising expenditures in an effort to optimize the return on such ' +
                'expenditures. Any decrease in the level of our advertising expenditures, ' +
                'which may be made to optimize such return could adversely affect our sales.',
        },
      };

      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsOperational.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );

      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },

  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsCompetitive: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-competitive/:index',
    riskType: 'competitive_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.methods),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'The development and commercialization of our services is highly competitive.',
          risk: 'Many of our competitors have significantly greater financial, technical and ' +
                'human resources than we have. Accordingly, our competitors may commercialize ' +
                'products more rapidly or effectively than we are able to, which would adversely ' +
                'affect our competitive position.',
        },
        1: {
          title: 'Many of our competitors have greater brand recognition and more extensive ' +
                  'resources.',
          risk: 'This may place us at a disadvantage in responding to our competitors\' pricing ' +
                'strategies, advertising campaigns, strategic alliances and other initiatives. ' +
                'Consequently, such competitors may be in a better position than the Company ' +
                'to take advantage of customer acquisition and business opportunities, ' +
                'and devote greater resources to marketing and sale of their offerings. ' +
                'These competitors may limit our opportunity to acquire customers and facilitate ' +
                'business arrangements.  There is no certainty that the Company will be able ' +
                'to compete successfully. If the Company cannot break through and compete ' +
                'successfully, investors may be at risk of losing their investment.',
        },
        2: {
          title: 'The Company may not be able to create and maintain a competitive advantage.',
          risk: 'The demand for our products or services may change and we may have difficulty ' +
                'maintaining a competitive advantage within our market.  The Company\'s success ' +
                'could depend on the ability of management to respond to changingsituations, ' +
                'standards and customer needs on a timely and cost-effective basis. In addition, ' +
                'any failure by the management to anticipate or respond adequately to changes in ' +
                'customer preferences and demand could have a material adverse effect on our ' +
                'financial condition, operating results and cash flow.',
        },
        3: {
          title: 'New competitors may enter our market in a manner that could make it difficult ' +
                  'to differentiate our Comapny.',
          risk: 'While the Company is aware of certain competitors in the market, there is ' +
                'the possibility that new competitors may enter and that they may be better ' +
                'funded.  To the extent that the market becomes more crowded, this may make it ' +
                'more difficult for us to differentiate our value proposition or to get in front ' +
                'of right partners and customers.  It may be difficult to compete with new ' +
                'entrants if there is pricing pressure or changes in market demand.   ' +
                'The Company may also have a hard time competing against companies who can ' +
                'negotiate for better prices from suppliers, produce goods and services on ' +
                'a large scale more economically, or take advantage of bigger marketing budgets.',
        },
      };

      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsCompetitive.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },

  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsPersonnel: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-personnel/:index',
    riskType: 'personnel_and_third_parties_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'Our company may be unable to retain senior personnel. ',
          risk: 'We believe that our success will depend on the continued employment of our ' +
                'senior management and key personnel. If one or more members of our senior ' +
                'management were unable or unwilling to continue in their present positions, ' +
                'our business and operations could be disrupted and this could put the overall ' +
                'business at risk. ',
        },
        1: {
          title: 'In order for the Company to compete and grow, it must attract, recruit ' +
                  'and develop the new personnel who have the needed experience.',
          risk: 'Recruiting and retaining highly qualified personnel is critical to our success. ' +
                'These demands may require us to hire additional personnel and will require our ' +
                'existing management personnel to develop additional expertise. If we ' +
                'experience difficulties in hiring and retaining personnel in key positions, we ' +
                'could suffer from delays in development, loss of customers and sales and ' +
                'diversion of management resources, which could adversely affect operating ' +
                'results.',
        },
        2: {
          title: 'Although dependent on certain key personnel, the Company does not have any ' +
                'life insurance policies on any such individuals.',
          risk: 'While the Company is dependent on key personnel in order to conduct its ' +
                'operations and execute its business plan, the Company has not purchased any ' +
                'insurance policies with respect to the death or disability of those ' +
                'individuals. Therefore, in the event that any of the Company\'s employees ' +
                'die or become disabled, the Company will not receive any insurance proceeds as ' +
                'compensation for such person\s absence. The loss of such person could ' +
                'negatively affect the Company and its operations',
        },
        3: {
          title: 'The Company relies on third-parties over which the Company has little control; ' +
                'third party failures could negatively affect the Company\'s business.',
          risk: 'While the Company intends to implement rigorous standards in selecting third ' +
                'party relationships and vendors, if a third-party fails to meet its obligations ' +
                'or provide the products or services required by the Company, the Company\'s ' +
                'operations and reputation may suffer.',
        },
        4: {
          title: 'We outsource a number of our non-core functions and operations.',
          risk: 'In certain instances, we rely on single or limited service providers and ' +
                'outsourcing vendors because the relationship is advantageous due to quality, ' +
                'price, or lack of alternative sources. If our third party services were ' +
                'interrupted and we were not able to find alternate third-party providers, ' +
                'we could experience disruptions.   Such interruptions could result in damage ' +
                'to our reputation and customer relationships and adversely affect our business. ' +
                'These events could materially and adversely affect our ability to retain and ' +
                'attract customers, and have a material negative impact on our operations, ' +
                'business, financial results and financial condition.',
        },
        5: {
          title: 'The Company may not be able to adequately ensure the loyalty and ' +
                  'confidentiality of employees and third parties',
          risk: 'The Company may rely on nondisclosure and noncompetition agreements with ' +
                'employees, consultants and other parties to protect, in part, trade secrets and ' +
                'other proprietary rights. There can be no assurance that these agreements will ' +
                'adequately protect the Company’s trade secrets and other proprietary rights and ' +
                'will not be breached, that the Company will have adequate remedies for any ' +
                'breach, that others will not independently develop substantially equivalent ' +
                'proprietary information or that third parties will not otherwise gain access ' +
                'to our trade secrets or other proprietary rights.',
        },
      };

      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsPersonnel.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsLegal: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-legal/:index',
    riskType: 'legal_and_regulatory_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {
        0: {
          title: 'We rely on various intellectual property rights in order to operate our ' +
                  'business and these rights may be challenged.',
          risk: 'The Company’s intellectual property rights may not be sufficiently broad and ' +
                'may notprovide a significant competitive advantage. The steps that the Company ' +
                'has taken to maintain and protect its intellectual property may not prevent ' +
                'it from being challenged, invalidated or circumvented. In some circumstances, ' +
                'enforcement may not be available to us because an infringer has a dominant ' +
                'intellectual property position or for other business reasons. The Company\'s ' +
                'failure to obtain or maintain intellectual property rights that convey ' +
                'competitive advantage, adequately protect its intellectual property or detect ' +
                'or prevent circumvention or unauthorized use of such property, could adversely ' +
                'impact the Company\'s competitive position and results of operations\'.',
        },
        1: {
          title: 'From time to time, third parties may claim that one or more of our products ' +
                'or services infringe their intellectual property rights.',
          risk: 'Any dispute or litigation regarding future intellectual property could be ' +
                'costly and time-consuming due to the uncertainty of intellectual property ' +
                'litigation and could divert our management and key personnel from our business ' +
                'operations. A claim of intellectual property infringement could force us to ' +
                'enter into a costly or restrictive license agreement, which might not be ' +
                'available under acceptable terms or at all.  This could require us to redesign ' +
                'our products, which would be costly and time-consuming, and/or could subject us ' +
                'to an injunction against development and sale of certain of our products or ' +
                'services. We may have to pay substantial damages, including damages for past ' +
                'infringement if it is ultimately determined that our product candidates ' +
                'infringe a third party’s proprietary rights. Even if these claims are without ' +
                'merit, defending a lawsuit takes significant time, may be expensive and may ' +
                'divert management’s attention from other business concerns. Any public ' +
                'announcements related to litigation or interference proceedings initiated or ' +
                'threatened against as could cause our business to be harmed. Our intellectual ' +
                'property portfolio may not be useful in asserting a counterclaim, or ' +
                'negotiating a license, in response to a claim of intellectual property ' +
                'infringement. In certain of our businesses we rely on third party intellectual ' +
                'property licenses and we cannot ensure that these licenses will be available to ' +
                'us in the future on favorable terms or at all.',
        },
        2: {
          title: 'A sizable proportion of the products that we manufacture, source, distribute ' +
                  'or market are required to comply with regulatory requirements.',
          risk: 'To lawfully operate our businesses, we are required to hold permits, licenses ' +
                'and other regulatory approvals from, and to comply with operating and security ' +
                'standards of, governmental bodies. Failure to maintain or renew necessary ' +
                'permits, licenses or approvals, or noncompliance or concerns over noncompliance ' +
                'may result in suspension of our ability to distribute, import or manufacture ' +
                'products, product recalls or seizures, or criminal and civil sanctions and ' +
                'could have an adverse effect on our results of operations and financial ' +
                'condition.',
        },
        3: {
          title: 'There is risk associated with the Company’s indemnification of ' +
                  'affiliated parties.',
          risk: 'Our Directors and executive officers will be relieved of liability to the ' +
                'Company or our Shareholders for monetary damages for conduct as Directors and ' +
                'executive officers. We may also enter into indemnity agreements with our ' +
                'Directors and executive officers. The exculpation provisions contained therein ' +
                'may have the effect of preventing shareholders from recovering damages against ' +
                'our Directors and executive officers caused by poor judgment or other ' +
                'circumstances. The indemnification provisions may require us to use our assets ' +
                'to defend our Directors and executive officers against claims, including claims ' +
                'arising out of negligence, poor judgment, or other circumstances. ' +
                'The indemnification obligations of the Company will be payable from the ' +
                'assets of the Company.',
        },
        4: {
          title: 'Changes in federal, state or local laws and regulations could increase our ' +
                  'expenses and adversely affect our results of operations.',
          risk: 'Our business is subject to a wide array of laws and regulations. The current ' +
                'political environment, financial reform legislation, the current high level of ' +
                'government intervention and activism and regulatory reform may result in ' +
                'substantial new regulations and disclosure obligations and/or changes in the ' +
                'interpretation of existing laws and regulations, which may lead to additional ' +
                'compliance costs as well as the diversion of our management’s time and ' +
                'attention from strategic initiatives. If we fail to comply with applicable laws ' +
                'and regulations we could be subject to legal risk, including government ' +
                'enforcement action and class action civil litigation that could disrupt our ' +
                'operations and increase our costs of doing business. Changes in the regulatory ' +
                'environment regarding topics such as privacy and information security, product ' +
                'safety or environmental protection, including regulations in response to ' +
                'concerns regarding climate change, collective bargaining activities, minimum ' +
                'wage laws and health care mandates, among others, could also cause our ' +
                'compliance costs to increase and adversely affect our business and results ' +
                'of operations.',
        },
      };
      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsLegal.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  riskFactorsMisc: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/risk-factors-misc/:index',
    riskType: 'miscellaneous_risk',
    events: _.extend({
      'click .submit_formc': submitFormc,
    }, menuHelper.events, riskFactorsHelper.events, leavingConfirmationHelper.events),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.title = { label: 'Title for Risk' };
      this.fields.risk = { label: 'Describe Your Risk' };
      this.defaultRisks = {};
      this.labels = labels;
      this.assignLabels();
    },

    render() {
      let template = require('components/formc/templates/riskFactorsMisc.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          defaultRisks: this.defaultRisks,
        })
      );
      this.$('textarea').each(function () {
        $(this).css({ height: this.scrollHeight + 'px' });
      });
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, addSectionHelper.methods, riskFactorsHelper.methods, leavingConfirmationHelper.methods)),

  financialCondition: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/financial-condition',

    events: _.extend({
      'submit form': api.submitAction,
      'click .submit_formc': submitFormc,
    }, menuHelper.events, yesNoHelper.events, addSectionHelper.events, dropzoneHelpers.events, /*leavingConfirmationHelper.events*/),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.campaign = options.campaign;
      this.labels = {
        sold_securities_data: {
          taxable_income: "Taxable Income",
          total_income: "Total Income",
          total_tax: "Total Tax",
          total_assets: "Total Assets",
          long_term_debt: "Long Term Debt",
          short_term_debt: "Short Term Debt",
          cost_of_goods_sold: "Cost of Goods Sold",
          account_receivable: "Account Receivable",
          cash_and_equivalents: "Cash Equivalents",
          revenues_sales: "Revenues Sales",
        },
        sold_securities_amount: "How much have you sold within the preceeding 12-month period?",
        fiscal_recent_group_id: "Upload financials for most recent fiscal year",
        fiscal_prior_group_id: "Upload financials for prior fiscal year",
        financials_condition_no: "Please discuss financial milestones and operational, liquidity and other challenges.  Please discuss how the proceeds from the offering will affect your liquidity, whether these funds are necessary to the viability of the business, and how quickly you anticipate using your available cash. Please also discuss other available sources of capital, such as lines of credit or required contributions by shareholders, for example.",
        financials_condition_yes: "Please discuss your historical results for each period for which you provide financial statements.  The discussion should focus on financial milestones and operational, liquidity and other challenges.  Please also discuss whether historical results and cash flows are representative of what investors should expect in the future. Take into account the proceeds of the offering and any other known sources of capital. Please discuss how the proceeds from the offering will affect your liquidity, whether these funds are necessary to the viability of the business, and how quickly you anticipate using your available cash.  Please also discuss other available sources of capital, such as lines of credit or required contributions by shareholders, for example. ",
      };
      this.assignLabels();

      this.createIndexes();
      this.buildJsonTemplates('formc', {campaign: this.campaign});
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/outstanding-security';
    },

    render() {
      let template = require('./templates/financialCondition.pug');

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          campaignId: this.campaign.id,
          templates: this.jsonTemplates,
        })
      );
      setTimeout(() => { this.createDropzones() } , 1000);
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, yesNoHelper.methods, addSectionHelper.methods, dropzoneHelpers.methods, leavingConfirmationHelper.methods)),

  outstandingSecurity: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id/outstanding-security',
    events: _.extend({
      'submit #security_model_form': 'addOutstanding',
      'change #security_type': 'outstandingSecurityUpdate',
      'click #submitForm': api.submitAction,
      'click .submit_formc': submitFormc,
      'click .delete-outstanding': 'deleteOutstanding',
    }, addSectionHelper.events, menuHelper.events, yesNoHelper.events, /*leavingConfirmationHelper.events*/),

    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.fields.business_loans_or_debt_choice.validate = {};
      this.fields.business_loans_or_debt_choice.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.fields.exempt_offering_choice.validate = {};
      this.fields.exempt_offering_choice.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.fields.outstanding_securities.schema.security_type.type = 'choice';
      this.fields.outstanding_securities.schema.security_type.validate = {};
      this.fields.outstanding_securities.schema.security_type.validate.choices = {
        0: 'Preferred Stock',
        1: 'Common Stock',
        2: 'Debt',
        3: 'Warrants',
        4: 'Options',
        5: 'Other',
      };
      this.fields.outstanding_securities.schema.voting_right.type = 'radio';
      this.fields.outstanding_securities.schema.voting_right.validate = {};
      this.fields.outstanding_securities.schema.voting_right.validate.choices = {
        1: 'Yes',
        0: 'No',
      };
      this.labels = {
        outstanding_securities: {
          security_type: "Security Type",
          custom_security_type: "Custom Security Type",
          other_rights: "Other Rights",
          amount_authroized: "Amount Authorized",
          amount_outstanding: "Amount Outstanding",
          voting_right: "Voting right",
          terms_and_rights: "Describe all material terms and rights",
        },
        exempt_offering: {
          exemption_relied_upon: 'Exemption Relied upon',
          use_of_proceeds: 'Use of Proceeds',
          offering_date: 'Date of The Offering',
          amount_sold: 'Amount Sold',
          securities_offered: 'Securities Offered',
        },
        business_loans_or_debt: {
          maturity_date: 'Maturity Date',
          outstanding_amount: 'Outstanding Amount',
          interest_rate: 'Interest Rate',
          other_material_terms: 'Other Material Terms',
          creditor: 'Creditor',
        },
        business_loans_or_debt_choice: 'Do you have any business loans or debt?',
        exempt_offering_choice: 'An "exempt offering" is any offering of securities which is exempted from the registration requirements of the Securities Act. Have you conducted any exempt offerings in the past three years?',
        exercise_of_rights: 'How could the exercise of rights held by the principal shareholders affect the purchasers of the securities being offered?',
        risks_to_purchasers: '',
        terms_of_securities: 'How may the terms of the securities being offered be modified?',
        security_differences: 'Are there any differences not reflected above between the ' +
                              'securities being offered and each other class of security of ' +
                              'the issuer?',
        rights_of_securities: 'How may the rights of the securities being offered be materially ' +
                              'limited, diluted or qualified by the rights of any other class of ' +
                              'security identified above?',
      };
      this.assignLabels();

      this.createIndexes();
      this.buildJsonTemplates('formc');

    },

    outstandingSecurityUpdate(e) {
      if (e.target.options[e.target.selectedIndex].value == '5') {
        $('#security_modal #custom_security_type').parent().parent().show();
      } else {
        $('#security_modal #custom_security_type').parent().parent().hide();
      }
    },

    addOutstanding(e) {
      e.preventDefault();
      const data = $(e.target).serializeJSON({ useIntKeysAsArrayIndex: true });

      const sectionName = e.target.dataset.section;
      const template = require('./templates/snippets/outstanding_securities.pug');

      data.amount_authroized = data.amount_authroized.replace(/[\$\,]/g, '');
      data.amount_outstanding = data.amount_outstanding.replace(/[\$\,]/g, '');
      if (!validation.validate(this.fields.outstanding_securities.schema, data, this)) {
        _(validation.errors).each((errors, key) => {
          validation.invalidMsg(this, key, errors);
        });
        this.$('.help-block').prev().scrollTo(5);
        return;
      } else {
        this.$el.find('.outstanding_securities_block').show();
        $('.' + sectionName + '_container').append(
          template({
            fields: this.fields[sectionName],
            name: sectionName,
            attr: this.fields[sectionName],
            value: data,
            index: this[sectionName + 'Index'],
          })
        );

        this.model[sectionName].push(data);
        this[sectionName + 'Index']++;

        $('#security_modal').modal('hide');

        e.target.querySelectorAll('input').forEach(function(el, i) {
          if (el.type == "radio") el.checked = false; 
          else el.value = '';
        });

        e.target.querySelector('textarea').value = '';
        api.makeRequest(
          this.urlRoot.replace(':id', this.model.id),
          'PATCH',
          {'outstanding_securities': this.model[sectionName]}
        );
      };
    },

    deleteOutstanding(e) {
      e.preventDefault();
      if (!confirm('Are you sure?')) return;
      let sectionName = e.currentTarget.dataset.section;
      let index = e.currentTarget.dataset.index;
      this.$('.' + sectionName + '_container tr[data-index=' + index + ']').remove();
      this.model[sectionName].splice(index, 1);

      // Reorganize indice
      this.$('.' + sectionName + '_container tr').each(function (idx, elem) {
        $(this).attr('data-index', idx);
        $(this).find('a').attr('data-index', idx);
      });

      // ToDo
      // Fix index counter
      this[sectionName + 'Index']--;
      this.$('.' + sectionName + '_container tr')

      api.makeRequest(
        this.urlRoot.replace(':id', this.model.id),
        'PATCH',
        {'outstanding_securities': this.model[sectionName]}
      );
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl() {
      return '/formc/' + this.model.id + '/background-check';
    },

    render() {
      let template = require('./templates/outstandingSecurity.pug');

      if (this.model.outstanding_securities) {
        this.outstanding_securitiesIndex = Object.keys(this.model.outstanding_securities).length;
      } else {
        this.outstanding_securitiesIndex = 0;
      }

      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
          templates: this.jsonTemplates,
        })
      );
      $('#security_modal #custom_security_type').parent().parent().hide();
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, addSectionHelper.methods, menuHelper.methods, yesNoHelper.methods, leavingConfirmationHelper.methods)),

  backgroundCheck: Backbone.View.extend(_.extend({
    urlRoot: formcServer + '/:id' + '/background-check',
    initialize(options) {
      this.model = options.formc;
      this.fields = options.fields;
      this.labels = {
        company_or_director_subjected_to: 'If Yes, Explain',
        descrption_material_information: '2) If you\'ve provided any information in a format, ' +
            'media or other means not able to be reflected in text or pdf, please include here: ' +
            '(a) a description of the material content of such information; (b) a description of ' +
            'the format in which such disclosure is presented; and (c) in the case of disclosure ' +
            'in video, audio or other dynamic media or format, a transcript or description of ' +
            'such disclosure.',
        material_information: '1) Such further material information, if any, as may be neessary ' +
            'to make the required statments, in the light of the cirsumstances under which they ' +
            'are made, not misleading.',
      };
      this.assignLabels();
    },

    _success(data) {
      app.hideLoading();
      $('#content').scrollTo();
      return false;
    },

    events: _.extend({
      'submit form': api.submitAction,
      'click .submit_formc': submitFormc,
    }, menuHelper.events, yesNoHelper.events, leavingConfirmationHelper.events),

    render() {
      let template = require('./templates/backgroundCheck.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
        })
      );
      disableEnterHelper.disableEnter.call(this);
      return this;
    },
  }, menuHelper.methods, yesNoHelper.methods, addSectionHelper.methods, leavingConfirmationHelper.methods)),

  finalReview: Backbone.View.extend({
    urlRoot: formcServer + '/:id/final-review',
    initialize(options) {
      this.fields = options.fields;
      disableEnterHelper.disableEnter.call(this);
    },
    events: {
      'click .createField': 'createField',
    },

    _success(data, newData) {
      formcHelpers.updateFormcMenu(formcHelpers.formcCalcProgress(app.user.formc));
      return 1;
    },

    getSuccessUrl() {
      return  '/formc/' + this.model.id + '/review';
    },

    createField: function (event) {
      event.preventDefault();
      if ($(event.target).hasClass('noactive')) {
          return false;
      }

      let target = event.target;
      let element = '';
      if(target.dataset.type == 'text') {
        element = document.createElement('input');
        element.name = target.dataset.name;
        element.value = target.innerHTML;
        element.onblur = (e) => this.update(e);
        target.parentElement.insertBefore(element, target);
      } else if(target.dataset.type == 'select') {
        element = document.createElement('select');
        element.name = target.dataset.name;
        element.onblur = (e) => this.update(e);
        let v = target.dataset.name.split('.').reduce((o,i)=>o[i], this.fields);
        v = v.validate.OneOf;
        v.choices.forEach((el, i) => {
          let e = document.createElement('option');
          e.innerHTML = v.labels[i];
          e.value = v.choices[i];
          if(v.choices[i] == target.dataset.value) {
            e.setAttribute('selected', true);
          }
          element.appendChild(e);
        });
        target.parentElement.insertBefore(element, target);
      }

      target.remove();
    },

    update(e) {
      const val = e.target.value;
      const name = e.target.name;
      const reloadRequiredFields = [
        'corporate_structure',
        'maximum_raise',
        'minimum_raise',
        'security_type',
        'price_per_share',
      ];

      e.target.setAttribute(
        'id', e.target.name.replace(/\./g, '__').replace(/\[/g ,'_').replace(/\]/g, '_')
      );

      let data = {};
      let url = '';
      let fieldName = '';

      if(name.indexOf('company.') !== -1) {
        fieldName = name.split('company.')[1];
        data[name.split('company.')[1]] = val;
        url = raiseCapitalServer + '/company/' + this.model.company.id + '/edit';
      } else if(name.indexOf('campaign.') !== -1) {
        fieldName = name.split('campaign.')[1];
        data[fieldName] = val;
        if([
            'pitch',
            'intended_use_of_proceeds',
            'business_model',
            'faq',
            'additional_info'].indexOf(fieldName) !== -1) {
          url = raiseCapitalServer + '/campaign/' + this.model.campaign.id + '/general_information';
        } else if([
            'minimum_increment',
            'minimum_raise',
            'maximum_raise',
            'length_days',
            'premoney_valuation',
            'security_type',
            'valuation_determination',
            'valuation_determination_other',
            'price_per_share',
          ].indexOf(fieldName) !== -1) {
          url = raiseCapitalServer + '/campaign/' + this.model.campaign.id + '/specifics';
        }
      } else if(name.indexOf('formc.') !== -1) {
          fieldName = name.split('formc.')[1];
          data[fieldName] = val;
          url = formcServer + '/' + this.model.formc.id + '/final-review';
      }

      api.makeRequest(url, 'PATCH', data)
        .then((data) => {

          if(reloadRequiredFields.indexOf(fieldName) != -1) {
            window.location.reload();
            return false;
          }

          let input = document.querySelector(
            '#' + e.target.name.replace(/\./g, '__').replace(/\[/g ,'_').replace(/\]/g, '_')
          );
          let href = '';
          /*
          if(e.target.tagName == 'SELECT') {
            href = document.createElement('select');
            let metaData = name.split('.').reduce(function(o,i) { return o[i]; }, this.fields);
            debugger;
            if(metaData && metaData.validate && metaData.validate.OneOf) {
              let options = metaData.validate.OneOf;
              options.choices.forEach((el, i) => {
                let option = document.createElement('option');
                option.value = el;
                option.innerHTML = options.labels ? options.labels[i] : el;
                href.insert(option);
              });
            }
            
          } else {
            href = document.createElement('a');
            href.innerHTML = val;
            href.setAttribute('href', '#');
          }
          */
          href = document.createElement('a');
          href.innerHTML = val;
          href.setAttribute('href', '#');
          href.dataset.name = e.target.name;
          if(e.target.tagName == 'SELECT') {
            href.dataset.type = 'select';
          } else {
            href.dataset.type = 'text';
          }
          href.dataset.value = val;
          href.className = 'createField show-input link-1';

          document.querySelectorAll('[data-name="' + e.target.name + '"]').forEach((el) => {
            el.innerHTML = val;
          });

          input.after(href);
          input.remove();
        })
        .fail((response) => {
          _(response.responseJSON).each((val, key) => {
            let errorDiv = document.createElement('div');
            e.target.classList.add('form-control-danger');
            errorDiv.className = 'form-control-feedback';
            errorDiv.innerHTML = val.join(', ');
            e.target.after(errorDiv);
          });
        });
    },

    render() {
      let template = require('./templates/finalReview.pug');
      this.$el.html(
        template({
          serverUrl: serverUrl,
          Urls: Urls,
          fields: this.fields,
          values: this.model,
        })
      );

      return this;
    },
  }),

  finalReviewTwo: Backbone.View.extend({
    el: '#content',
    template: require('./templates/finalReviewTwo.pug'),
    initialize(options) {
      this.fields = options.fields;
    },
    events: {
      'click .show-input': 'showInput'
    }, 
    showInput: function (event) {
      event.preventDefault();
      if ($(event.target).hasClass('noactive')) {
          return false;
      }
      var $this = $(event.target),
          inputId = $this.data('name'),
          $input = $('input' + '#' + inputId);

      $this.hide();

      if ($input.length == 0) {
        $input = $('<input type="text" id="' + inputId + '" name="' + inputId + '" class="text-input"/>');
        $this.after($input);
      }

      $input.fadeIn().focus();

      $('body').on('focusout', '.text-input', function(event) {
      var $this = $(event.target),
          value = $this.val(),
          inputId = $this.attr('id'),
          $span = $('[data-name="' + inputId + '"]');
      if (value !== '') {
          $span.text(value);
      }

      $this.hide();
      $span.fadeIn();
      });
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),

  electronicSignature: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_company_formc_first.pug'),
    
    initialize(options) {
      this.fields = options.fields;
      this.name = {};

    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),
    electronicSignatureCompany: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_company_formc.pug'),
    
    initialize(options) {
      this.fields = {};
      this.dob = {};
      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),
  electronicSignatureCik: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_cik_code.pug'),
    
    initialize(options) {
      this.fields = {}; //options.fields;
      this.fields.ein = { };
      this.fields.prefer_cik = { };
      this.fields.fiscal_year_end = { };
      this.fields.type_name = {};
      this.labels = {
        ein: 'Please enter your company`s EIN',
        prefer_cik: 'awdaw',
        type_name: 'Please type name here',
      };

      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),
  electronicSignatureFinancials: Backbone.View.extend({
    el: '#content',
    template: require('./templates/formc_els_financials_certification.pug'),
    
    initialize(options) {
      this.fields = {};
      this.dob = {};
      this.assignLabels();
    },
    render() {
      this.$el.html(
        this.template({
          values: this.model,
          fields: this.fields,
        })
      );
      return this;
    },
  }),
};
