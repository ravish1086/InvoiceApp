import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http:HttpClient) {

   }
   updateStock(reqJson,id)
   {
     return this.http.patch(environment.apiurl+"/productdetails/"+id,reqJson).pipe(catchError(this.handleError));
   }
   addEntry(reqJson):Observable<any>
   {
      return this.http.post(environment.apiurl+"/stockdetails",reqJson).pipe(catchError(this.handleError));
   }
   getAllEntries():Observable<any>
   {
     return this.http.get(environment.apiurl+"/stockdetails").pipe(catchError(this.handleError));
   }

   handleError(error: HttpErrorResponse){
    alert("Some error occurred while establishing a connection with the server.");
    return throwError(error);
    }
}
