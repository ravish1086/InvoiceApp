
import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import { ProductDetails } from '../models/product.model';
import { SellerModel } from '../models/seller.model';
import { OtherdataService } from '../services/otherdata.service';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selectedProductId=null;
  selectedProductQuantity=null;
  products:ProductDetails[]=[];
  sellers:SellerModel[]=[];
  savedProducts:ProductDetails[]=[];
  savedSellers:SellerModel[]=[];
  stockentryreq=  { 
    "invoiceNum": "",
    "purchasedFrom": "",
    "productName": "",
    "datePurchase": "",
    "quantity": "",
    "unit": "",
    "rate": "",
    "amount": ""
  };



  productForm=new FormGroup({
    invoiceNum:new FormControl(),
    purchasedFrom:new FormControl(),
    productName:new FormControl(),
   
    datePurchase:new FormControl(),
    quantity:new FormControl(),
    unit:new FormControl(),
    rate:new FormControl(),
    amount:new FormControl()
  
  });

      constructor(private stockservice:StockService,private otherdataservice:OtherdataService)
    {
     
    }

      ngOnInit()
      {
        if(this.otherdataservice.loadedProducts.length>0){
          this.products=this.otherdataservice.loadedProducts;
          }
          else{
              this.getSavedProducts();
          }
          if(this.otherdataservice.loadedSeller.length>0){
          this.sellers=this.otherdataservice.loadedSeller;      
          }
            else{
             this.getSellerDetails();
          }
      }
      mapSelectedProduct()
      {
        let productName=(this.productForm.controls['productName'].value).split('_arr_')[0];
        let productIndex=(this.productForm.controls['productName'].value).split('_arr_')[1];
        this.selectedProductId=this.products[productIndex].id
        this.selectedProductQuantity=this.products[productIndex].inStock
        // console.log(selectedID)
        // this.selectedProductId=selectedID;
      // console.log(this.productForm.controls['productName'].value)
console.log(productName)
console.log(this.selectedProductId)
console.log(this.selectedProductQuantity)

      }
      onSubmit()
      {
        // console.log(this.productForm.value);

        // console.log(this.stockentryreq);
        this.setReqData();
        console.log(this.stockentryreq);
        try{
          this.stockservice.addEntry(this.stockentryreq).subscribe((res)=>
          {
            console.log(res);
            if(res)
            {
              this.stockservice.updateStock(
                {
                  "inStock":(Number(this.stockentryreq.quantity)+this.selectedProductQuantity)
                },this.selectedProductId
              ).subscribe(response=>
                {
                  console.log(response)
                })
            }
          },error=>
          {
            console.log(error);
          });
        }
        catch(e)
        {
          console.log(e);
        }
      } 
      setReqData()
      {
        this.stockentryreq.invoiceNum=String(this.productForm.value.invoiceNum);
        this.stockentryreq.purchasedFrom=String(this.productForm.value.purchasedFrom);
        this.stockentryreq.productName=String(this.productForm.value.productName).split('_')[0];
        this.stockentryreq.datePurchase=String(this.productForm.value.datePurchase);
        this.stockentryreq.quantity=String(this.productForm.value.quantity);
        this.stockentryreq.unit=String(this.productForm.value.unit);
        this.stockentryreq.rate=String(this.productForm.value.rate);
        this.stockentryreq.amount=String(this.productForm.value.amount);
      }

      getSavedProducts()
      {
        this.otherdataservice.getProductDetails().subscribe(res=>
          {
            console.log(res);
            for(let i=0;i<res.length;i++)
            {
              let product=new ProductDetails();
              product.inStock=res[i].inStock
              product.id=res[i].id
              product.productName=res[i].productName
              product.productHsn=res[i].productHsn
              product.productPrice=res[i].productPrice
              product.productTaxRate=res[i].productTaxRate
              product.productUnit=res[i].productUnit
              this.savedProducts.push(product);
            }
            this.products=this.savedProducts;
            this.otherdataservice.loadedProducts=this.savedProducts;
          })
      }

      getSellerDetails()
      {
        this.otherdataservice.getSellerDetails().subscribe(res=>
          {
            console.log(res);
              for(let i=0;i<res.length;i++)
              {
                let seller=new SellerModel();
                seller.sellerGst=res[i].sellerGst
                seller.sellerName=res[i].sellerName
                seller.sellerPan=res[i].sellerPan
                seller.sellerContact=res[i].sellerContact
                seller.sellerAddress=res[i].sellerAddress
                this.savedSellers.push(seller);
              }
              
             this.sellers=this.savedSellers
              console.log(this.savedSellers);
              this.otherdataservice.loadedSeller=this.savedSellers;
          })
      }
}
