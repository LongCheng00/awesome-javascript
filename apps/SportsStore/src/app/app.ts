import { Component, signal } from '@angular/core';
import { AppModule } from './app.module';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [AppModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('SportsStore');
}
