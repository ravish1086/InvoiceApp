import { Component, OnInit } from '@angular/core';
import { DemoModel } from './demo.model';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  listItem:DemoModel[]=[]

  constructor() { }

  ngOnInit(): void {
    let item=new DemoModel()
    item.id="hello"
    item.name="hi"
    item.add="bye"
    this.listItem.push(item)
  }


}
