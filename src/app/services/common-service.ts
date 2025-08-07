import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isLoading = signal(false);
  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }
}
