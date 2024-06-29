import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ProductDetails } from '../models/product.model';
import { OtherdataService } from '../services/otherdata.service';
@Component({
  selector: 'app-addedproducts',
  templateUrl: './addedproducts.component.html',
  styleUrls: ['./addedproducts.component.css'],
})
export class AddedproductsComponent implements OnInit {
  data;
  editmode = false;
  isImport = true;
  constructor(private otherdataservice: OtherdataService) {}
  product: ProductDetails[] = [];
  savedProducts: ProductDetails[] = [];
  addProductsForm = false;
  name;
  hsn;
  price;
  taxrate;
  unit;
  // parentArray;
  ngOnInit(): void {
    this.getSavedProducts();
  }
  searchProduct(inputStr: string) {
    this.savedProducts = this.otherdataservice.loadedProducts;
    this.savedProducts = this.savedProducts.filter((product) =>
      product.productName.toLowerCase().includes(inputStr.toLowerCase())
    );
  }
  toggleEdit(index) {
    //var ins=
    let element1 = document.getElementsByClassName(
      'editmode1'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let i = index * 6; i < index * 6 + 6; i++) {
      element1[i].style.display = 'block';
    }
    let element2 = document.getElementsByClassName(
      'editmode2'
    ) as HTMLCollectionOf<HTMLElement>;
    for (let j = index * 6; j < index * 6 + 6; j++) {
      element2[j].style.display = 'none';
    }
  }

  SaveRecords(entry, index: number) {
    let element1 = document.getElementsByClassName(
      'editmode1'
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = index * 6; i < index * 6 + 6; i++) {
      element1[i].style.display = 'none';
    }

    let element2 = document.getElementsByClassName(
      'editmode2'
    ) as HTMLCollectionOf<HTMLElement>;

    for (let j = index * 6; j < index * 6 + 6; j++) {
      element2[j].style.display = 'block';
    }
    this.otherdataservice.saveProducts(entry, entry.id).subscribe((res) => {
      console.log(res);
    });
  }

  showForm() {
    this.addProductsForm = !this.addProductsForm;
  }

  getSavedProducts() {
    this.otherdataservice.getProductDetails().subscribe((res) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        let product = new ProductDetails();
        product.productName = res[i].productName;
        product.productHsn = res[i].productHsn;
        product.productPrice = res[i].productPrice;
        product.productTaxRate = res[i].productTaxRate;
        product.productUnit = res[i].productUnit;
        product.inStock = res[i].inStock;
        product.id=res[i].id
        this.savedProducts.push(product);
      }
      // this.parentArray=this.savedProducts
      this.otherdataservice.loadedProducts = this.savedProducts;
    });
  }

  addProduct() {
    let product = new ProductDetails();
    product.productName = this.name;
    product.productHsn = this.hsn;
    product.productPrice = this.price;
    product.productTaxRate = this.taxrate;
    product.productUnit = this.unit;
    product.inStock = 0;
    this.otherdataservice.addProducttoDb(product).subscribe((res) => {
      console.log(res);
      if ((res)) {
        alert('Product has been added Successfully');
        this.savedProducts.push(product);
      }
    });
  }
  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>evt.target;

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      //console.log(this.data);

      let x = this.data.slice(1);
      console.log(x);
      for (let i = 1; i < this.data.length; i++) {
        let product = new ProductDetails();
        product.productName = this.data[i][0];
        product.productHsn = this.data[i][1];
        product.productPrice = this.data[i][2];
        product.productTaxRate = this.data[i][3];
        product.productUnit = this.data[i][4];
        product.inStock = 0;
        this.otherdataservice.exportProductDetails(product).subscribe((res) => {
          console.log(res);
        });
        // this.product.push(product);
      }
      console.log(this.product);
      this.otherdataservice
        .exportProductDetails(this.product)
        .subscribe((res) => {
          console.log(res);
        });
    };

    reader.readAsBinaryString(target.files[0]);
  }
}
