import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { CustomerModel } from '../models/customer.model';
import { ProductDetails } from '../models/product.model';
import { SellerModel } from '../models/seller.model';

@Injectable({
  providedIn: 'root'
})
export class OtherdataService {
  
  appConfig;
  loadedProducts:ProductDetails[]=[];
  loadedSeller:SellerModel[]=[];
  loadedCustomers:CustomerModel[]=[];

  constructor(private http:HttpClient) {

  }

  getAppConfig():Observable<any>
  {
    return this.http.get(environment.apiurl+"/appConfig").pipe(catchError(this.handleError));
  }


  exportSellerData(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/sellerdetails",reqJson).pipe(catchError(this.handleError));
  }

  getSellerDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/sellerdetails").pipe(catchError(this.handleError));
  }

  exportProductDetails(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/productdetails",reqJson).pipe(catchError(this.handleError));
  }
  getProductDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/productdetails").pipe(catchError(this.handleError));
  }
  getCustomerDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/customerdetails").pipe(catchError(this.handleError));
  }
  exportCustomerData(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/customerdetails",reqJson).pipe(catchError(this.handleError));
  }

  saveProducts(reqJson,index:number):Observable<any>
  {
  console.log(index);
  let id=Number(index+1)
   return this.http.put(environment.apiurl+"/productdetails/"+id,reqJson).pipe(catchError(this.handleError));
  }
  saveCustomer(reqJson,index:number):Observable<any>
  {
  console.log(index);
  let id=Number(index+1)
   return this.http.put(environment.apiurl+"/customerdetails/"+id,reqJson).pipe(catchError(this.handleError));
  }
  addProducttoDb(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/productdetails",reqJson).pipe(catchError(this.handleError));
  }
  addCustomerToDb(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/customerdetails",reqJson).pipe(catchError(this.handleError));
  }
  insertPaymentDetails(reqJson):Observable<any>
  {
    return this.http.post(environment.apiurl+"/payments",reqJson).pipe(catchError(this.handleError));
  }
  fetchPaymentDetails():Observable<any>
  {
    return this.http.get(environment.apiurl+"/payments").pipe(catchError(this.handleError));
  }
  handleError(error: HttpErrorResponse){
    alert("Some error occurred while establishing a connection with the server.");
    return throwError(error);
    }
}
