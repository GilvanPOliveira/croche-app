import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

import { PecasService, Peca } from '../../services/pecas.service';
import { EncomendasService, ItemCarrinho } from '../../services/encomendas.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { LinhasService } from '../../services/linhas.service';
import { MedidasService, CampoMedida } from '../../services/medidas.service';

interface Cor {
  codigo: string;
  nome: string;
  imagem: string;
}

@Component({
  selector: 'app-customizacao',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customizacao.html',
  styleUrls: ['./customizacao.css'],
})
export class Customizacao implements OnInit {
  peca?: Peca;
  encomendaSelecionada: ItemCarrinho | null = null;

  carregando = true;
  erro = false;

  tamanhoSelecionado = '';
  medidasTamanhoSelecionado: any = {};

  tipoPeca = 'customizado';
  camposMedidas: CampoMedida[] = [];
  medidas: Record<string, string> = {};

  fabricantes: any[] = [];
  fabricanteSelecionado = '';
  linhasDisponiveis: string[] = [];
  linhaSelecionada = '';
  linhaDetalhe: any = null;

  selecaoPorLinha: Record<string, Cor[]> = {};

  observacoes = '';

  imagemPadrao = '/assets/image/imagem-404.png';
  imagemExibida = this.imagemPadrao;

  toggleCores = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pecasService: PecasService,
    private encomendasService: EncomendasService,
    private notificacao: NotificacaoService,
    private linhasService: LinhasService,
    private medidasService: MedidasService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const state = history.state || {};

    const encomendaId =
      state.encomendaId ||
      state.idEncomenda ||
      this.route.snapshot.paramMap.get('idEncomenda');

    if (encomendaId) {
      const encomenda = this.encomendasService.getById(encomendaId);
      if (encomenda) {
        this.encomendaSelecionada = encomenda;
        this.imagemExibida = this.normalizarImagemEncomenda(encomenda.imagem);
      }
    }

    this.linhasService.getFabricantes().subscribe((fab) => {
      this.fabricantes = fab || [];
    });

    const params = this.route.snapshot.paramMap;
    const folder = params.get('folder');
    const file = params.get('file');
    const id = Number(params.get('id'));

    const pecaState: Peca | undefined = state.peca;

    if (pecaState) {
      this.peca = pecaState;
      this.aposCarregarPeca();
      return;
    }

    if (folder && file && !isNaN(id)) {
      const arquivo = `${folder}/${file}.json`;

      this.pecasService.getPecasPorTipo(arquivo).subscribe({
        next: (lista) => {
          this.peca = lista.find((p) => p.id === id);
          if (!this.peca) {
            this.erro = true;
            this.carregando = false;
            return;
          }
          this.aposCarregarPeca();
        },
        error: () => {
          this.erro = true;
          this.carregando = false;
        },
      });

      return;
    }

    if (this.encomendaSelecionada) {
      this.carregando = false;
      return;
    }

    this.erro = true;
    this.carregando = false;
  }

  private aposCarregarPeca(): void {
    if (!this.peca) {
      this.carregando = false;
      return;
    }

    this.imagemExibida = this.peca.imagem || this.imagemPadrao;

    const tamanhos = Object.keys(this.peca.tamanhos || {});
    this.tamanhoSelecionado = tamanhos[0] || '';

    this.atualizarMedidasTamanho();

    const tipoBase = (this.peca.tipo || 'customizado').toLowerCase();
    this.tipoPeca = tipoBase;

    this.medidasService.getMedidasPorTipo(tipoBase).subscribe((campos) => {
      this.camposMedidas = campos || [];

      this.medidas = {
        ...this.medidasTamanhoSelecionado
      };
    });

    this.carregando = false;
  }

  selecionarTamanho(t: string) {
    this.tamanhoSelecionado = t;
    this.atualizarMedidasTamanho();

    this.medidas = {
      ...this.medidasTamanhoSelecionado
    };
  }

  private atualizarMedidasTamanho() {
    this.medidasTamanhoSelecionado =
      this.peca?.tamanhos?.[this.tamanhoSelecionado]?.medidas || {};
  }

  selecionarFabricante(slug: string) {
    const fab = this.fabricantes.find((f) => f.slug === slug);
    if (!fab) return;

    this.fabricanteSelecionado = slug;
    this.linhasDisponiveis = fab.linhas || [];
    this.linhaSelecionada = '';
    this.linhaDetalhe = null;
  }

  selecionarLinha(linha: string) {
    this.linhaSelecionada = linha;
    this.linhaDetalhe = null;

    this.linhasService.getLinha(this.fabricanteSelecionado, linha).subscribe((detalhe) => {
      this.linhaDetalhe = detalhe;
      if (!this.selecaoPorLinha[linha]) this.selecaoPorLinha[linha] = [];
    });
  }

  get coresSelecionadas(): Cor[] {
    return this.selecaoPorLinha[this.linhaSelecionada] || [];
  }

  toggleCor(cor: Cor) {
    const lista = this.selecaoPorLinha[this.linhaSelecionada] || [];
    const i = lista.findIndex((c) => c.codigo === cor.codigo);

    if (i >= 0) lista.splice(i, 1);
    else lista.push(cor);

    this.selecaoPorLinha[this.linhaSelecionada] = [...lista];
  }

  ehCorSelecionada(cor: Cor): boolean {
    const lista = this.selecaoPorLinha[this.linhaSelecionada] || [];
    return lista.some((c) => c.codigo === cor.codigo);
  }


  limparLinha(linha: string) {
    delete this.selecaoPorLinha[linha];
  }

  limparCor(linha: string, cor: Cor) {
    const lista = this.selecaoPorLinha[linha] || [];
    this.selecaoPorLinha[linha] = lista.filter((c) => c.codigo !== cor.codigo);
  }

  get linhasComSelecao(): string[] {
    return Object.keys(this.selecaoPorLinha).filter(
      (key) => this.selecaoPorLinha[key]?.length
    );
  }

  salvarCustomizacao() {
    if (!this.peca) return;

    const tamanho = this.tamanhoSelecionado;

    const dados = {
      id: this.peca.id,
      nome: `${this.peca.nome} (${tamanho})`,
      imagem: this.imagemExibida,
      preco: this.peca.tamanhos?.[tamanho]?.preco || 'Sob consulta',
      tipo: this.peca.tipo,

      medidas: this.medidas,
      customizacao: {
        tamanho,
        medidasPersonalizadas: this.medidas,
        fabricante: this.fabricanteSelecionado,
        linha: this.linhaSelecionada,
        coresSelecionadas: this.selecaoPorLinha,
        observacoes: this.observacoes
      }
    };

    this.encomendasService.salvarCustomizacao(null, dados);
    this.notificacao.notificar('Customização salva com sucesso!');
    this.router.navigate(['/encomendas']);
  }

  voltar() {
    this.location.back();
  }

  ocultarImagem(event: Event) {
    (event.target as HTMLImageElement).src = this.imagemPadrao;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.imagemPadrao;
  }

  private normalizarImagemEncomenda(imagem: string): string {
    if (!imagem) return this.imagemPadrao;
    if (imagem.startsWith('/assets/')) return imagem;
    if (imagem.includes('/assets/pecas/')) return imagem;
    return `/assets/pecas/${imagem.replace(/^\/+/, '')}`;
  }

  limitarObservacoes() {
    if (this.observacoes.length > 1500) {
      this.observacoes = this.observacoes.substring(0, 1500);
    }
  }

  bloquearColagem(event: ClipboardEvent) {
    const texto = event.clipboardData?.getData('text') || '';
    const total = this.observacoes.length + texto.length;

    if (total > 1500) {
      event.preventDefault();
      const restante = 1500 - this.observacoes.length;

      if (restante > 0) {
        this.observacoes += texto.substring(0, restante);
      }
    }
  }
}
