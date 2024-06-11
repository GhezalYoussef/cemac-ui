import { Component, OnInit, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { TemplateModule } from "@tec/condor/components";
import {ConfirmationService, PrimeNGConfig} from "primeng/api";
import { ToastModule } from "primeng/toast";
import { FooterPrimaryListComponent } from "./components/template/footerprimarylist/footerprimarylist.component";
import { AppMenubarComponent } from "./components/template/menubar/menubar.component";
import { AppTopMenuComponent } from "./components/template/topmenu/topmenu.component";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessageModule} from "primeng/message";

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  standalone: true,
  providers:[ConfirmDialogModule, ConfirmationService],
  imports: [RouterOutlet, TemplateModule, AppTopMenuComponent, AppMenubarComponent, FooterPrimaryListComponent, ToastModule, ConfirmDialogModule, MessageModule],
})
export class AppComponent implements OnInit {

  primengConfig = inject(PrimeNGConfig);

  translateService = inject(TranslateService);

  ngOnInit() {
    this.translateService.get("primeng").subscribe((res) => this.primengConfig.setTranslation(res));
    this.primengConfig.ripple = true;
  }

}
