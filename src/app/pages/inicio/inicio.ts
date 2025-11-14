import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import pecas from '../../../assets/data/pecas/pecas.json';

interface Categoria {
  nome: string;
  imagem: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class Inicio {
  categorias: Categoria[] = [];

  constructor(private router: Router) {
    this.categorias = pecas
      .filter((c: any) => !!c?.categoria)
      .map((c: any) => ({
        nome: c.categoria,
        imagem: this.definirImagemCategoria(c.categoria),
      }));
  }

  definirImagemCategoria(categoria: string | undefined): string {
    if (!categoria) return 'assets/image/imagem-404.jpg';

    const base = 'assets/image/pecas/';
    switch (categoria.toLowerCase()) {
      case 'acessórios':
        return base + 'acessorios/bolsa1.jpg';
      case 'decoração':
        return base + 'decoracao/sousplat1.jpg';
      case 'vestuário':
        return base + 'vestuario/blusa1.jpg';
      case 'infantil':
        return base + 'infantil/bebe1.jpg';
      case 'customizados':
        return base + 'customizados/customizado1.jpg';
      default:
        return base + 'imagem-404.jpg';
    }
  }

  abrirCategoria(categoria: string): void {
    this.router.navigate(['/pecas'], { queryParams: { categoria } });
  }
}
