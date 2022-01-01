import { Component, ViewChild } from '@angular/core';
import { OtherdataService } from './services/otherdata.service';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('screen', { static: true }) screen: any;
  title = 'StockApp';
show=false;
  selectedFileBLOB: any;
  constructor(private _sanitizer: DomSanitizer,private otherdataservice:OtherdataService,private captureService:NgxCaptureService)
  {
    
  }
  imagePath;
  capture()
  {
this.captureService.getImage(this.screen.nativeElement, true).pipe(
  tap(img => {
    console.log(img);
    // this.imagePath = new File([this.DataURIToBlob(img)],'screenshot.png',{
    //   type: "'image/png'"
    // })
    this.imagePath=this.DataURIToBlob(img)
    console.log(this.imagePath)
    //this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' 
                // + img.base64string);
    // this.image=this.DataURIToBlob(img)
    // console.log(this.image)
    let url = window.URL.createObjectURL(this.imagePath);

    this.selectedFileBLOB = this._sanitizer.bypassSecurityTrustUrl(url);

    this.show=true;
  })
).subscribe();
    
  }
  
  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]
        
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)
      
        return new Blob([ia],{type:mimeString})
}



}
