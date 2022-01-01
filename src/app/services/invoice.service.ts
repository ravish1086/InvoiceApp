import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http:HttpClient) { }

  generateInvoice(reqJson):Observable<any>
  {
   return this.http.post(environment.apiurl+"/generatedInvoices",reqJson).pipe(catchError(this.handleError));
  }

  updateInvoice(reqJson,id):Observable<any>
  {
    return this.http.put(environment.apiurl+"/generatedInvoices/"+id,reqJson).pipe(catchError(this.handleError));
  }

  getInvoiceDetails(invoiceNum):Observable<any>
  {
    return this.http.get(environment.apiurl+"/generatedInvoices/"+invoiceNum).pipe(catchError(this.handleError));
  }
  getLastInvoiceNumber():Observable<any>
  {
    return this.http.get(environment.apiurl+"/lastInvoice").pipe(catchError(this.handleError));
  }
  getAllInvoicesDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/generatedInvoices").pipe(catchError(this.handleError));
  }
  setLastInvoiceNumber(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/lastInvoice",reqJson).pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse){
    alert("Some error occurred while establishing a connection with the server.");
    return throwError(error);
    }

}
