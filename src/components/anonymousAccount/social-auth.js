const validation = require('components/validation/validation.js');
const hello = require('hellojs');

hello.init({
    facebook: facebookClientId,
    google: googleClientId,
    linkedin: linkedinClientId, 
}, {
    redirect_uri: '/account/finish/login/',
    oauth_proxy: authServer+'/proxy/'
});

const SUPPORTED_NETWORKS = ['facebook', 'linkedin', 'google'];
const SCOPES = {
  facebook: 'public_profile,email',
  linkedin: 'r_basicprofile,r_emailaddress,w_share',
  google: 'profile,email',
};

let functions = {

  // resolves when successful
  // resolves with `true` when canceled
  // rejects with error message otherwise
  login(network) {
    return new Promise((resolve, reject) => {
      if (!_.contains(SUPPORTED_NETWORKS, network))
        return reject(`Network ${network} is not supported`);

      console.log(`${network} logging in ...`);
      hello(network).login({
        scope: SCOPES[network],
      }).then((data) => {
        return this.sendToken(network, data.authResponse.access_token);
      }).then((data) => {
        return resolve({
          cancelled: false, 
          data: data
        });
      }).then(null, (data) => {
        console.log(`${network} error`);
        console.log(data);

        if (_.isBoolean(data))
          return reject(`Authentication with ${network} account failed.`);

        if (data.error.code == 'cancelled')
          return resolve({
            cancelled: true, 
            data: {}
          });

        return reject(data.error.message || `Authentication with ${network} account failed.`);
      });
    });
  },

  sendToken(network, token) {
    return $.ajax({
      method: 'POST',
      url: `${authServer}/rest-auth/${network}/`,
      data: { access_token: token, domain: window.location.host },
    });
  },

  _ensureAgreedWithRules(view) {
    let data = {};
    let cb = view.el.querySelector('#agree-rules');

    if (cb.checked)
      data.checkbox1 = cb.value;

    if (!validation.validate({ checkbox1: view.fields.checkbox1 }, data, this)) {
      _(validation.errors).each((errors, key) => {
        validation.invalidMsg(view, key, errors);
      });

      return false;
    }

    return true;
  },

  loginWithSocialNetwork(e) {
    e.preventDefault();

    if (!functions._ensureAgreedWithRules(this)) {
      return false;
    }

    const network = $(e.target).data('network');

    app.showLoading();
    functions.login(network).then((data) => {
      if (data.cancelled) {
        app.hideLoading();
        return;
      }

      app.user.setData(data.data);

      $('#sign_up').modal('hide');
      $('#sign_in').modal('hide');
    }, (err) => {
      app.hideLoading();
      alert(err);
    });

    return false;
  }
};

module.exports = functions;
