import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StateStorageService {
  private localeKey = 'locale';
  private previousUrlKey = 'previousUrl';

  storeUrl(url: string): void {
    sessionStorage.setItem(this.previousUrlKey, JSON.stringify(url));
  }

  getUrl(): string | null {
    const previousUrl = sessionStorage.getItem(this.previousUrlKey);
    return previousUrl ? (JSON.parse(previousUrl) as string | null) : previousUrl;
  }

  clearUrl(): void {
    sessionStorage.removeItem(this.previousUrlKey);
  }

  storeLocale(locale: string): void {
    sessionStorage.setItem(this.localeKey, locale);
  }

  getLocale(): string | null {
    return sessionStorage.getItem(this.localeKey);
  }

  clearLocale(): void {
    sessionStorage.removeItem(this.localeKey);
  }
}
