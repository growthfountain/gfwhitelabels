const socialAuth = require('./social-auth.js');

import { View, FormView } from "src/core/views.ts";  
import { AnonymousUser, ValidationError } from "src/core/models.ts";  

/*
let user = new modelCore.AnonymousUser();
user.baseUrl = app.config.authServer + '/info';
app.user.validate = () => { return {} };
app.user.save = () => { 
  return api.makeRequest(                                                        
    this.getURL(),                                                             
    this.method,                                                               
    this.data                                                                  
  ); 
}
*/


declare function require(path: string): any;

export class loginView extends FormView {
  public template = require('./templates/login.pug');
  public model = new AnonymousUser();

  _success(data:any) {
    debugger;
    this.model.setData(data);
    return true;
  }

  getSuccessUrl(data:any) {
    // ToDo
    // Rerender menu and use app navigate 
    // e.g. return this.model.next
    window.location.href = this.model.next || app.getParams().next || '/';
    return ''
  }
};

  /*
let loginView = new coreViews.default.FormView(user);
loginView._success = (data) => { app.user.setData(data); };
loginView.template = require('./templates/login.pug');
   */


const Views = {
  login: loginView,
  /*
    urlRoot: app.config.authServer + '/rest-auth/login',
    template: require('./templates/login.pug'),
    events: {
      'submit .login-form': api.submitAction,
    },

    initialize() {
      this.fields = LOGIN_FIELDS;
    },

    render() {
      $('body').scrollTo();

      this.$el.html(
        this.template()
      );
      return this;
    },

    _success(data) {
      app.user.setData(data);
    },
  }),
  */
};

module.exports = Views;
