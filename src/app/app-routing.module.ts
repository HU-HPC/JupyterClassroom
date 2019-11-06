import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LabsComponent} from "./labs/labs.component";
import {ListComponent} from "./labs/list/list.component";
import {ViewComponent} from "./labs/view/view.component";

const routes: Routes = [{
  path: "labs",
  component: LabsComponent,
  children: [{
    path: "",
    component: ListComponent,
  }, {
    path: ":id",
    component: ViewComponent,
  }],
}, {
  path: "",
  redirectTo: "labs",
  pathMatch: "full",
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
