import { Component, OnInit } from '@angular/core';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-addedstockentries',
  templateUrl: './addedstockentries.component.html',
  styleUrls: ['./addedstockentries.component.css']
})
export class AddedstockentriesComponent implements OnInit {

  allstockentries:any[];

  constructor(private stockservice:StockService) {

   }

  ngOnInit(): void {
    this.getAllStockEntries();
  }

    getAllStockEntries()
    {
      this.stockservice.getAllEntries().subscribe((res)=>
      {
        this.allstockentries=res;
        console.log(this.allstockentries);
      })
    }

}
