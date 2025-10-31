import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MedService } from '../../services/med-service';
import { Med } from '../../models/med';

@Component({
  selector: 'app-list-meds',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './list-meds.html',
  styleUrls: ['./list-meds.css']
})
export class ListMeds {

  featuredProducts = [
    {
      title: 'Kit de Primeros Auxilios para el Hogar',
      description: 'Suministros esenciales para uso en casa.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIa58tI7JOzqdg8Z183V87LPdwMzMQDMWbQZjo19ixQAUFbvqfH-uXrEnIucrJ0mV-uWM7UeRM7U22jgMl7J3UZAcCgiKYj8lqSADG1OjzBBxDxL-29aoF44TLr8Zn8G-JlpR68uWPxikIY-TFoJ6jNI6SG-Fq5t04vi-JnOQd0Hn_-IX-KHVGAViXGy73AOXKj_axem5xb5RZ307H1irPFVwgCoTDPNgo9iTxYSweITRnl0xpinLaFdRKzTXLhzFup9sEGgy8AHIK',
      visible: true
    },
    {
      title: 'Kit de Viaje',
      description: 'Compacto y portátil para tus aventuras.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPEo9ex3R4FIuaXgN0E1fxqWkXjWrTZNcIdUxFSTfW6Hi5nzgd2WBmfp2l5wxZ6aTYXPGZMoE7YjWw2z-fMuyiBZLpTs75myoMHu9t1Bo9su7flyfdiy48hVIziCePL9F1LiaFX9fEbprvq9sV-w1o1yqGDhyjNKKmWDbNO4EtP_myeHaHIKdxVgITgKSa09wd3ZCduyufXkaWn5W_-EdZO_erOAIbYIYMi3946Dz5uWY3baoaMAg2Af7R8ONfKODwUku4kewEHiJv',
      visible: true
    },
    {
      title: 'Kit para Aventuras al Aire Libre',
      description: 'Ideal para caminatas y campamentos.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBOgOiCZaw9xjFooizzYRfdUB7bxv7bKRHn-JkTI-_LpWepsRJmU0SmhsBVc1EBBVQieUIJrdBI6z6N1TiTfnngFK-zc3Poh8lyr53Y_k0qCp7exvaLx5mHMOoCj5hov46Nva_3YI_3goJ72HkF0L4ycPxR4IEsJizTQ4XKuj8POCansMKlPRwN9E4eiz5n1or3a19IvdKwmuV4WnD0QvbIL1KDCtCQwRHKz_5tA4RCiqqnJ-xPL2w9IksKVv1xuEeXZH3nVDcYby6',
      visible: true
    }
  ];

  constructor(private medService: MedService) { }

  toggleVisibility(product: any): void {
    product.visible = !product.visible;
  }

  get allMeds(): Med[] {
    return this.medService.getAllMeds();
  }

  get topFiveByQuantity(): Med[] {
    return [...this.allMeds]
      .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0))
      .slice(0, 5);
  }

  get recentFiveByDate(): Med[] {
    return [...this.allMeds]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }
}
