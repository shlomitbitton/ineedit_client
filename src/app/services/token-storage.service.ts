import { isPlatformBrowser } from '@angular/common';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'auth-token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Save the token in localStorage
  saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      console.warn("Attempted to access localStorage on a non-browser platform");
    }
  }

  // Retrieve the token from localStorage
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    } else {
      console.warn("Attempted to access localStorage on a non-browser platform");
      return null;
    }
  }

  // Remove the token from localStorage
  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    } else {
      console.warn("Attempted to access localStorage on a non-browser platform");
    }
  }
}
