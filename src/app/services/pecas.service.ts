import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

export interface TamanhoInfo {
  medidas: any;
  preco: string;
}

export interface Peca {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  categoria: string;
  linhas: string[];
  agulha: string;
  tipo: string;
  tamanhos: Record<string, TamanhoInfo>;
  observacoes?: string;
  imagem: string;
  arquivo: string; 
}

@Injectable({
  providedIn: 'root',
})
export class PecasService {

  private readonly basePath = '/assets/data/pecas/';
  private cache = new Map<string, Peca[]>();
  private carregando$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  get carregando(): Observable<boolean> {
    return this.carregando$.asObservable();
  }

  private gerarSlug(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private normalizarImagem(path: string): string {
    return path
      .replace(/^src\//, '/')
      .replace(/^\/?assets\//, '/assets/')
      .replace(/^\/?/, '/');
  }

  getPecasPorTipo(arquivo: string): Observable<Peca[]> {

    if (this.cache.has(arquivo)) {
      return of(this.cache.get(arquivo)!);
    }

    const url = this.basePath + arquivo;

    this.carregando$.next(true);

    return this.http.get<any[]>(url).pipe(
      map((lista) =>
        lista.map((item) => ({
          ...item,
          slug: this.gerarSlug(item.nome),
          arquivo,
          imagem: this.normalizarImagem(item.imagem),
        }))
      ),
      tap((pecas) => {
        this.cache.set(arquivo, pecas);
        this.carregando$.next(false);
      }),
      catchError((err) => {
        console.error(`Erro ao carregar peças de ${arquivo}:`, err);
        this.carregando$.next(false);
        return of([]);
      })
    );
  }

  getCategorias(): Observable<any[]> {
    return this.http
      .get<any[]>(this.basePath + 'pecas.json')
      .pipe(catchError(() => of([])));
  }

  getTodasAsPecas(): Observable<Peca[]> {
    return this.getCategorias().pipe(
      switchMap((categorias) => {
        const arquivos = categorias.flatMap((cat) =>
          (cat.tipos || []).map((t: any) => t.arquivo)
        );

        if (!arquivos.length) return of([]);

        return forkJoin(arquivos.map((arq) => this.getPecasPorTipo(arq)));
      }),
      map((resultado) => resultado.flat())
    );
  }
}
