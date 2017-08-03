import * as $ from 'jquery';
import api from 'src/core/api.ts';

declare var app:any;

interface IData { 
  [propName: string]: any;
}


interface IModel { 
  baseUrl:string;
  data:IData;
  fields:IData;
  method:string;
  [propName: string]: any;
}


export class ValidationError extends Error {
  public name:string = 'validation_error'
  public jsonMsg:any = {};

  constructor(msg:string, jsonMsg:any) {
    super(msg);
    this.jsonMsg = jsonMsg;
  }
}

export class Model {

  protected updatedKeys:string[] = [];
  protected errors:any = {};

  public baseUrl:string = null;
  public data:IData;
  public fields:IData;
  public method:string = "POST";

  constructor(data:IData={}, fields:IData={}) {
    this.data = data;
    this.fields = fields;

    if(this.data.id) {
      this.method = "PATCH";
    }

    for(let key in this.data) {
      if (key !== 'data') {
        Object.defineProperty(this, key, {
          get: () => { return this.data[key]; },
          set: (value:any) =>  { 
            if (this.data[key] !== value) {
              this.data[key] = value;
              this.updatedKeys.push(key);
            }
          },
        });
      }
    }
  }

  public getErrors():any {
    return this.errors;
  }

  public setData(data:any):void {
    for (let key in data) {
      if (this.data[key] !== data[key]) {
        this.data[key] = data[key];
        this.updatedKeys.push(key);
      }
    }
  }

  public validate(data:any=null):any {
    if (data === null) {
      data = this.data;
    }
    return true;
  }

  public diff(newData:any):any {
    // Use deep diff for update only new data
    return newData;
  }

  public save(newData:any):Promise<any> {
    let status = this.validate(newData)

    if (status === false) {
      throw new ValidationError('check this.jsonMsg', this.getErrors());
    }

    let cleanedData = this.diff(newData);
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");

    let token = localStorage.getItem('token');
    if (token !== null && token !== '') {
      myHeaders.append('Authorization', 'Bearer ' + token);
    }

    var myRequest = new Request(this.getURL(), {
      method: this.method,
      body: JSON.stringify(cleanedData),
      headers: myHeaders,
      // mode: 'cors',
      cache: 'default'
    });

    return fetch(myRequest).then((response) => {
      if (response.ok) {
        // this.setData(cleanedData);
        return response.json();
      } else {
        let contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          throw new ValidationError('check this.jsonMsg', {'field1': ['error1', 'error2']});
          /*
          response.json().then((errors) => {
            this.errors = errors;
            throw new ValidationError('error name');
          });
           */
        } else {
          throw response.statusText;
        }
      }
    });
  }

  public getURL():string {
    if (this.data.id) {
      return this.baseUrl + '/' + this.data.id;
    }
    return this.baseUrl;
  }

  public toJSON():Object {
    let data = Object.assign({}, this.data); 
    return data;
  }

  /*
  save(data={}) {
    let patchData = {};
    this.data = Object.assign(this.data, data);

    if(this.data.id !== null) {
      let d = deepDiff(this.data, this.oldData);
      _(d).forEach((el, i) => {
        if(el.kind == 'E' || el.kind == 'A') {
          patchData[el.path[0]] = newData[el.path[0]];
          if(this.fields[el.path[0]] && this.fields[el.path[0]].hasOwnProperty('dependies')) {
            this.fields[el.path[0]].dependies.forEach((dep, index) => {
              patchData[dep] = newData[dep];
            });
          }
        } else if(el.kind == 'N' && newData.hasOwnProperty(el.path[0])) {
          // In case if we delete data that was in the model
          var newArr = [];
          newData[el.path[0]].forEach((arr, i) => {
            newArr.push(arr);
          });
          patchData[el.path[0]] = newArr;
          if(this.fields[el.path[0]] && this.fields[el.path[0]].hasOwnProperty('dependies')) {
            this.fields[el.path[0]].dependies.forEach((dep, index) => {
              patchData[dep] = newData[dep];
            });
          }
        }
      });
    } else {
      patchData = this.data;
    }

    api.makeRequest(this.getURL(), this.method, patchData);
  }
  */

  get():any {
    api.makeRequest(
      this.getURL(),
      'GET',
    ).then((data:any) => {
      debugger;
      this.data = data;
    });
  }
}
