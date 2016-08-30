var calculatorHelper = require("../helpers/calculatorHelpers");
var formatPrice = calculatorHelper.formatPrice;

define(function() {
    let r = {
        model: Backbone.Model.extend({
            urlRoot: serverUrl + '/api/campaign',

            // Helpers for getting values in human readable format
            get_human_number: function(value) {
                if(parseFloat(value) > 900000) {
                    return [parseFloat(value) / 1000000, 'Million']
                } else {
                    return [parseFloat(value) / 1000, 'Thousand']
                }
            },

            get_premoney_valuation: function() {
                return this.get_human_number(this.get('premoney_valuation'))
            },

            get_minimum_raise: function() {
                return this.get_human_number(this.get('minimum_raise'))
            },

            get_maximum_raise: function() {
                return this.get_human_number(this.get('maximum_raise'))
            },

            // will work for youtube only
            get_video_id: function() {
                if(self.video.count('=') > 0) {
                    //  in case if we have youtube.com?v=ID&key1=val1 link
                    return this.video.split('=')[1].split('=')[0]
                } else {
                    return ''
                }
            },

            showBeautifulNumber: function (number) {
                return formatPrice(number);
            },

            formatFoundingDate: function (dateStr) {
                var strs = dateStr.split("-");
                return strs[1] + "-" + strs[0];
            },

            calculateRaisedPercentage: function (minimum_raise, amount_raised) {
                var percentage_raised = Math.round(amount_raised / minimum_raise * 100);
                if (percentage_raised < 20) percentage_raised = 20;
                return percentage_raised;
            }
        
        }),

    };

    r.collection = Backbone.Collection.extend({
        model: r.model,
        url: serverUrl + '/api/campaign'
    });

    return r;
});
