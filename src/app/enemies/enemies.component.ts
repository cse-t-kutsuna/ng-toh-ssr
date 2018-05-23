import { Component, OnInit } from '@angular/core';

import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-enemies',
  templateUrl: './enemies.component.html',
  styleUrls: ['./enemies.component.css']
})
export class EnemiesComponent implements OnInit {
  enemies$: Observable<any[]>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.enemies$ = this.http.get<any[]>('http://localhost:4000/api/enemies');
  }
}
