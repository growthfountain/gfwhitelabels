import * as $ from 'jquery';

var app = {
  helpers: {
    errorPage: function(a:any) { },
  }
};


class API {
  constructor() {}
  public makeRequest(url:string, _type:string="GET", data:any={}, options:any={}):Promise<any> {

    if (_type != "GET" && _type != "OPTIONS") {
      data = JSON.stringify(data);
    }

    let params = Object.assign({
      url: url,
      type: _type,
      data: data,
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      beforeSend: function (xhr:any) {
        let token = localStorage.getItem('token');
        if (token !== null && token !== '') {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
      }
    }, options);

    const promise = $.ajax(params);

    promise.always((xhr:any, _status:string) => {

      // If status is success or it is not get request
      // do not show error
      if (_status === 'success' || _type.toUpperCase() !== 'GET') {
        return;
      }

      // If we have location in responseJSON
      // do not show error
      if (xhr.hasOwnProperty('responseJSON') &&
        xhr.responseJSON !== undefined &&
        xhr.responseJSON.hasOwnProperty('location')) {
        return;
      }

      app.helpers.errorPage({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    });

    return promise;
  }
};

const api = new API();
export default api;
