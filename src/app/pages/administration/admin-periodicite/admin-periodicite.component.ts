import {Component, OnInit} from '@angular/core';
import {Periodicite} from "../../../models/periodicite.model";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {AdminPeriodiciteModalComponent} from "./admin-periodicite-modal/admin-periodicite-modal.component";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-admin-periodicite',
  standalone: true,
  imports: [
    ButtonModule,
    PanelModule,
    SharedModule,
    TableModule
  ],
  templateUrl: './admin-periodicite.component.html',
  styleUrl: './admin-periodicite.component.scss'
})
export class AdminPeriodiciteComponent implements OnInit {

  displayDialog = false;
  periodiciteList : Periodicite[] = [];
  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private periodiciteService: PeriodiciteService,
              private confirmationService: ConfirmationService) {
  }


  ngOnInit(): void {

    this.periodiciteService.findAll().subscribe(
        res => {
          this.periodiciteList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'error',
                summary: 'Charger',
                detail: 'Le chargement de la liste des refrences des signals a rencontré une erreur.',
                key: 'top'
              });
        });
  }

  deletePeriodicite(periodiciteId: number): void {
    this.periodiciteService.delete(periodiciteId).subscribe(
        (res) => {
          if (res) {
            this.periodiciteList = this.periodiciteList.filter((periodicite) => periodicite.id !== periodiciteId);
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

  onDelete(periodiciteId: number){
    this.confirmationService.confirm({
      message: `Vous êtes sur le point de supprimer la reference <br/>Souhaitez-vous confirmer?`,
      header: `Confirmation de la supprression`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deletePeriodicite(periodiciteId);
      }
    });
  }

  showDialog(periodiciteUpdate: Periodicite) {
    this.displayDialog = true;
    const ref = this.dialogService.open(AdminPeriodiciteModalComponent, {
      header: 'Ajouter des références',
      height: '600px',
      width: '720px',
      data: {
        periodicite: periodiciteUpdate
      },
    });

    ref.onClose.subscribe(
        () => {
          this.periodiciteService.findAll().subscribe(
              (res) => {
                this.periodiciteList = res
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
