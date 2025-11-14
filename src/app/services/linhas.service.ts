import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LinhasService {
  private readonly basePath = '/assets/data/linhas/';
  private cache = new Map<string, any>();

  private readonly fileMap: Record<string, string> = {
    anne: 'anne',
    clea: 'clea',
    'cordone': 'cordone',
    'cordoné': 'cordone',
    'encanto slim': 'encantoSlim',
    encantoslim: 'encantoSlim',
    'bella fashion': 'bellaFashion',
    bellafashion: 'bellaFashion',
  };

  constructor(private http: HttpClient) {}

  getFabricantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.basePath}fabricantes.json`).pipe(
      catchError(() => of([]))
    );
  }

  private normalize(s: string): string {
    return (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
      .replace(/\s+/g, ' ')
      .trim();
  }

  private toAbsoluteAssets(p: string): string {
    if (!p) return '';
    const clean = p.replace(/^\.?\//, '').replace(/^src\//, '');
    return clean.startsWith('assets/') ? `/${clean}` : (clean.startsWith('/assets/') ? clean : `/assets/${clean}`);
  }

  getLinha(fabricante: string, linha: string): Observable<any | null> {
    if (!fabricante || !linha) return of(null);

    const fab = this.normalize(fabricante);        
    const linNorm = this.normalize(linha);           
    const linKey = this.fileMap[linNorm] || linNorm; 

    const cacheKey = `${fab}_${linKey}`;
    if (this.cache.has(cacheKey)) return of(this.cache.get(cacheKey));

    const url = `${this.basePath}${fab}/${linKey}.json`;

    return this.http.get<any>(url).pipe(
      map((dados) => {
        const catalogo = this.toAbsoluteAssets(dados.catalogo || '');
        const lista = (dados.cores || dados.Cores || []).map((c: any) => ({
          ...c,
          imagem: this.toAbsoluteAssets(c.imagem)
        }));
        const result = { ...dados, catalogo, cores: lista, nome: dados.linha || linha };
        this.cache.set(cacheKey, result);
        return result;
      }),
      catchError((err) => {
        console.error(`Erro ao carregar linha "${linha}" de "${fabricante}"`, err);
        return of(null);
      })
    );
  }
}
