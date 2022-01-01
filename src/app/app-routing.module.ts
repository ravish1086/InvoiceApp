import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddedproductsComponent } from './addedproducts/addedproducts.component';
import { AddedstockentriesComponent } from './addedstockentries/addedstockentries.component';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { CreatenegativeinvoiceComponent } from './createnegativeinvoice/createnegativeinvoice.component';
import { CustomersComponent } from './customers/customers.component';
import { DemoComponent } from './demo/demo.component';
import { EditInvoiceComponent } from './edit-invoice/edit-invoice.component';
import { GeneratedinvoiceComponent } from './generatedinvoice/generatedinvoice.component';

import { HomeComponent } from './home/home.component';
import { HsnsummaryComponent } from './hsnsummary/hsnsummary.component';
import { PaymentsComponent } from './payments/payments.component';
import { SalesummaryComponent } from './salesummary/salesummary.component';

import { SellerDetailsComponent } from './seller-details/seller-details.component';

const routes: Routes = [
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'sellerdetails',
    component: SellerDetailsComponent
  },
  {
    path:'addedStockEntries',
    component: AddedstockentriesComponent
  },
  {
    path:'productdetails',
    component:AddedproductsComponent
  },
  {
    path:'createInvoice',
    component:CreateinvoiceComponent
  },
  {
    path:'customers',
    component:CustomersComponent
  },
  {
    path:'generatedInvoice/:invoicenum',
    component:GeneratedinvoiceComponent
  } ,
  {
    path:'createNegativeInvoice',
    component:CreatenegativeinvoiceComponent
  },
  {
    path:'saleSummary',
    component:SalesummaryComponent
  },    
  {
    path:'hsnSummary',
    component:HsnsummaryComponent
  },
  {
    path:'editInvoice/:invoicenum',
    component:EditInvoiceComponent
  },
  {
    path:'payments',
    component:PaymentsComponent
  },{
    path:'demo',
    component:DemoComponent
  },
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
