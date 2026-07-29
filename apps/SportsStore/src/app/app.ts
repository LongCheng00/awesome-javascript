import { Component, signal } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [AppComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SportsStore');
}
