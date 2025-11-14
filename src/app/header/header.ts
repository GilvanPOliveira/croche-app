import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { EncomendasService } from '../services/encomendas.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header implements OnInit {
  contador = 0;

  constructor(private encomendasService: EncomendasService) {}

  ngOnInit(): void {
    this.encomendasService.carrinho$.subscribe(() => {
      this.contador = this.encomendasService.getQuantidadeTotal();
    });
  }
}
