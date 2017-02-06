const rules = require('./rules.js');
const fixedProps = ['type', 'label', 'placeholder'];
const fixedRegex = ['number', 'url', 'email', 'money'];

module.exports = {
  clearMsg (view, attr, selector) {
    var $el = view.$('[name=' + attr + ']');
    var $group = $el.parent();

    // if element not found - do nothing
    // we had clean alert-warning before submit
    if ($el.length != 0) {
      if ($group.find('.help-block').length == 0) {
        $group = $group.parent();
      }
    }

    $group.removeClass('has-error');
    $group.find('.help-block').remove();
  },

  invalidMsg: function (view, attr, error, selector) {

    // If we have error for json/nested fieds
    // we need get all keys and show error for each key
    // individually
    if(Array.isArray(error) !== true && typeof error == 'object') {
      _(error).forEach((el, k) => {
        _(el).forEach((errors, key) => {
          this.invalidMsg(view, attr + '__' + k + '__' + key, errors, selector);
        })
      });
      return false;
    }

    // Temp hack for nested fields
    if(attr.indexOf('__') !== -1) {
      let t = $('#' + attr).parents('.shown-yes');
      if(t.length != 0 && t.css('display') == 'none') {
        t.show();
      }
    }

    let $el = null;
    let $group = null;

    $el = view.$('#' + attr);

    if ($el.length == 0) {
      $el = view.$('[name=' + attr + ']');
    }

    if (Array.isArray(error) !== true) {
      error = [error];
    }

    // if element not found - we will show error just in alert-warning div
    if ($el.length == 0) {
      $el = view.$('form > .alert-warning');

      // If we don't have alert-warning - we should create it as
      // first element in form
      if ($el.length == 0) {
        let msg = attr == 'non_field_errors' ? '' : ('<b>' + attr + ':</b> ');
        msg += error.join(',');

        $el = $('<div class="alert alert-warning" role="alert"><p>' + msg + '</p></div>');

        if(view.$el.find('form').length == 0) {
          view.$el.prepend($el);
        } else {
          view.$el.find('form').prepend($el);
        }
      } else {
        $el.html(
          $el.html() + '<p><b>' + attr + ':</b> ' +
            error.join(',') + '</p>'
        );
      }
    } else {
      $group = $el.parent();
      $group.addClass('has-error');
      var $errorDiv = $group.find('.help-block');

      if ($errorDiv.length != 0) {
        $errorDiv.html(error.join(', '));
      } else {
        $group.append('<div class="help-block">' + error.join(', ') + '</div>');
      }
    }
  },

  runRule(rule, value, name, attr) {
    try {
      if (rules[rule]) {
        rules[rule](name, value, attr, this.data, this.schema);
      }
    } catch (e) {
      this.finalResult = false;
      name = name.replace(/\./g, '__');
      Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
    }
  },

  runRules(attr, name) {
    _(attr).each((value, prop) => {
      if (fixedProps.indexOf(prop) == -1) {
        this.runRule(prop, value, name, attr);
      }
    });
  },

  validate(schema, data) {
    this.schema = schema;
    this.data = data;
    this.finalResult = true;
    this.errors = {};

    _(schema).each((attr, name) => {
      // TODO
      // How to check nested one element if that can be blank ?
      // requiredTemp - temp fix to validate fields on investment page only
      if (attr.type == 'nested' && attr.requiredTemp == true) {
        _(attr.schema).each((attr, subname) => {
          if (fixedRegex.indexOf(attr.type) != -1) {
            _(attr.validate).each((jsonFields, index) => {
              try {
                rules.regex(name, attr, data, attr.type);
                this.runRules(attr, name);
              } catch (e) {
                this.finalResult = false;
                Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
              }
            });
          } else {
            this.runRules(attr, name + '.' + subname);
          }
        });
        if (attr.fn) {
          this.runRule('fn', attr.fn, name, attr);
        }
      } else if (fixedRegex.indexOf(attr.type) != -1) {
        try {
          rules.regex(name, attr, data, attr.type);
          this.runRules(attr, name);
        } catch (e) {
          this.finalResult = false;
          Array.isArray(this.errors[name]) ? this.errors[name].push(e) : this.errors[name] = [e];
        }
      } else {
        this.runRules(attr, name);
      }
    });

    return this.finalResult;
  },
};
