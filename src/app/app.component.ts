import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Observable, Observer } from "rxjs";
declare var pdfMake: any;
@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private http: HttpClient) {}

  async showPdf() {
    let docDefinition = {
      content: [
        {
          image:
            (await this.getBase64ImageFromURL(
              "https://images.pexels.com/photos/209640/pexels-photo-209640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=300"
            ))
        }
      ]
    };

    pdfMake.createPdf(docDefinition).download();
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        // This will call another method that will create image from url
        img.onload = () => {
          resolve(this.getBase64Image(img));
        };
        img.onerror = err => {
          reject(err);
        };
      } else {
        resolve(this.getBase64Image(img));
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  toDataUrl(url) {
    return this.http
      .get(url, { responseType: "blob" })
      .pipe(tap(data => console.log(data)));
  }
}
