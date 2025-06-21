import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MedicineService, Medicine, MedicineCategory } from '../../../services/medicine.service';
import { AuthService, User } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-medicine',
  standalone: true,
        imports: [
          CommonModule,
          RouterModule,
          ReactiveFormsModule
        ],
  templateUrl: './request-medicine.component.html',
  styleUrl: './request-medicine.component.css'
})
export class RequestMedicineComponent implements OnInit {
  currentUser: User | null = null;
  medicines: Medicine[] = [];
  categories: MedicineCategory[] = [];
  filteredMedicines: Medicine[] = [];
  searchForm: FormGroup;
  loading = false;
  error = '';
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;
  
  selectedCategory = '';
  searchTerm = '';
  sortBy = 'createdAt';
  sortOrder = 'desc';
  
  viewMode: 'grid' | 'list' = 'grid';
  showFilters = false;

  mockCategories: MedicineCategory[] = [
    {
      id: '1',
      name: 'Analgésicos',
      pointsMultiplier: 1.0
    },
    {
      id: '2',
      name: 'Antihistamínicos',
      pointsMultiplier: 1.2
    },
    {
      id: '3',
      name: 'Antiinflamatorios',
      pointsMultiplier: 1.1
    },
    {
      id: '4',
      name: 'Digestivos',
      pointsMultiplier: 1.0
    },
    {
      id: '5',
      name: 'Vitaminas y Suplementos',
      pointsMultiplier: 0.8
    },
    {
      id: '6',
      name: 'Tópicos',
      pointsMultiplier: 0.9
    }
  ];

  mockMedicines: Medicine[] = [
    {
      id: '1',
      activePrinciple: 'Paracetamol',
      commercialName: 'Tylenol',
      laboratory: 'Johnson & Johnson',
      expirationDate: '2025-12-15',
      quantity: 20,
      unitType: 'tablets',
      category: '1',
      description: 'Analgésico y antipirético de acción rápida',
      donorName: 'María González',
      pointsValue: 50,
      status: 'available',
      createdAt: '2024-12-10T10:30:00Z',
      imageUrl: 'https://quefarmacia.com/wp-content/uploads/2017/09/7501109913268_1.jpg'
    },
    {
      id: '2',
      activePrinciple: 'Ibuprofeno',
      commercialName: 'Advil',
      laboratory: 'Pfizer',
      expirationDate: '2025-08-20',
      quantity: 20,
      unitType: 'capsules',
      category: '3',
      description: 'Antiinflamatorio no esteroideo para dolor y fiebre',
      donorName: 'Carlos Méndez',
      pointsValue: 30,
      status: 'available',
      createdAt: '2024-12-09T14:20:00Z',
      imageUrl: 'https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/1089838_A_1280_AL.jpg'
    }
  ];

  constructor(
    private medicineService: MedicineService,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      search: [''],
      category: [''],
      sortBy: ['createdAt'],
      sortOrder: ['desc']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMockData();
    this.setupFormSubscriptions();
  }

  loadMockData(): void {
    this.categories = this.mockCategories;
    this.medicines = this.mockMedicines;
    this.filteredMedicines = [...this.medicines];
    this.totalCount = this.medicines.length;
    this.applyFiltersAndPagination();
  }

  setupFormSubscriptions(): void {
    this.searchForm.valueChanges.subscribe(values => {
      this.searchTerm = values.search || '';
      this.selectedCategory = values.category || '';
      this.sortBy = values.sortBy || 'createdAt';
      this.sortOrder = values.sortOrder || 'desc';
      this.currentPage = 1;
      this.applyFiltersAndPagination();
    });
  }

  applyFiltersAndPagination(): void {
    let filtered = [...this.mockMedicines];

    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.activePrinciple.toLowerCase().includes(searchLower) ||
        m.commercialName.toLowerCase().includes(searchLower) ||
        m.laboratory.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(m => m.category === this.selectedCategory);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.commercialName.localeCompare(b.commercialName);
          break;
        case 'expiration':
          comparison = new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
          break;
        case 'points':
          comparison = a.pointsValue - b.pointsValue;
          break;
        default: // createdAt
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.totalCount = filtered.length;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.medicines = filtered.slice(startIndex, endIndex);
  }

  async loadCategories(): Promise<void> {
  }

  async loadMedicines(): Promise<void> {
    this.applyFiltersAndPagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyFiltersAndPagination();
    window.scrollTo(0, 0);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  clearFilters(): void {
    this.searchForm.reset({
      search: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  getPaginationPages(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? 'Hace 1 día' : `Hace ${diffDays} días`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? 'Hace 1 hora' : `Hace ${diffHours} horas`;
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

  isExpiringSoon(dateString: string): boolean {
    return this.getDaysUntilExpiration(dateString) <= 90;
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return '';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || '';
  }

  requestMedicine(medicine: Medicine): void {
    alert(`¡Solicitud enviada! Has solicitado: ${medicine.commercialName}\n\nNumero de Folio: F4525IPN\n\nCosto: ${medicine.pointsValue} puntos.`);
  }

  viewMedicineDetails(medicine: Medicine): void {
    const details = `
Detalles del Medicamento:

• Nombre: ${medicine.commercialName}
• Principio Activo: ${medicine.activePrinciple}
• Laboratorio: ${medicine.laboratory}
• Cantidad: ${medicine.quantity} ${medicine.unitType}
• Vence: ${this.getDaysUntilExpiration(medicine.expirationDate)} días
• Lote: L1542
• Puntos: ${medicine.pointsValue}
• Donador: ${medicine.donorName}
• Categoría: ${this.getCategoryName(medicine.category)}

${medicine.description ? '• Descripción: ' + medicine.description : ''}
    `;
    
    alert(details);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToDonateMedicine(): void {
    this.router.navigate(['/donate-medicine']);
  }

  calculate(currentPage: number, pageSize: number, totalCount: number): number{
    return Math.min(currentPage * pageSize, totalCount)
  }
}