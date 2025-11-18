import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { PecasService, Peca } from '../../../services/pecas.service';
import { EncomendasService } from '../../../services/encomendas.service';
import { NotificacaoService } from '../../../services/notificacao.service';

@Component({
  selector: 'app-peca-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './peca-detalhe.html',
  styleUrls: ['./peca-detalhe.css'],
})
export class PecaDetalhe implements OnInit, OnDestroy {
  peca?: Peca;
  pecasLista: Peca[] = [];
  indiceAtual = 0;
  carregando = true;
  erro = false;

  tamanhoSelecionado = '';
  imagemAtual = '';

  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pecasService: PecasService,
    private encomendasService: EncomendasService,
    private notificacao: NotificacaoService,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe(params => {
      const folder = params.get('folder');
      const file = params.get('file');
      const id = Number(params.get('id'));

      if (!folder || !file || isNaN(id)) {
        this.router.navigate(['/pecas']);
        return;
      }

      const arquivo = `${folder}/${file}.json`;

      this.pecasService.getPecasPorTipo(arquivo).subscribe(lista => {
        this.pecasLista = lista;
        this.carregarPeca(id);
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private carregarPeca(id: number) {
    const encontrada = this.pecasLista.find(p => p.id === id);

    if (!encontrada) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.peca = encontrada;
    this.imagemAtual = encontrada.imagem;

    this.indiceAtual = this.pecasLista.findIndex(p => p.id === id);

    const tamanhoEnviado = history.state?.tamanhoSelecionado;

    if (tamanhoEnviado && this.peca.tamanhos[tamanhoEnviado]) {
      this.tamanhoSelecionado = tamanhoEnviado;
    } else {
      this.carregarPrimeiroTamanho();
    }

    this.setSEO(encontrada);
    this.preloadVizinhas();

    this.carregando = false;
  }


  private carregarPrimeiroTamanho() {
    if (!this.peca?.tamanhos) return;

    const tamanhos = Object.keys(this.peca.tamanhos);
    this.tamanhoSelecionado = tamanhos[0] || '';
  }

  private setSEO(peca: Peca): void {
    const title = `${peca.nome} — Peças em Crochê | Vane Alves`;
    const desc =
      peca.descricao ||
      `Peça artesanal ${peca.nome} feita à mão em crochê. Veja detalhes, tamanhos e medidas.`;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: desc });
    this.meta.updateTag({ property: 'og:image', content: peca.imagem });
  }

  irParaAnterior() {
    if (this.indiceAtual === 0) return;

    const anterior = this.pecasLista[this.indiceAtual - 1];
    this.navegarPara(anterior);
  }

  irParaProxima() {
    if (this.indiceAtual >= this.pecasLista.length - 1) return;

    const proxima = this.pecasLista[this.indiceAtual + 1];
    this.navegarPara(proxima);
  }

  private navegarPara(peca: Peca) {
    const [folder, file] = peca.arquivo.replace('.json', '').split('/');

    this.router.navigate(['/pecas', folder, file, peca.slug, peca.id], {
      state: {
        voltarPara: history.state?.voltarPara || null
      }
    });
  }

  private preloadVizinhas() {
    const vizinhos = [this.indiceAtual - 1, this.indiceAtual + 1].filter(
      i => i >= 0 && i < this.pecasLista.length
    );

    vizinhos.forEach(i => {
      const img = new Image();
      img.src = this.pecasLista[i].imagem;
    });
  }

  selecionarTamanho(t: string) {
    this.tamanhoSelecionado = t;
  }

  adicionarEncomenda(): void {
    if (!this.peca) return;

    const tamanho = this.tamanhoSelecionado;
    const preco = this.peca.tamanhos?.[tamanho]?.preco || 'Sob consulta';

    this.encomendasService.adicionar({
      id: this.peca.id,
      nome: `${this.peca.nome} (${tamanho})`,
      imagem: this.peca.imagem,
      preco,
      tipo: this.peca.tipo,
      medidas: this.peca.tamanhos?.[tamanho]?.medidas || null,
    });

    this.notificacao.notificar(
      `"${this.peca.nome}" (${tamanho}) adicionada às encomendas!`
    );

    this.router.navigate(['/encomendas'], {
      state: {
        voltarPara: {
          from: this.router.url,
          query: {
            tamanho: this.tamanhoSelecionado
          }
        }
      }
    });
  }

  abrirCustomizacao() {
    if (!this.peca) return;

    const p = this.peca;
    const [folder, file] = p.arquivo.replace('.json', '').split('/');

    this.router.navigate(['/customizacao', folder, file, p.slug, p.id], {
      state: {
        peca: p,
        from: this.router.url
      }
    });
  }


  onImageError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = '/assets/image/imagem-404.png';
  }

  ordenarTamanhos = (a: any, b: any): number => {
    const ordem = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG', '3G', '4G'];
    return (ordem.indexOf(a.key) === -1 ? 999 : ordem.indexOf(a.key)) -
      (ordem.indexOf(b.key) === -1 ? 999 : ordem.indexOf(b.key));
  };

  voltar() {
    const voltarPara = history.state?.voltarParaPecas;

    if (voltarPara) {
      const query: any = {};

      if (voltarPara.categoria) query.categoria = voltarPara.categoria;
      if (voltarPara.tipo) query.tipo = voltarPara.tipo;

      this.router.navigate(['/pecas'], { queryParams: query });
      return;
    }

    this.router.navigate(['/pecas']);
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'ArrowLeft') this.irParaAnterior();
    else if (ev.key === 'ArrowRight') this.irParaProxima();
  }
}
