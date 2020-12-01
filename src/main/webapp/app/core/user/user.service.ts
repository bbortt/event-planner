import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Pagination } from 'app/shared/util/request-util';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>(this.resourceUrl, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(this.resourceUrl, user);
  }

  find(login: string): Observable<User> {
    return this.http.get<User>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<User[]>> {
    const options = createRequestOption(req);
    return this.http.get<User[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.resourceUrl}/users/authorities`);
  }

  findByEmailOrLogin(emailOrLogin: string): Observable<User[]> {
    return this.http.post<User[]>(`${this.resourceUrl}/users/findByEmailOrLogin`, { emailOrLogin });
  }
}
