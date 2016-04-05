import {Component, OnInit} from 'angular2/core';
import {DataService} from '../../services/data.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-app',
  templateUrl:'app/components/dashboard/view.html',
  providers: [DataService]
})

export class AppComponent implements OnInit {
  title = 'Nucleus Build Status';
  jobs = [];

  constructor( private _DataService: DataService ) { }

  getJobs() {
    this._DataService.getJobs()
      .subscribe(res => this.jobs = res.jobs);
  }

  ngOnInit() {
    /*Observable.interval(1000)
      .map((x) => x+1)
      .subscribe((x) => {
        this.getJobs();
      });*/

    this.getJobs();
  }
}
