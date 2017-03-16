module.exports = {
  routes: {
    'calculator/capitalraise/intro': 'calculatorCapitalraiseIntro',
    'calculator/capitalraise/step-1': 'calculatorCapitalraiseStep1',
    'calculator/capitalraise/finish': 'calculatorCapitalraiseFinish',
  },
  methods: {
    calculatorCapitalraiseIntro() {
      const View = require('./views');
      new View.intro().render();
      $('body').scrollTo();
      app.hideLoading();
    },

    calculatorCapitalraiseStep1() {
      const View = require('./views');
      new View.step1().render();
      $('body').scrollTo();
      app.hideLoading();
    },

    calculatorCapitalraiseFinish() {
      const View = require('./views');
      new View.finish().render();
      $('body').scrollTo();
      app.hideLoading();
    },
  },
};
