const chai      = require('chai');
const sinon     = require('sinon');
const should    = chai.should();
const expect    = chai.expect;

const Views = require('src/components/anonymousAccount/views.js');
const fakeToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNzYsImZpcnN0X25hbWUiOiJWbGFkaW1pciIsImxhc3RfbmFtZSI6IkNoYWdpbiIsInVzZXJfaXAiOiIxNzIuMTcuMC4xIiwic2l0ZV9pZCI6NH0.kXh56z80TpRL0wwztKlPZ9en1YnTe2Hy22pbD_aiG6E';
const fakeLoginResponse = {
  token: fakeToken,
  id: 176,
  first_name:'Vladimir',
  last_name: 'Chagin',
  image_data: {
    id: 6862,
    mime:'image/jpeg',
    name:'reportazh-dromru-s-pervogo-v-istorii-formuly-1-gran-pri-rossii-avtonovosti_9952.jpg',
    urls: {
      main: '/9a4a37906118be57e46c5a3fe77936d37f59056d.jpg',
      '50x50': '/ba4c924fbda4d92aea02686263c60d15369d4a74.jpg',
      origin: '/baa6377228bf7c661cc1f4465f47561306a9368c.jpg',
    },
    site_id:12
  },
  info:[{
    company_id: 940,
    campaign_id:940,
    formc_id: 940,
    owner_id:176,
    user_id: 176,
    is_paid: false,
    company: 'mac',
    role: 0
  }]
};

const eventEmitter = _.extend({}, Backbone.Events);

const inst = {};
const setData = app.user.setData;
app.user.setData = function(...args) {
  setData.call(app.user, ...args).then(() => {
    eventEmitter.trigger('done');
  });
};

const stubMakeRequest = (response) => {
  api.makeRequest = sinon.stub(api, 'makeRequest');
  api.makeRequest.returns(new Promise((resolve) => {
    resolve(response);
  }));
};

describe('Log-in page', () => {
  beforeEach(() => {
    stubMakeRequest(fakeLoginResponse);
    inst.LoginView = new Views.login({
      el: '#content',
      model: {}
    });
    inst.LoginView.render();
  });

  afterEach(() => {
    inst.LoginView.undelegateEvents();
    delete inst.LoginView;
    $('#content').empty();
    api.makeRequest.restore();
    eventEmitter.off('done');
  });

  it('Login form succeed', (done) => {
    const $loginForm = $('.login-form');
    const userData = {
      domain: 'alpha.growthfountain.com',
      email: 'test@test.com',
      password: 'qweqwe123',
    };

    testHelpers.fillForm($loginForm, _.pick(userData, 'email', 'password'));

    eventEmitter.on('done', () => {
      const data = api.makeRequest.args[0][2];

      expect(data).to.deep.equal(userData);

      //check localStorage/cookie values
      const actualUserObj = JSON.parse(localStorage.getItem('user'));
      const actualToken = localStorage.getItem('token');
      const actualCookieToken = app.cookies.get('token');

      expect(_.omit(actualUserObj, 'token')).to.deep.equal(fakeLoginResponse);
      expect(actualToken).to.equal(fakeToken);
      expect(actualCookieToken).to.equal(fakeToken);

      done();
    });

    $loginForm.submit();
  });

  it('Invalid email/password', () => {
    const $loginForm = $('.login-form');
    const userData = {
      email: '1234',
      password: '1234',
    };

    testHelpers.fillForm($loginForm, userData);

    $loginForm.submit();

    expect(app.validation.errors.email).to.include('Invalid email');
    expect(app.validation.errors.password).to.include('Password must be at least 8 characters');
  });
  
});

describe('Sign-up page', () => {
  beforeEach(() => {
    stubMakeRequest(fakeLoginResponse);

    inst.SignupView = new Views.signup({
      el: '#content',
      model: {}
    });
    inst.SignupView.render();
  });
  afterEach(() => {
    inst.SignupView.undelegateEvents();
    $('#content').empty();
    delete inst.SignupView;
    api.makeRequest.restore();
  });

  it('Sign-up form succeed', (done) => {
    const userData = {
      first_name: 'firstName',
      last_name: 'lastName',
      email: 'test@test.com',
      password1: 'qweqwe123',
      password2: 'qweqwe123',
      checkbox1: 1,
      domain: 'alpha.growthfountain.com',
    };

    const $signupForm = $('.signup-form');
    testHelpers.fillForm($signupForm, _.omit(userData, 'checkbox1', 'domain'));
    $signupForm.find('input[name="checkbox1"]').prop('checked', true);

    // eventEmitter.on('done', () => {
    //   const actualData = api.makeRequest.args[0][2];
    //   expect(actualData).to.deep.equal(userData);
    //   //TODO: check fake server response
    //   done();
    // });

    $signupForm.submit();

    const actualData = api.makeRequest.args[0][2];
    expect(actualData).to.deep.equal(userData);
    //TODO: check fake server response
    done();
  });

});

// describe('Sign-up/Log-in popups', () => {
//   before(() => {
//
//   });
//
//   after(() => {
//
//   });
//
//   beforeEach(() => {
//     inst.makeRequestSpy = new sinon.spy();
//     api.makeRequest = (url, method, data) => {
//       inst.makeRequestSpy(data);
//       return {
//         then(cb) {
//           cb(JSON.parse(fakeLoginResponse));
//           return {
//             fail() {}
//           };
//         }
//       };
//     };
//
//     inst.SignupPopup = new Views.popupLogin({});
//     inst.SignupPopup.render();
//   });
//
//   afterEach(() => {
//     inst.SignupPopup.undelegateEvents();
//     $('#content').empty();
//     delete inst.SignupPopup;
//     delete inst.makeRequestSpy;
//     eventEmitter.off('done');
//   });
//
//   it('Log-in with valid data', (done) => {
//     const $loginForm = $('#sign-in-form');
//     $loginForm.find('input[name=email]').val(userData.email);
//     $loginForm.find('input[name=password]').val(userData.password);
//
//     eventEmitter.on('done', () => {
//       const data = inst.makeRequestSpy.args[0][0];
//
//       expect(data.domain).to.equal('alpha.growthfountain.com');
//       expect(data.email).to.equal(userData.email);
//       expect(data.password).to.equal(userData.password);
//
//       const userStr = localStorage.getItem('user');
//       const tokenStr = localStorage.getItem('token');
//
//       const diff = require('deep-diff').diff;
//       const responseObj = JSON.parse(fakeLoginResponse);
//       const userObj = JSON.parse(userStr);
//
//       expect(responseObj).to.deep.equal(userObj);
//       expect(responseObj.token).to.equal(tokenStr);
//
//       done();
//     });
//
//     $loginForm.submit();
//   });
//
//   it('Sign-up with valid data', (done) => {
//     const $signupForm = $('#sign-up-form');
//     $signupForm.find('input[name=email]').val(userData.email);
//     $signupForm.find('input[name=password1]').val(userData.password1);
//     $signupForm.find('input[name=password2]').val(userData.password2);
//     $signupForm.find('input[name="checkbox1"]').prop('checked', true);
//
//     eventEmitter.on('done', () => {
//       const data = inst.makeRequestSpy.args[0][0];
//       expect(data.domain).to.equal('alpha.growthfountain.com');
//       expect(data.email).to.equal(userData.email);
//       expect(data.password1).to.equal(userData.password1);
//       expect(data.password2).to.equal(data.password2);
//       expect(data.checkbox1).to.equal(1);
//
//       const userStr = localStorage.getItem('user');
//       const tokenStr = localStorage.getItem('token');
//
//       const diff = require('deep-diff').diff;
//       const responseObj = JSON.parse(fakeLoginResponse);
//       const userObj = JSON.parse(userStr);
//
//       expect(responseObj).to.deep.equal(userObj);
//       expect(responseObj.token).to.equal(tokenStr);
//
//       done();
//     });
//
//     $signupForm.submit();
//   });
//
//   it('Log-in with empty email/password', () => {
//     const $loginForm = $('#sign-in-form');
//     $loginForm.find('[name=email]').val('');
//     $loginForm.find('[name=password]').val('');
//
//     $loginForm.submit();
//
//     const data = inst.makeRequestSpy.args[0][0];
//
//     expect(data).to.deep.equal({
//       email: '',
//       password:'',
//       domain: 'alpha.growthfountain.com',
//       checkbox1: 1,
//     });
//   });
//
//   it('Sign-up with not checked checkbox', () => {
//     const $signupForm = $('#sign-up-form');
//
//     $signupForm.submit();
//
//     expect(app.validation.errors).to.deep.equal({
//       checkbox1: ['You must agree to the terms before creating an account'],
//     });
//   });
//
//   it('Sign-up with checked checkbox and empty credentials', () => {
//     const $signupForm = $('#sign-up-form');
//     $signupForm.find('input[name="checkbox1"]').prop('checked', true);
//
//     $signupForm.submit();
//     const data = inst.makeRequestSpy.args[0][0];
//
//     expect(data).to.deep.equal({
//       checkbox1: 1,
//       domain: 'alpha.growthfountain.com',
//       first_name: '',
//       last_name: '',
//       email: '',
//       password1: '',
//       password2: '',
//     });
//   });
// });
