import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SellerDetailsComponent } from './seller-details/seller-details.component';
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from '@angular/common/http'; 
import { StockService } from './services/stock.service';
import { AddedstockentriesComponent } from './addedstockentries/addedstockentries.component';
import { AddedproductsComponent } from './addedproducts/addedproducts.component';
import { OtherdataService } from './services/otherdata.service';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { CustomersComponent } from './customers/customers.component';
import { CommonModule } from '@angular/common';
import { GeneratedinvoiceComponent } from './generatedinvoice/generatedinvoice.component';
import { SalesummaryComponent } from './salesummary/salesummary.component';
import { ItemComponent } from './item/item.component';
import { CreatenegativeinvoiceComponent } from './createnegativeinvoice/createnegativeinvoice.component';
import { HsnsummaryComponent } from './hsnsummary/hsnsummary.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { PaymentsComponent } from './payments/payments.component';
import { NgxCaptureModule } from 'ngx-capture';
import { DemoComponent } from './demo/demo.component';
@NgModule({
  declarations: [
    AppComponent,
    SellerDetailsComponent,
    HomeComponent,
    AddedstockentriesComponent,
    AddedproductsComponent,
    CreateinvoiceComponent,
    CustomersComponent,
     GeneratedinvoiceComponent,
     SalesummaryComponent,
     ItemComponent,
     CreatenegativeinvoiceComponent,
     HsnsummaryComponent,
     EditInvoiceComponent,
     PaymentsComponent,
     DemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    NgxCaptureModule
  ],
  providers: [StockService,OtherdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
