import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

type ContatoItem = {
  nome: string;
  icone: string;      
  descricao: string;
  link: string;        
  cor?: string;       
};

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contato.html',
  styleUrls: ['./contato.css'],
})
export class Contato {
  readonly contatos: ContatoItem[] = [
    {
      nome: 'Instagram',
      icone: 'fa-brands fa-instagram',
      descricao: 'Veja nossas postagens, novidades e trabalhos concluídos.',
      link: 'https://instagram.com/vacrochetando',
      cor: 'var(--color-instagram)',
    },
    {
      nome: 'WhatsApp',
      icone: 'fa-brands fa-whatsapp',
      descricao: 'Fale conosco diretamente para encomendas e dúvidas.',
      link: 'https://wa.me/5581988044995',
      cor: 'var(--color-whatsapp)',
    },
    {
      nome: 'YouTube',
      icone: 'fa-brands fa-youtube',
      descricao: 'Assista tutoriais, bastidores e novas ideias em crochê.',
      link: 'https://youtube.com/@vacrochetando0',
      cor: 'var(--color-error-bright)',
    },
    {
      nome: 'Aulas e Cursos',
      icone: 'fa-solid fa-chalkboard-user',
      descricao:
        'Aprenda crochê do zero ou aprimore suas técnicas com nossas aulas pagas e gratuitas.',
      link: '/aulas',
      cor: 'var(--color-primary)',
    },
  ];

  ehInterno(link: string): boolean {
    return !!link && link.startsWith('/');
  }

  trackByNome = (_: number, item: ContatoItem) => item.nome;
}
