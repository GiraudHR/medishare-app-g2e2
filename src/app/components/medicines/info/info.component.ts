// components/info/medicine-info/medicine-info.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface InfoSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
  tips?: string[];
  warning?: boolean;
}

interface CollectionCenter {
  name: string;
  type: 'pharmacy' | 'hospital' | 'singrem';
  address: string;
  schedule: string;
  phone?: string;
  website?: string;
}

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent implements OnInit {
  activeSection = 'caducidad';
  
  infoSections: InfoSection[] = [
    {
      id: 'caducidad',
      title: 'Medicamentos Caducados',
      icon: '⚠️',
      warning: true,
      content: [
        'Los medicamentos caducados pueden perder su eficacia y en algunos casos volverse tóxicos.',
        'Nunca uses medicamentos después de su fecha de vencimiento, incluso si parecen estar en buen estado.',
        'La degradación de los principios activos puede generar compuestos nocivos para la salud.',
        'Algunos medicamentos como insulina, antibióticos y medicamentos líquidos son especialmente peligrosos al caducar.'
      ],
      tips: [
        'Revisa regularmente tu botiquín doméstico',
        'Organiza los medicamentos por fecha de vencimiento',
        'Usa primero los que vencen más pronto',
        'Mantén un registro de fechas de caducidad'
      ]
    },
    {
      id: 'almacenamiento',
      title: 'Almacenamiento Adecuado',
      icon: '🏠',
      content: [
        'El almacenamiento inadecuado puede acelerar la degradación de los medicamentos.',
        'La humedad, temperatura y luz pueden afectar la estabilidad de los fármacos.',
        'Algunos medicamentos requieren refrigeración para mantener su eficacia.',
        'Los cambios de temperatura pueden alterar la composición química de los medicamentos.'
      ],
      tips: [
        'Almacena en lugar fresco y seco',
        'Evita el baño y la cocina',
        'Mantén en envases originales',
        'Protege de la luz directa',
        'Respeta las condiciones de refrigeración'
      ]
    },
    {
      id: 'disposicion',
      title: 'Disposición Responsable',
      icon: '♻️',
      content: [
        'Nunca deseches medicamentos en la basura común o el drenaje.',
        'Los fármacos en el medio ambiente pueden contaminar el agua y suelo.',
        'Los residuos farmacéuticos afectan la vida acuática y pueden generar resistencia antimicrobiana.',
        'SINGREM (Sistema Nacional de Gestión de Residuos de Envases y Medicamentos) es la entidad oficial en México.'
      ],
      tips: [
        'Lleva medicamentos caducados a puntos SINGREM',
        'Utiliza farmacias con programas de recolección',
        'Participa en jornadas de acopio municipales',
        'Educa a tu familia sobre disposición responsable'
      ]
    },
    {
      id: 'riesgos',
      title: 'Riesgos Ambientales',
      icon: '🌍',
      warning: true,
      content: [
        'Los medicamentos desechados incorrectamente contaminan fuentes de agua.',
        'Los antibióticos en el ambiente contribuyen a la resistencia antimicrobiana.',
        'Los estrógenos sintéticos afectan la reproducción de peces y vida acuática.',
        'Los analgésicos pueden causar daño renal en la fauna silvestre.'
      ],
      tips: [
        'Usa solo la cantidad necesaria de medicamentos',
        'No compres medicamentos en exceso',
        'Completa siempre los tratamientos antibióticos',
        'Participa en programas de economía circular farmacéutica'
      ]
    }
  ];

  collectionCenters: CollectionCenter[] = [
    {
      name: 'Farmacia del Ahorro',
      type: 'pharmacy',
      address: 'Múltiples sucursales en la República Mexicana',
      schedule: 'Horario de farmacia',
      website: 'farmaciasdelahorro.mx'
    },
    {
      name: 'Farmacias Similares',
      type: 'pharmacy',
      address: 'Sucursales participantes',
      schedule: 'Lunes a Domingo',
      website: 'farmaciasimilares.com'
    },
    {
      name: 'Hospital General',
      type: 'hospital',
      address: 'Consultar hospital más cercano',
      schedule: '24 horas',
      phone: 'Contactar directamente'
    },
    {
      name: 'Centros SINGREM',
      type: 'singrem',
      address: 'Ubicaciones autorizadas',
      schedule: 'Consultar en línea',
      website: 'singrem.org.mx'
    }
  ];

  statistics = [
    {
      icon: '📊',
      number: '15,000',
      unit: 'toneladas',
      description: 'de residuos farmacéuticos se generan anualmente en México'
    },
    {
      icon: '💧',
      number: '80%',
      unit: 'de aguas',
      description: 'residuales contienen trazas de medicamentos'
    },
    {
      icon: '🦠',
      number: '700,000',
      unit: 'muertes',
      description: 'anuales por resistencia antimicrobiana a nivel mundial'
    },
    {
      icon: '♻️',
      number: '5%',
      unit: 'solamente',
      description: 'de medicamentos se disponen correctamente en México'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Scroll al inicio de la página
    window.scrollTo(0, 0);
  }

  setActiveSection(sectionId: string): void {
    this.activeSection = sectionId;
    
    // Scroll suave a la sección
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  getActiveSection(): InfoSection | undefined {
    return this.infoSections.find(section => section.id === this.activeSection);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToDonateMedicine(): void {
    this.router.navigate(['/donate-medicine']);
  }

  openExternalLink(url: string): void {
    window.open(`https://${url}`, '_blank');
  }
}
