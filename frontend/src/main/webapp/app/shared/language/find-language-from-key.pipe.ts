import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'findLanguageFromKey' })
export class FindLanguageFromKeyPipe implements PipeTransform {
  private languages: { [key: string]: { name: string; rtl?: boolean } } = {
    en: { name: 'English' },
    de: { name: 'Deutsch' },
  };

  transform(lang: string): string {
    return this.languages[lang].name;
  }
}
