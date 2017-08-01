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

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    let token = localStorage.getItem('token');
    if (token !== null && token !== '') {
      myHeaders.append('Authorization', 'Bearer ' + token);
    }

    var myRequest = new Request(url, Object.assign({
      method: _type,
      body: data,
      headers: myHeaders,
      // mode: 'cors',
      cache: 'default'
    }, options));

    return fetch(myRequest).then((response) => {

      if (response.ok || _type.toUpperCase() !== 'GET') {
        return;
      }

      let contentType = response.headers.get("content-type");
      if(contentType && contentType.includes("application/json")) {
        return response.json();
      }

      app.helpers.errorPage({
        status: response.status,
        statusText: response.statusText,
      });
    });
  }
};

const api = new API();
export default api;
