var delegateEventSplitter = /^(\S+)\s*(.*)$/;

class View {

  protected model = {};
  protected el:Element = null;
  protected template:any = null; // set to function type
  protected events = {};
  protected directives:any = [];

  constructor(model={}, selector="#content", directives:any=[], events={}, ...args:any[]) {
    this.el = document.querySelector(selector);

    this.model = model;

    // all additional parameters will be holder in view class
    for(let key in args) {
      // Fix this
      // this[key] = args[key];
    }

    let oldDirectives = Object.assign(this.directives, directives);
    this.directives = [];

    for(let key in oldDirectives) {
      this.directives.push(new oldDirectives[key](this.el));
    }

    console.log('attach events'); 
    console.log('send class created event'); // app.events.sendEvent(this, 'created');
  }

  find(selector:string) {
    return this.el.querySelector(selector);
  }

  findAll(selector:string) {
    return this.el.querySelectorAll(selector);
  }

  render() {
    this.el.innerHTML = this.template(this.model);

    for(let key in this.directives) {
      this.directives[key].render();
    }

    console.log('send class rendered event'); // app.events.sendEvent(this, 'rendered');
    return this;
  }

  // Remove this view by taking the element out of the DOM, and removing any
  // applicable Backbone.Events listeners.
  destory() {
    this.destoryEvents();
    this.destoryDirectives();
    this.el.remove();
    console.log('send class destored event'); // app.events.sendEvent(this, 'rendered');
    delete this.template;
  }

  destoryEvents() {
    delete this.events;
  }

  destoryDirectives() {
    for(let index in this.directives) {
      this.directives[index].destroy();
    }
    delete this.directives;
  }
}

class FormView extends View {
  constructor(template:any, model=null, selector="#content", directives:any=[], events={}, ...args:any[]) {

    if (model === null) {
      throw 'Please provide model for FormView';
    }

    super(template, model, selector, directives, events, ...args);
  }

  submit(e:Event, newData:any=null) {
    e.preventDefault();

    let form = $(e.target).closest('form');
    this.clearErrorMsgs();

    if (newData === null) {
      newData = form.closest('form').serializeJSON();
    }

    // issue 348, disable form for double posting
    if(form.length > 0) {
      form[0].setAttribute('disabled', true);
    }
    e.target.setAttribute('disabled', true);

    let errors = this.model.setData(newData);
    if (Object.keys(errors) !== 0) {
      for (let key in errors) {                             
				let messages = errors[key];
        this.errorMsg(this, key, messages);                              
      };                                                                          
      this.$('.help-block').prev().scrollTo(25);                                   
      if(form.length > 0) {                                                        
        form[0].removeAttribute('disabled');                                       
      }                                                                       
      e.target.removeAttribute('disabled');                                        
      return false;
    } else {
      app.showLoading();
      this.model.save().then((response) => {

        // this.clearErrorMsgs();
        let defaultAction  = 1;
        if (typeof this._success == 'function') {
          defaultAction = this._success(response);
        }

        if(defaultAction == 1) {

          if(form.length > 0) {
            form[0].removeAttribute('disabled');
          }
          e.target.removeAttribute('disabled');

          $('body').scrollTo();
          app.routers.navigate(
            this.getSuccessUrl(response),
            { trigger: true, replace: false }
          );
        }
      });
    }
    /* 
     * move to the setData method
    // api.deleteEmptyNested.call(this, this.fields, newData);
    // api.fixDateFields.call(this, this.fields, newData);
    // api.fixFieldTypes.call(this, this.fields, newData);
    */

  }

  getSuccessUrl() {
  }

  _success(data) {
    return true;
  }

  clearErrorMsgs(attr, selector) {
    this.find('.alert').remove();
    this.find('.has-error').removeClass('has-error');
    this.find('.help-block').remove();
  }

  errorMsg(attr, error, selector) {
    /*
    // If we have error for json/nested fieds
    // we need get all keys and show error for each key
    // individually
    if (Array.isArray(error) !== true && typeof error == 'object') {
      _(error).forEach((el, k) => {
        _(el).forEach((errors, key) => {
          this.errorMsg(attr + '__' + k + '__' + key, errors, selector);
        });
      });
      return false;
    }

    // Temp hack for nested fields
    if (attr.indexOf('__') !== -1) {
      let t = $('#' + attr).parents('.shown-yes');
      if (t.length != 0 && t.css('display') == 'none') {
        t.show();
      }
    }

    let $el = this.find('#' + attr);
    if ($el.length == 0)
      $el = this.find('[name=' + attr + ']');

    if (Array.isArray(error) !== true) {
      error = [error];
    }

    error = error.map(err => err.endsWith('.') ? err.substring(0, err.length - 1) : err);
    let errorMsg = error.join(', ') + '.';

    // if element not found - we will show error just in alert-warning div
    if ($el.length == 0) {
      $el = this.find('form > .alert-warning');

      // If we don't have alert-warning - we should create it as
      // first element in form
      if ($el.length == 0) {
        let msg = attr == 'non_field_errors' ? '' : ('<b>' + attr + ':</b> ');
        msg += errorMsg;

        $el = $('<div class="alert alert-warning" role="alert"><p>' + msg + '</p></div>');

        if (view.$el.find('form').length == 0) {
          view.$el.prepend($el);
        } else {
          view.$el.find('form').prepend($el);
        }
      } else {
        $el.html(
          $el.html() + '<p><b>' + attr + ':</b> ' +
          errorMsg + '</p>'
        );
      }
    } else {
      let $group = $el.parent();
      $group.addClass('has-error');
      let $errorDiv = $group.find('.help-block');
      if ($errorDiv.length)
        $errorDiv.html(errorMsg);
      else
        $group.append('<div class="help-block">' + errorMsg + '</div>');
    }
     */
  }
}

export default {
  View: View,
  FormView: FormView
};
