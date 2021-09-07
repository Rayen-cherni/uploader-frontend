import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../service/file.service';
import { fileSaver } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  filenames: String[] = [];
  fileStatus= {status : "",requestType:"",percent :0};

  constructor(private router: Router,
    private fileService: FileService) { }

  ngOnInit(): void {
  }

  //Define a function to upload files 
  onUploadFiles(files: File[]): void {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(
      (result) => {
        console.log(result);
        this.reportProgress(result);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  //Define a function to download files 
  onDownloadFiles(filename: String): void {

    this.fileService.download(filename).subscribe(
      (result) => {
        console.log(result);
        this.reportProgress(result);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }


  logout() {
    this.router.navigate(['/login']);

  }

  private reportProgress(httpEvent: HttpEvent<String[] | Blob>): void {
    switch (httpEvent.type) {
      case HttpEventType.UploadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total, 'Uploading');
        break;
      case HttpEventType.DownloadProgress:
        this.updateStatus(httpEvent.loaded, httpEvent.total, 'Downloading');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Header returned', httpEvent);
        break;
      case HttpEventType.Response:
        if (httpEvent.body instanceof Array) {
          for (const filename of httpEvent.body) {
            //unshoft is the similar of push but here we add the item on the beginning 
            this.filenames.unshift(filename);
          }
        } else {
          //Download Logic  
          //we will use file saver to save files on the client browser 
          fileSaver(new File([httpEvent.body], httpEvent.headers.get('File-Name'),
            { type: `${httpEvent.headers.get('Content-Type')};charset=utf-8` }));

        }
        break;
      default:
        console.log(httpEvent);
          break;
    }
  }



  updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
}


