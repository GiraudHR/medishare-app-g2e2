import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {

  private apiURL = "";

  constructor(
    private http: HttpClient
  ) { }

  public getCategories(): Observable<any> {
    return this.http.get<any>("");
  }

  public calculatePoints(data: any): Observable<any> {
    return this.http.get("");
  }

  public uploadMedicineImage(data: any): Observable<any> {
    return this.http.patch("", data);
  }

  public donateMedicine(data: any): Observable<any> {
    return this.http.post("", data);
  }

  public getAvailableMedicines(data: any): Observable<any>{
    return this.http.get("");
  }

}

export interface Medicine {
  id: string;
  commercialName: string;
  quantity: number;
  unitType: string;
  createdAt: string;
  status: string;
  activePrinciple: string;
  expirationDate: string;
  imageUrl: string;
  pointsValue: number;
  laboratory: string;
  donorName: string;
  category: string;
  description: string;
}

export interface MedicineRequest {
  id: string;
  medicineName: string;
  requesterName: string;
  createdAt: string;
  status: string;
  requestedQuantity: number;
}

export interface MedicineCategory {
  id: string;
  name: string;
  pointsMultiplier: number;
}
