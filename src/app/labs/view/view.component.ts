import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"]
})
export class ViewComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private sanitizer: DomSanitizer,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        this.id = params.get("id");
        this.http.post("/api/labs/" + this.id + "/start", null)
          .subscribe(lab => {
            this.started = true;
          });
        
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl("/_lab-instance/" + this.id);
      });
    }
  }
  
  started = false;
  id: string;
  src: SafeResourceUrl;
}
