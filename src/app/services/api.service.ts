import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.API_ENDPOINT + '/api';

  constructor(private httpClient: HttpClient) { }

  filterAttendance(options: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/report', {
      observe: 'response',
      params: options,
    });
  }

  getUsers(): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/users', {
      observe: 'response',
    });
  }

  getOneUser(idNumber: string): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/users/' + idNumber, {
      observe: 'response',
    });
  }

  createUser(userObj: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/users', userObj);
  }

  editUser(userObj: any): Observable<any> {
    return this.httpClient.put<any>(this.baseUrl + '/users', userObj);
  }

  deleteUser(userIdNumber: number): any {
    return this.httpClient.delete<any>(this.baseUrl + '/users/' + userIdNumber);
  }

  proceedToCICO(idNumberObj: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/report', idNumberObj);
  }

}
