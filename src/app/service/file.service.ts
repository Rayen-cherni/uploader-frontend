import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  apiUrl = 'https://uploader-backend-service.herokuapp.com';

  //Define function to upload files 
  upload(formData: FormData): Observable<HttpEvent<String[]>> {
    return this.http.post<String[]>(`${this.apiUrl}/uploader/api/file/upload`, formData, {
      reportProgress: true, //report all the progress of the request 
      observe: 'events'
    })
  }
 
  //Define function to download files 
 download(filename: String): Observable<HttpEvent<Blob>> {
  return this.http.get(`${this.apiUrl}/uploader/api/file/download/${filename}`, {
    reportProgress: true, //report all the progress of the request 
    observe: 'events',
    responseType:'blob'
  })
}

}
