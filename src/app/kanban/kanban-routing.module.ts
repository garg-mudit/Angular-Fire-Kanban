import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BoradListComponent } from "./borad-list/borad-list.component";

const routes: Routes = [{ path: "", component: BoradListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KanbanRoutingModule {}
