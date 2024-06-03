import { Component } from '@angular/core';
import {TemplateModule} from "@tec/condor/components";
import {Requete} from "../../models/requete";
import {Title} from "@angular/platform-browser";
import {ConfirmationService, MessageService} from "primeng/api";
import {RequeteService} from "../../services/requete.service";
import {NavigationService} from "../../services/navigation.service";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {MessageModule} from "primeng/message";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-list-requetes',
  standalone: true,
  imports: [
    TemplateModule,
    PanelModule,
    ButtonModule,
    TableModule,
    ConfirmDialogModule,
    MessageModule,
    ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './list-requetes.component.html',
  styleUrl: './list-requetes.component.scss'
})
export class ListRequetesComponent {

  public requeteList:Requete[];

  constructor(
      private titleService: Title,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private requeteService: RequeteService,
      private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('List des requêtes');
    this.requeteService.getAll().subscribe(
        res => {
          this.messageService.add({
            severity: 'success',
            summary: 'Charger',
            detail: `Charger la liste des requêtes`,
            key:'top'
          });
          // this.requeteList = this.filterListRQByUtilisateur(res);
          this.requeteList = res;
        },error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Charger',
            detail: `Une erreur est survenue lors du chargement de la liste des requêtes.`,
            key:'top'
          });
        });
  }

  // filterListRQByUtilisateur(requeteList:Requete[]){
  //   if(this.customAuthService.isSimpleUser()){
  //     return requeteList.filter(requete => requete.modificateur === this.customAuthService.utilisateur.idSncf);
  //   } else if(this.customAuthService.isAdmin_NIV2()){
  //     return requeteList.filter(requete => requete.groupe === this.customAuthService.utilisateur.groupe);
  //   }else{
  //     return requeteList;
  //   }
  // }

  public onClickUpdate(requete:Requete){
    this.navigationService.navigationToUpdateRequete(requete);
  }

  public onClickAnalyse(requete:Requete){
    this.navigationService.navigationToAnalyseRequete(requete);
  }

  public onClickAdd(){
    this.navigationService.navigationToAddRequete();
  }

  public onClickDelete(requete:Requete) {
    this.confirmationService.confirm({
      message: `Vous êtes sur le point de supprimer la requete ${requete.requeteRef}<br/>Souhaitez-vous confirmer ?`,
      header: `Confirmation de suppression de la requete`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.requeteService.suppressionRequete(requete.id).subscribe(
            res => {
              this.requeteList = this.requeteList.filter((rq) => requete.id !== rq.id);
              this.messageService.add({
                severity: 'success',
                summary: 'Supprimer',
                detail: `Requete supprimée`,
                key: 'top'
              });
            }, error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Supprimer',
                detail: `Une erreur est survenue lors de la suppression de la requete`,
                key:'top'
              });
            });
      }
    });
  }

}
