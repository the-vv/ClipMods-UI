import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly httpClient = inject(HttpClient);

  isLoading = signal(false);
  setLoading(loading: boolean) {
    this.isLoading.set(loading);
  }

  getCurrentVersionAsync() {
    return this.httpClient.get<{ version: string }>('/version.json')
  }
}
