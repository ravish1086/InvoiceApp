import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HsnService {

  constructor(private http:HttpClient) { }
  getAllInvoicesDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/generatedInvoices").pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse){
    alert("Some error occurred while establishing a connection with the server.");
    return throwError(error);
    }
}
