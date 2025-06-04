import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthHeaderService {

  private readonly APP_SECRET = 'SsSafe@300625ForApp';

  constructor() {}

  getAppSecret(): { [header: string]: string } {
    return {
      'X-App-Secret': this.APP_SECRET
    };
  }
}