import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CampoMedida {
  key: string;
  label: string;
  unidade: string;
}

@Injectable({ providedIn: 'root' })
export class MedidasService {
  private medidasPorTipo: Record<string, CampoMedida[]> = {
    bandana: [
      { key: 'largura', label: 'Largura', unidade: 'cm' },
      { key: 'altura', label: 'Altura', unidade: 'cm' },
    ],
    bebe: [
      { key: 'idade', label: 'Idade (faixa etária)', unidade: 'meses' },
      { key: 'busto', label: 'Busto', unidade: 'cm' },
      { key: 'comprimento', label: 'Comprimento total', unidade: 'cm' },
      { key: 'manga', label: 'Comprimento da manga', unidade: 'cm' },
    ],
    blusa: [
      { key: 'busto', label: 'Busto', unidade: 'cm' },
      { key: 'cintura', label: 'Cintura', unidade: 'cm' },
      { key: 'quadril', label: 'Quadril', unidade: 'cm' },
      { key: 'comprimento', label: 'Comprimento', unidade: 'cm' },
      { key: 'manga', label: 'Manga', unidade: 'cm' },
    ],
    bolsa: [
      { key: 'largura', label: 'Largura', unidade: 'cm' },
      { key: 'altura', label: 'Altura', unidade: 'cm' },
      { key: 'profundidade', label: 'Profundidade', unidade: 'cm' },
    ],
    borboleta: [
      { key: 'largura', label: 'Largura (asa a asa)', unidade: 'cm' },
      { key: 'altura', label: 'Altura', unidade: 'cm' },
    ],
    brinco: [
      { key: 'diâmetro', label: 'Diâmetro', unidade: 'cm' },
      { key: 'comprimento', label: 'Comprimento total', unidade: 'cm' },
    ],
    colar: [
      { key: 'comprimento', label: 'Comprimento', unidade: 'cm' },
    ],
    colete: [
      { key: 'busto', label: 'Busto', unidade: 'cm' },
      { key: 'comprimento', label: 'Comprimento', unidade: 'cm' },
    ],
    vestido: [
      { key: 'busto', label: 'Busto', unidade: 'cm' },
      { key: 'cintura', label: 'Cintura', unidade: 'cm' },
      { key: 'quadril', label: 'Quadril', unidade: 'cm' },
      { key: 'comprimento', label: 'Comprimento total', unidade: 'cm' },
    ],
    tapete: [
      { key: 'comprimento', label: 'Comprimento', unidade: 'cm' },
      { key: 'largura', label: 'Largura', unidade: 'cm' },
    ],
    sousplat: [
      { key: 'diâmetro', label: 'Diâmetro', unidade: 'cm' },
    ],
    trilho: [
      { key: 'comprimento', label: 'Comprimento total', unidade: 'cm' },
      { key: 'largura', label: 'Largura', unidade: 'cm' },
    ],
    customizado: [
      { key: 'ajuste', label: 'Ajuste sob medida', unidade: '-' },
    ],
    rede: [
      { key: 'comprimento', label: 'Comprimento', unidade: 'm' },
      { key: 'largura', label: 'Largura', unidade: 'm' },
    ],
  };

  getMedidasPorTipo(tipo: string): Observable<CampoMedida[]> {
    if (!tipo) return of([]);
    const key = tipo.toLowerCase().replace(/s$/, ''); 
    return of(this.medidasPorTipo[key] || []);
  }
}
