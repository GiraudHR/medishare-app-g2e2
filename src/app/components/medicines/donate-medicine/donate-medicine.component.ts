import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineService, MedicineCategory } from '../../../services/medicine.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-donate-medicine',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './donate-medicine.component.html',
  styleUrl: './donate-medicine.component.css'
})
export class DonateMedicineComponent implements OnInit {
  donateForm: FormGroup;
  categories: MedicineCategory[] = [];
  loading = false;
  calculating = false;
  errorMessage = '';
  successMessage = '';
  estimatedPoints = 0;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  unitTypes = [
    { value: 'tablets', label: 'Tabletas' },
    { value: 'capsules', label: 'Cápsulas' },
    { value: 'mg', label: 'Miligramos (mg)' },
    { value: 'units', label: 'Unidades' },
    { value: 'sachets', label: 'Sobres' },
    { value: 'patches', label: 'Parches' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private medicineService: MedicineService,
    public authService: AuthService,
    public router: Router
  ) {
    this.donateForm = this.formBuilder.group({
      activePrinciple: ['', [Validators.required, Validators.minLength(3)]],
      commercialName: ['', [Validators.required, Validators.minLength(2)]],
      laboratory: ['', [Validators.required]],
      expirationDate: ['', [Validators.required, this.expirationDateValidator.bind(this)]],
      batchNumber: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(1000)]],
      unitType: ['tablets', [Validators.required]],
      category: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    // Calcular puntos cuando cambien campos relevantes
    /*this.donateForm.valueChanges.subscribe(() => {
      if (this.isFormValidForCalculation()) {
        this.calculateEstimatedPoints();
      } else {
        this.estimatedPoints = 0;
      }
    });*/
  }

  loadCategories(): void {
    /*this.medicineService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Error al cargar las categorías';
      }
    });*/
    this.categories = [
      {
        id: 'tab-analgesicos',
        name: 'Analgésicos (Tabletas/Cápsulas)',
        pointsMultiplier: 1.0
      },
      {
        id: 'tab-antibioticos',
        name: 'Antibióticos (Tabletas/Cápsulas)',
        pointsMultiplier: 1.2
      },
      {
        id: 'tab-antihistaminicos',
        name: 'Antihistamínicos (Tabletas)',
        pointsMultiplier: 1.1
      },
      {
        id: 'tab-antigripales',
        name: 'Antigripales (Comprimidos)',
        pointsMultiplier: 1.0
      },
      {
        id: 'tab-antiflamatorios',
        name: 'Antiinflamatorios (Cápsulas)',
        pointsMultiplier: 1.3
      },
      {
        id: 'tab-vitaminas',
        name: 'Vitaminas y Suplementos (Tabletas)',
        pointsMultiplier: 0.8
      },
      {
        id: 'tab-antiacidos',
        name: 'Antiácidos (Tabletas masticables)',
        pointsMultiplier: 0.9
      }
    ];
  }

  isFormValidForCalculation(): boolean {
    const form = this.donateForm;
    return !!(
      form.get('activePrinciple')?.valid &&
      form.get('commercialName')?.valid &&
      form.get('laboratory')?.valid &&
      form.get('expirationDate')?.valid &&
      form.get('quantity')?.valid &&
      form.get('unitType')?.valid &&
      form.get('category')?.valid
    );
  }

  expirationDateValidator(control: any) {
    if (!control.value) return null;

    /*const isValid = this.medicineService.validateExpirationDate(control.value);
    return isValid ? null : { invalidExpirationDate: true };*/
    return true;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor selecciona una imagen válida (JPG, PNG, GIF)';
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen no debe ser mayor a 5MB';
        return;
      }

      this.selectedImage = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.errorMessage = '';
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;

    // Limpiar el input file
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  calculateEstimatedPoints(): void {
    if (this.calculating) return;

    this.calculating = true;
    const formData = this.donateForm.value;

    this.medicineService.calculatePoints(formData).subscribe({
      next: (response) => {
        this.estimatedPoints = response.points;
        this.calculating = false;
      },
      error: (error) => {
        this.calculating = false;
        console.error('Error calculating points:', error);
        // No mostrar error si es solo para cálculo
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (this.donateForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        let imageUrl = '';

        if (this.selectedImage) {
          try {
            const uploadResponse = await this.medicineService.uploadMedicineImage(this.selectedImage).toPromise();
            imageUrl = uploadResponse?.imageUrl || '';
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            this.errorMessage = 'Error al subir la imagen. Continuando sin imagen...';
            // Continuar sin imagen en lugar de fallar completamente
          }
        }

        const medicineData = {
          ...this.donateForm.value,
          imageUrl
        };

        this.loading = false;
        this.successMessage = `¡Medicamento donado exitosamente! Has ganado 200 puntos.`;

        // Actualizar puntos del usuario
        /*const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.authService.updateUserPoints(currentUser.points + response.pointsValue);
        }*/

        // Scroll al mensaje de éxito
        setTimeout(() => {
          const successElement = document.querySelector('.success-message');
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 3000);
        /*this.medicineService.donateMedicine(medicineData).subscribe({
          next: (response) => {
            this.loading = false;
            this.successMessage = `¡Medicamento donado exitosamente! Has ganado ${response.pointsValue} puntos.`;

            // Actualizar puntos del usuario
            /*const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
              this.authService.updateUserPoints(currentUser.points + response.pointsValue);
            }////////

            // Scroll al mensaje de éxito
            setTimeout(() => {
              const successElement = document.querySelector('.success-message');
              if (successElement) {
                successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);

            // Redirigir después de 3 segundos
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 3000);
          },
          error: (error) => {
            this.loading = false;
            console.error('Error donating medicine:', error);

            if (error.status === 400) {
              this.errorMessage = error.error?.message || 'Datos inválidos. Verifica la información.';
            } else if (error.status === 401) {
              this.errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
              setTimeout(() => {
                this.authService.logout();
                this.router.navigate(['/login']);
              }, 2000);
            } else {
              this.errorMessage = 'Error al donar el medicamento. Intenta nuevamente.';
            }

            // Scroll al mensaje de error
            setTimeout(() => {
              const errorElement = document.querySelector('.error-message');
              if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        });*/
      } catch (error) {
        this.loading = false;
        this.errorMessage = 'Error inesperado. Intenta nuevamente.';
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.donateForm.controls).forEach(key => {
        this.donateForm.get(key)?.markAsTouched();
      });

      this.errorMessage = 'Por favor completa todos los campos requeridos correctamente.';

      // Scroll al primer error
      setTimeout(() => {
        const firstError = document.querySelector('.error-messages');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  clearForm(): void {
    this.donateForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
    this.estimatedPoints = 0;
    this.errorMessage = '';
    this.successMessage = '';

    // Resetear valores por defecto
    this.donateForm.patchValue({
      unitType: 'tablets',
      category: ''
    });

    // Limpiar el input file
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    // Scroll al inicio del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || '';
  }

  getCategoryMultiplier(categoryId: string): number {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.pointsMultiplier || 1;
  }

  getMinDate(): string {
    // Fecha mínima: 3 meses desde hoy
    const minDate = new Date();
    minDate.setMonth(minDate.getMonth() + 3);
    return minDate.toISOString().split('T')[0];
  }

  // Getters para facilitar la validación en el template
  get activePrinciple() { return this.donateForm.get('activePrinciple'); }
  get commercialName() { return this.donateForm.get('commercialName'); }
  get laboratory() { return this.donateForm.get('laboratory'); }
  get expirationDate() { return this.donateForm.get('expirationDate'); }
  get batchNumber() { return this.donateForm.get('batchNumber'); }
  get quantity() { return this.donateForm.get('quantity'); }
  get unitType() { return this.donateForm.get('unitType'); }
  get category() { return this.donateForm.get('category'); }
  get address() { return this.donateForm.get('address'); }
  get description() { return this.donateForm.get('description'); }

}