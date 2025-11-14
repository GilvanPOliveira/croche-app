import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  id: string | number;
  nome: string;
  imagem: string;
  preco: string;
  quantidade: number;
  tipo?: string | null;
  medidas?: any;
  customizacao?: any;
}

@Injectable({
  providedIn: 'root',
})
export class EncomendasService {
  private itens: ItemCarrinho[] =
    JSON.parse(localStorage.getItem('encomendas') || '[]') || [];

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>(this.itens);
  carrinho$ = this.carrinhoSubject.asObservable();

  private atualizarEstado() {
    localStorage.setItem('encomendas', JSON.stringify(this.itens));
    this.carrinhoSubject.next([...this.itens]);
  }

  private gerarId(fixo?: string | number): string {
    if (fixo) return String(fixo);
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString();
  }

  adicionar(item: {
    id: string | number;
    nome: string;
    imagem: string;
    preco: string;
    tipo?: string | null;
    medidas?: any;
    customizacao?: any;
  }) {
    const existente = this.itens.find((p) => {
      const mesmasMedidas =
        JSON.stringify(p.medidas || null) === JSON.stringify(item.medidas || null);

      const mesmaCustom =
        JSON.stringify(p.customizacao || null) === JSON.stringify(item.customizacao || null);

      return (
        p.id === item.id &&
        (p.tipo ?? null) === (item.tipo ?? null) &&
        mesmasMedidas &&
        mesmaCustom
      );
    });

    if (existente) {
      existente.quantidade++;
      this.atualizarEstado();
      return;
    }

    const novoItem: ItemCarrinho = {
      id: item.customizacao ? this.gerarId(item.id) : item.id,
      nome: item.nome,
      imagem: item.imagem || 'assets/image/imagem-404.png',
      preco: item.preco || '0,00',
      tipo: item.tipo ?? null,

      quantidade: 1,
      medidas: item.medidas ?? null,
      customizacao: item.customizacao ?? null,
    };

    this.itens.push(novoItem);
    this.atualizarEstado();
  }

  remover(id: string | number) {
    this.itens = this.itens.filter((p) => String(p.id) !== String(id));
    this.atualizarEstado();
  }

  limpar() {
    this.itens = [];
    this.atualizarEstado();
  }

  aumentar(id: string | number) {
    const item = this.itens.find((p) => String(p.id) === String(id));
    if (item) {
      item.quantidade++;
      this.atualizarEstado();
    }
  }

  diminuir(id: string | number) {
    const item = this.itens.find((p) => String(p.id) === String(id));
    if (item) {
      if (item.quantidade > 1) item.quantidade--;
      else this.remover(id);
      this.atualizarEstado();
    }
  }

  getItens() {
    return this.itens;
  }

  getById(id: string | number) {
    return this.itens.find((i) => String(i.id) === String(id));
  }

  salvarCustomizacao(
    id: string | number | null,
    dados: Partial<ItemCarrinho> & Record<string, any>
  ) {
    if (id) {
      const existente = this.itens.find((p) => String(p.id) === String(id));

      if (existente) {
        existente.customizacao = dados.customizacao || existente.customizacao;
        existente.medidas = dados.medidas ?? existente.medidas;
        existente.nome = dados.nome ?? existente.nome;
        existente.preco = dados.preco ?? existente.preco;
        existente.imagem = dados.imagem ?? existente.imagem;
        existente.tipo = dados.tipo ?? existente.tipo;

        this.atualizarEstado();
        return;
      }
    }

    const idFixo =
      dados.tipo && dados.nome
        ? `${dados.tipo.toLowerCase()}-${dados.nome.toLowerCase().replace(/\s+/g, '-')}`
        : undefined;

    const novoItem: ItemCarrinho = {
      id: this.gerarId(idFixo),
      nome: dados.nome || 'Item Personalizado',
      imagem: dados.imagem || 'assets/image/imagem-404.png',
      preco: dados.preco || '0,00',
      tipo: dados.tipo ?? 'customizado',
      quantidade: 1,
      medidas: dados.medidas ?? null,
      customizacao: dados.customizacao ?? dados,
    };

    this.itens.push(novoItem);
    this.atualizarEstado();
  }

  getQuantidadeTotal() {
    return this.itens.reduce((total, p) => total + p.quantidade, 0);
  }

  getTotalPreco(): string {
    const soma = this.itens.reduce((acc, p) => {
      const precoNum = Number(
        (p.preco || '0').replace(/[^\d,]/g, '').replace(',', '.')
      );
      return acc + precoNum * p.quantidade;
    }, 0);

    return `R$ ${soma.toFixed(2).replace('.', ',')}`;
  }
}
