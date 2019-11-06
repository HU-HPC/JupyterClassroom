import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {isPlatformBrowser} from "@angular/common";

@Component({
  templateUrl: "./view.component.html",
  styleUrls: ["./view.component.scss"]
})
export class ViewComponent implements OnInit {
  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        const id = params.get("id");
        this.http.post("/api/labs/" + id + "/start", null)
          .subscribe(lab => {
            this.started = true;
          });
      });
    }
  }
  
  started = false;
}
