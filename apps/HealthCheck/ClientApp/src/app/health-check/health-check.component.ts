import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.css'],
})
export class HealthCheckComponent {
  public result!: Result;
  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
  ) {}

  ngOnInit() {
    this.http.get<Result>(this.baseUrl + 'health').subscribe(
      (result) => {
        this.result = result;
      },
      (error) => console.error(error),
    );
  }
}

interface Result {
  totalStatus: string;
  totalResponseTime: number;
  checks: Check[];
}
interface Check {
  name: string;
  status: string;
  responseTime: number;
  description: string;
}
