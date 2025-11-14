import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { EncomendasService, ItemCarrinho } from '../../services/encomendas.service';
import { NotificacaoService } from '../../services/notificacao.service';

@Component({
  selector: 'app-encomendas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './encomendas.html',
  styleUrls: ['./encomendas.css'],
})
export class Encomendas implements OnInit, OnDestroy {
  itens: ItemCarrinho[] = [];
  private sub?: Subscription;

  constructor(
    private encomendasService: EncomendasService,
    private notificacao: NotificacaoService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.sub = this.encomendasService.carrinho$.subscribe((itens) => {
      this.itens = itens;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  aumentar(id: string | number): void {
    this.encomendasService.aumentar(id);
  }

  diminuir(id: string | number): void {
    this.encomendasService.diminuir(id);
  }

  remover(id: string | number): void {
    this.encomendasService.remover(id);
    this.notificacao.notificar('Item removido!');
  }

  limpar(): void {
    this.encomendasService.limpar();
    this.notificacao.notificar('Todas as encomendas foram limpas!');
  }

  abrirCustomizacao(item: ItemCarrinho): void {
    if (!item) return;
    this.router.navigate(['/customizar', item.id], {
      queryParams: { tipo: item.tipo || 'outro' },
    });
  }

  ocultarImagem(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/image/imagem-404.png';
  }

  get total(): string {
    return this.encomendasService.getTotalPreco();
  }

  temCoresSelecionadas(customizacao: any): boolean {
    return !!(customizacao?.coresSelecionadas && Object.keys(customizacao.coresSelecionadas).length > 0);
  }

  temMedidas(customizacao: any): boolean {
    return !!(customizacao?.medidas && Object.keys(customizacao.medidas).length > 0);
  }

  temObservacoes(customizacao: any): boolean {
    return !!(customizacao?.observacoes && customizacao.observacoes.trim() !== '');
  }

  asKeyValue(obj: any): { key: string; value: any }[] {
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  voltar(): void {
    const state: any = history.state;

    if (state?.voltarParaPeca) {
      this.router.navigateByUrl(state.voltarParaPeca, {
        state: {
          tamanhoSelecionado: state?.tamanhoSelecionado
        }
      });
      return;
    }

    this.location.back();
  }

  formatKey(key: string | unknown): string {
    const safeKey = typeof key === 'string' ? key : '';
    return safeKey.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
