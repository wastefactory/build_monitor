import 'rxjs/add/operator/map';

import {bootstrap} from 'angular2/platform/browser';
import {provide} from 'angular2/core';
import {RequestOptions, RequestMethod, Headers, HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/dashboard/app.component';


class MyOptions extends RequestOptions {
  constructor() { 
    super({ 
      method: RequestMethod.Get,																																																														
      headers: new Headers({
        'Access-Control-Allow-Origin': '*'
      })
    });
  }
}

bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  provide(RequestOptions, {useClass: MyOptions})
])
.catch(err => console.error(err));