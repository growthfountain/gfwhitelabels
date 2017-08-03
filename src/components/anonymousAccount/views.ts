const socialAuth = require('./social-auth.js');

import { View, FormView } from "src/core/views.ts";  
import { ValidationError } from "src/core/models.ts";  
import { AnonymousUser, SIGNUP_FIELDS, LOGIN_FIELDS } from "src/components/anonymousAccount/models.ts";  

// Fix for require pug files
declare function require(path: string): any;

export class Login extends FormView {
  public template = require('./templates/login.pug');
  public model = new AnonymousUser();
  public fields = LOGIN_FIELDS;

  _success(data:any) {
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


export class Signup extends FormView {
  public template = require('./templates/signup.pug');
  public model = new AnonymousUser();
  public fields = SIGNUP_FIELDS;
  public events = {
    'click .btn-social-network': 'loginWithSocial',
  };

	_success(data:any) {
		this.model.setData(data).then(() => {
			app.analytics.emitEvent(app.analytics.events.RegistrationCompleted, app.user.stats);
		});
	}

	loginWithSocial(e:Event) {
    //socialAuth.loginWithSocialNetwork.call(this, e);
	}
};
