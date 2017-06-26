class Lead {
  constructor(data={}, schema={}, url=null) {
    //
    // urlRoot - url for update model assosiated with that file
    // data - file data
    //

    this.data = data || {};
    this.schema = schema;
    if(data && data.id) {
      this.url = url || app.config.authServer + '/import/linkedin/' + data.id;
    } else {
      this.url = url || app.config.authServer + '/import/linkedin';
    }

    this.data = Object.seal(this.data);
    for(let key in this.data) {
      Object.defineProperty(this, key, {
        get: function(value) { return this.data[key]; },
        set: function(value) { this.data[key] = value; },
      });
    }
  }

  toJSON() {
    let data = Object.assign({}, this.data);
    return data;
  }
}

module.exports = Lead
