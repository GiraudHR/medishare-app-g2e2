import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MedicineService, Medicine, MedicineRequest } from '../../services/medicine.service';
import { CommonModule } from '@angular/common';

interface DashboardStats {
  totalDonations: number;
  totalRequests: number;
  totalPoints: number;
  completedExchanges: number;
}

interface RecentActivity {
  type: 'donation' | 'request' | 'exchange';
  title: string;
  description: string;
  date: string;
  status: string;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  currentUser: User | null = null;
  stats: DashboardStats = {
    totalDonations: 0,
    totalRequests: 0,
    totalPoints: 0,
    completedExchanges: 0
  };
  recentMedicines: Medicine[] = [];
  recentActivity: RecentActivity[] = [];
  expiringMedicines: Medicine[] = [];
  loading = true;
  error = '';

  constructor(
    private authService: AuthService,
    private medicineService: MedicineService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;

      // Cargar todas las estadísticas en paralelo
      /*const [stats, donations, requests] = await Promise.all([
        this.medicineService.getUserStats().toPromise(),
        this.medicineService.getMyDonations().toPromise(),
        this.medicineService.getRequestsForMyDonations().toPromise()
      ]);*/


      /*if (stats) {
        this.stats = stats;
      }*/
      this.stats = {
        totalDonations: 1,
        totalRequests: 1,
        totalPoints: 200,
        completedExchanges: 1
      }

      const donations = [
        {
          id: "asdf",
          commercialName: "Aspirina",
          quantity: 2,
          unitType: "Tableta",
          createdAt: "",
          status: "available",
          activePrinciple: "principio activo",
          expirationDate: "11/05/30",
          imageUrl: "",
          pointsValue: 200,
          laboratory: "",
          donorName: "nombre donador",
          category: "categoria",
          description: "descripcion"
        }/*, {
          id: "asdf",
          commercialName: "Aspirina",
          quantity: 2,
          unitType: 2,
          createdAt: "",
          status: "",
          activePrinciple: "principio activo",
          expirationDate: "11/05/30",
          imageUrl: "",
          pointsValue: 200,
          laboratory: "",
          donorName: "nombre donador",
          category: "categoria",
          description: "descripcion"
        }*/
      ]


      if (donations) {
        this.recentMedicines = donations.slice(0, 5); // Últimas 5 donaciones
        this.expiringMedicines = donations
          .filter(m => this.isDaySoon(m.expirationDate, 90)) // Expiran en 90 días
          .slice(0, 3);
      }

      this.generateRecentActivity();
      this.loading = false;

    } catch (error) {
      this.error = 'Error al cargar los datos del dashboard';
      this.loading = false;
    }
  }

  generateRecentActivity(): void {
    const activities: RecentActivity[] = [];

    // Agregar donaciones recientes
    this.recentMedicines.forEach(medicine => {
      activities.push({
        type: 'donation',
        title: `Donación: ${medicine.commercialName}`,
        description: `Has donado ${medicine.quantity} Tabletas`,
        date: medicine.createdAt,
        status: medicine.status,
        icon: '💊',
        color: '#38a169'
      });
    });

    // Ordenar por fecha y tomar los 8 más recientes
    this.recentActivity = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }

  isDaySoon(dateString: string, days: number): boolean {
    const expirationDate = new Date(dateString);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days && diffDays > 0;
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? 'Hace 1 minuto' : `Hace ${diffMinutes} minutos`;
    } else {
      return 'Hace un momento';
    }
  }

  getDaysUntilExpiration(dateString: string): number {
    const expirationDate = new Date(dateString);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'available': return '#38a169';
      case 'reserved': return '#d69e2e';
      case 'delivered': return '#3182ce';
      case 'pending': return '#ed8936';
      case 'approved': return '#38a169';
      case 'completed': return '#805ad5';
      default: return '#718096';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'available': return 'Disponible';
      case 'reserved': return 'Reservado';
      case 'delivered': return 'Entregado';
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'completed': return 'Completado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  }

  goToDonateMedicine(): void {
    this.router.navigate(['/donate-medicine']);
  }

  goToRequestMedicine(): void {
    this.router.navigate(['/request-medicine']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  viewMedicine(medicineId: string): void {
    // Implementar vista detallada del medicamento
    console.log('Ver medicamento:', medicineId);
  }

}
