import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nao-encontrada',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nao-encontrada.html',
  styleUrls: ['./nao-encontrada.css'],
})
export class NaoEncontrada {
  constructor(private location: Location) {}

  voltar(): void {
    this.location.back();
  }
}
