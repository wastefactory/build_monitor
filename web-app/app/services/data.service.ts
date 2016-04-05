import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';

@Injectable()
export class DataService {
  constructor( public http: Http ) {}

  getJobs(){
	let url = 'app/components/dashboard/jobs.json';

	return this.http.get(url)
		.map( (responseData) => {
			return responseData.json();
		})

  }
}
