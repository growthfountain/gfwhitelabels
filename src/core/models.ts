import api from 'src/core/api.ts';

declare var app:any;

interface IData { 
  id: number;
  [propName: string]: any;
}

interface IModel { 
  baseUrl:string;
  data:IData;
  fields:IData;
  method:string;
  [propName: string]: any;
}

export class Model {

  protected updatedKeys:string[] = [];

  baseUrl:string = null;
  data:IData;
  fields:IData;
  method:string = "POST";

  constructor(data:IData={id:null}, fields:IData={id:null}) {
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
    return {};
  }

  public save():any {
    /*
    return api.makeRequest(
        this.getURL(),
        this.method,
        this.data
    );
     */
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

  validate(data=null) {
    if(data === null) {
      data = this.data;
    } else {
      app.validate.validate()
    }
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

export class AnonymousUser extends Model {
  baseUrl:string = app.config.authServer + '/rest-auth/login';
  fields:any = {
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
};
