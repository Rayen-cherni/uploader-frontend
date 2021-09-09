import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'https://uploader-backend-service.herokuapp.com';

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }


  login(email: String, password: String) {
    return this.http.post<any>(`${this.apiUrl}/uploader/api/user/login`, {
      email,
      password
    })
      .pipe(map(user => {
        // clear and store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.clear();
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        console.log(localStorage.getItem('user'));

        return user;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(email: String, firstname: String, lastname: String, password: String) {
    return this.http.post(`${this.apiUrl}/uploader/api/user/register`, { email, firstname, lastname, password });
  }
}
