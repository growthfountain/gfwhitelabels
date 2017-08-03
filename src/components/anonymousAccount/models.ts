import { Model } from 'src/core/models.ts';
import api from 'src/core/api.ts';

export const LOGIN_FIELDS:any = {
  email: {
    type: 'email',
    required: true
  },
  password: {
    type: 'password',
    required: true,
    minLength: 8,
    label: 'Password',
  },
  domain: {
    type: 'string',
    required: true,
  },
};

export const SIGNUP_FIELDS:any = {
  first_name: {
    type: 'string',
    required: true,
    minLength: 2,
    label: 'First Name',
  },
  last_name: {
    type: 'string',
    required: true,
    minLength: 2,
    label: 'Last Name',
  },
  checkbox1: {
    type: 'boolean',
    required: true,
    messageRequired: 'You must agree to the terms before creating an account',
  },
  email: LOGIN_FIELDS.email,
  domain: LOGIN_FIELDS.domain,
  password1: LOGIN_FIELDS.password,
  password2: LOGIN_FIELDS.password,
}; 

export class AnonymousUser extends Model {
  public baseUrl:string = app.config.authServer + '/rest-auth/login';
  public fields:any = LOGIN_FIELDS;

  emptyLocalStorage() {
    localStorage.clear();
    app.cookies.expire('token');
    this.data = {token: null, id: ''};
  }

  updateLocalStorage() {
    localStorage.setItem('token', this.data.token);
    localStorage.setItem('user', JSON.stringify(this.data));
  }

  setData(data:any) {
    if (!data.token) {
      return app.dialogs.error('no token or additional info provided');
    }
    this.data = data;
    this.updateLocalStorage();

    // ToDo
    // Fix year
    app.cookies.set('token', data.token, {
      domain: '.' + app.config.domainUrl,
      // expires: YEAR,
      path: '/',
    });
  }

  getInfoData() {
    $.when(api.makeRequest(app.config.authServer + '/info',  'GET')).done((responseData) => {
      if(responseData) {
        // we need to rerender menu
        this.data = responseData;
      } else {
        this.data = JSON.parse(JSON.stringify(responseData));
      }

      this.updateLocalStorage();

    }).fail(() => {
      this.emptyLocalStorage();
      setTimeout(function() {
        window.location.href = '/account/login?next=' + document.location.pathname;
      }, 100);
    });
  }

  loadWithPromise() {
    // Anonymouse user do not load anything
    return new Promise((resolve, reject) => {
      return resolve();
    });
  }

  isAnonymous() {
    // Always true
    return true;
  }

  stats() {
  }
};
