import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {FamilleCatenaire} from "../../../models/famille-catenaire.model";
import {FamilleCatenaireService} from "../../../services/famille-catenaire.service";
import {
    AdminFamilleCatenaireModalComponent
} from "./admin-famille-catenaire-modal/admin-famille-catenaire-modal.component";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-admin-famille-catenaire',
  standalone: true,
    imports: [
        ButtonModule,
        PanelModule,
        SharedModule,
        TableModule
    ],
  templateUrl: './admin-famille-catenaire.component.html',
  styleUrl: './admin-famille-catenaire.component.scss'
})
export class AdminFamilleCatenaireComponent implements OnInit {
  displayDialog = false;
  familleCatenaireList : FamilleCatenaire[] = [];
  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private familleCatenaireService: FamilleCatenaireService,
              private confirmationService: ConfirmationService) {
  }


  ngOnInit(): void {

    this.familleCatenaireService.findAll().subscribe(
        res => {
          this.familleCatenaireList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'error',
                summary: 'Charger',
                detail: 'Le chargement de la liste des refrences a rencontré une erreur.',
                key: 'top'
              });
        });
  }

  deleteFamilleCatenaire(familleCatenaireId: number): void {
    this.familleCatenaireService.delete(familleCatenaireId).subscribe(
        (res) => {
          if (res) {
            this.familleCatenaireList = this.familleCatenaireList.filter((familleCatenaire) => familleCatenaire.id !== familleCatenaireId);
            this.messageService.add(
                {
                  severity: 'success',
                  summary: 'Supprimer',
                  detail: 'La suppression a été réalisée avec succès.',
                  key: 'top'
                });
          }
        },
        () => {
          this.messageService.add(
              {
                severity: 'error',
                summary: 'Supprimer',
                detail: 'Une erreur s\'est produite lors de la suppression de la référence du signal.',
                key: 'top'
              });
        });
  }

  onDelete(familleCatenaireId: number){
    this.confirmationService.confirm({
      message: `Vous êtes sur le point de supprimer la reference <br/>Souhaitez-vous confirmer?`,
      header: `Confirmation de la supprression`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteFamilleCatenaire(familleCatenaireId);
      }
    });
  }

  showDialog(familleCatenaireUpdate: FamilleCatenaire) {
    this.displayDialog = true;
    const ref = this.dialogService.open(AdminFamilleCatenaireModalComponent, {
      header: 'Ajouter des référence',
      height: '400px',
      width: '720px',
      data: {
        familleCatenaire: familleCatenaireUpdate
      },
    });

    ref.onClose.subscribe(
        () => {
          this.familleCatenaireService.findAll().subscribe(
              (res) => {
                this.familleCatenaireList = res
              },
              () => {
                this.messageService.add(
                    {
                      severity: 'error',
                      summary: 'Charger',
                      detail: 'Problème rencontré lors du chargement de la référence',
                      key: 'top'
                    });
              })
        })
  }
}
