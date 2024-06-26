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
import {MessageService} from "primeng/api";
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf} from "@angular/common";
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
import {Title} from "@angular/platform-browser";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {AnalyseResultCompare} from "../../models/analyse-result-compare.model";

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
        ToastModule,
        DecimalPipe,
        NgClass,
        NgIf
    ],
  templateUrl: './mode-analyse.component.html',
  styleUrl: './mode-analyse.component.scss'
})
export class ModeAnalyseComponent implements OnInit {

  public requete_1 ?: Requete;
  public requete_2 ?: Requete;
  public analyseResultList ?: AnalyseResult[] = [];
  public analyseResultCompareList ?: AnalyseResultCompare[] = [];
  public RQDate = new Date();
  public typeAnalyse : boolean = false;



  constructor(private titleService: Title,
              private requeteService:RequeteService,
              private messageService: MessageService,
              private sharedService:SharedService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
      this.titleService.setTitle('Mode analyse');
      this.route.paramMap.subscribe((params: ParamMap) => {
           if(params.get('type') === "1") {
               this.sharedService.requete$.pipe(
                   mergeMap(
                       requete => {
                           return this.requeteService.analyseRequete(requete);
                       })
               ).subscribe(res =>{
                   this.requete_1 = res;
                   this.analyseResultList = res.analyseResultList;
               },() => {
                   this.messageService.add(
                       {
                           severity: 'error',
                           summary: 'Analyse',
                           detail: `Erreur lors de l'analyse de la requete.`,
                           key: 'top'
                       });
               });
           } else {
               this.typeAnalyse =  true;
               this.sharedService.requeteList$.pipe(
                   mergeMap(
                       requeteList => {
                           return this.requeteService.analyseRequeteList(requeteList);
                       })
               ).subscribe(res =>{
                   this.requete_1 = res[0];
                   this.requete_2 = res[1];
                   this.analyseResultList = res[0].analyseResultList;
                   for (let i = 0; i < res[1].analyseResultList.length; i++) {
                       this.analyseResultCompareList.push({
                           id : res[1].analyseResultList[i].id,
                           requete : res[1].analyseResultList[i].requete,
                           refResult : res[1].analyseResultList[i].refResult,
                           categorie:res[1].analyseResultList[i].categorie,
                           sousCategorie:res[1].analyseResultList[i].sousCategorie,
                           operation:res[1].analyseResultList[i].operation,
                           sousOperation:res[1].analyseResultList[i].sousOperation,
                           categorieMaintenance:res[1].analyseResultList[i].categorieMaintenance,
                           uop:res[1].analyseResultList[i].uop,
                           cout:res[1].analyseResultList[i].cout,
                           uop_2:res[0].analyseResultList[i].uop,
                           cout_2:res[0].analyseResultList[i].cout
                       });
                   }
               },() => {
                   this.messageService.add(
                       {
                           severity: 'error',
                           summary: 'Analyse',
                           detail: `Erreur lors de l'analyse de la liste des requetes.`,
                           key: 'top'
                       });
               });
           }
      });
  }

}
