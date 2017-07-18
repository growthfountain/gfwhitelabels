module.exports = {
  fillForm($form, data) {
    _.each(data, (value, name) => {
      $form.find(`[name=${name}]`).val(value);
    });
  },

  stubMakeRequest(response) {
    api.makeRequest = sinon.stub(api, 'makeRequest');
    const dfr = $.Deferred();
    dfr.resolve(response);
    api.makeRequest.returns(dfr);
  },

  printObject(obj) {
    console.log(JSON.stringify(obj, void(0), 2));
  }
};