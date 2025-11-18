import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import aulas from '../../../assets/data/aulas/aulas.json';
import { RouterLink, Router } from '@angular/router';
import { EncomendasService } from '../../services/encomendas.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './aulas.html',
  styleUrls: ['./aulas.css'],
})
export class Aulas {
  listaAulas = aulas;

  constructor(
    private encomendasService: EncomendasService,
    private notificacao: NotificacaoService,
    private router: Router,
  ) { }

  comprarAula(aula: any) {
    this.encomendasService.adicionar({
      id: aula.id,
      nome: aula.titulo,
      imagem: aula.imagem || 'assets/image/imagem-404.png',
      preco: `R$ ${aula.preco.toFixed(2).replace('.', ',')}`,
      tipo: 'aula',
    });

    this.notificacao.notificar(`Aula "${aula.titulo}" adicionada às encomendas!`);

    // Navega para encomendas guardando de onde veio (aulas)
    this.router.navigate(['/encomendas'], {
      state: {
        from: this.router.url,
      },
    });
  }
}
