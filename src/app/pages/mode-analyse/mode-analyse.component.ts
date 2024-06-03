import {Component, OnInit} from '@angular/core';
import {TemplateModule} from "@tec/condor/components";
import {PanelModule} from "primeng/panel";
import {InputNumberModule} from "primeng/inputnumber";
import {AutoCompleteModule} from "primeng/autocomplete";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ButtonModule} from "primeng/button";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {DatePipe, NgForOf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {SharedService} from "../../services/shared.service";
import {mergeMap} from "rxjs";
import {RequeteService} from "../../services/requete.service";
import {Requete} from "../../models/requete";
import {AnalyseResult} from "../../models/analyse-result.model";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-mode-analyse',
  standalone: true,
  imports: [
      TemplateModule,
      PanelModule,
      InputNumberModule,
      AutoCompleteModule,
      DropdownModule,
      MultiSelectModule,
      ToggleButtonModule,
      ButtonModule,
      PaginatorModule,
      ReactiveFormsModule,
      NgForOf,
      InputTextModule,
      TableModule,
      DatePipe,
      ConfirmDialogModule,
      MessageModule,
      ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './mode-analyse.component.html',
  styleUrl: './mode-analyse.component.scss'
})
export class ModeAnalyseComponent implements OnInit {

  public requete ?: Requete;
  public analyseResultList ?: AnalyseResult[];
  public selectedResult ?: AnalyseResult;
  public RQDate = new Date();


  constructor(private requeteService:RequeteService,
              private messageService: MessageService,
              private sharedService:SharedService,) {

  }

  ngOnInit() {
      this.sharedService.requete$.pipe(
          mergeMap(
              requete => {
                  return this.requeteService.analyseRequete(requete);
              })
      ).subscribe(res =>{
          this.requete = res;
          this.analyseResultList = res.analyseResultList;
      },error => {
          this.messageService.add(
              {
                  severity: 'error',
                  summary: 'Analyse',
                  detail: `Erreur lors de l'analyse.`,
                  key: 'top'
              });
      });
  }

}
