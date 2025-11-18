import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PecasService, Peca } from '../../services/pecas.service';

@Component({
  selector: 'app-pecas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pecas.html',
  styleUrls: ['./pecas.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pecas implements OnInit {
  pecas: Peca[] = [];
  pecasFiltradas: Peca[] = [];

  categorias: string[] = [];
  tiposDisponiveis: string[] = [];

  categoriaSelecionada: string | null = null;
  tipoSelecionado: string | null = null;

  carregando = true;
  erro = false;

  constructor(
    private pecasService: PecasService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.pecasService.getTodasAsPecas().subscribe({
      next: (pecas) => {
        this.pecas = pecas;
        this.pecasFiltradas = [...pecas];

        this.montarCategorias();
        this.aplicarFiltroInicial();

        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar peças:', err);
        this.erro = true;
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  private montarCategorias(): void {
    const set = new Set(this.pecas.map((p) => p.categoria));
    this.categorias = Array.from(set).sort();
  }

  private montarTipos(): void {
    if (!this.categoriaSelecionada) {
      this.tiposDisponiveis = [];
      return;
    }

    const tipos = new Set(
      this.pecas
        .filter(
          (p) =>
            p.categoria.toLowerCase() ===
            this.categoriaSelecionada!.toLowerCase()
        )
        .map((p) => p.tipo)
    );

    this.tiposDisponiveis = Array.from(tipos).sort();
  }

  private aplicarFiltroInicial(): void {
    this.route.queryParams.subscribe((params) => {
      this.categoriaSelecionada = params['categoria'] || null;
      this.tipoSelecionado = params['tipo'] || null;

      this.montarTipos();
      this.filtrarPecas();

      this.cdr.markForCheck();
    });
  }

  filtrarPecas(): void {
    let lista = [...this.pecas];

    if (this.categoriaSelecionada) {
      lista = lista.filter(
        (p) =>
          p.categoria.toLowerCase() ===
          this.categoriaSelecionada!.toLowerCase()
      );
    }

    if (this.tipoSelecionado) {
      lista = lista.filter(
        (p) => p.tipo.toLowerCase() === this.tipoSelecionado!.toLowerCase()
      );
    }

    this.pecasFiltradas = lista;
    this.cdr.markForCheck();
  }

  selecionarCategoria(cat: string | null): void {
    this.categoriaSelecionada = cat;
    this.tipoSelecionado = null;
    this.montarTipos();
    this.filtrarPecas();
  }

  selecionarTipo(tipo: string | null): void {
    this.tipoSelecionado = tipo;
    this.filtrarPecas();
  }

  limparFiltro(): void {
    this.categoriaSelecionada = null;
    this.tipoSelecionado = null;
    this.tiposDisponiveis = [];
    this.pecasFiltradas = [...this.pecas];
    this.cdr.markForCheck();
  }

  isAtiva(cat: string): boolean {
    return (
      !!this.categoriaSelecionada &&
      this.categoriaSelecionada.toLowerCase() === cat.toLowerCase()
    );
  }

  isTipoAtivo(tipo: string): boolean {
    return (
      !!this.tipoSelecionado &&
      this.tipoSelecionado.toLowerCase() === tipo.toLowerCase()
    );
  }

  verDetalhes(peca: Peca): void {
    const [folder, file] = peca.arquivo.replace('.json', '').split('/');

    this.router.navigate(
      ['/pecas', folder, file, peca.slug, peca.id],
      {
        state: {
          voltarParaPecas: {
            categoria: this.categoriaSelecionada,
            tipo: this.tipoSelecionado,
          }
        }
      }
    );
  }
}
