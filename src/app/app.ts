import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  readonly title = signal('Vane Alves Crochê');

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.initialNavigation();
  }
}
