import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {CategorieMaintenanceService} from "../../../services/categorie-maintenance.service";
import {CategorieMaintenance} from "../../../models/categorie-maintenance.model";
import {AdminCategorieModalComponent} from "./admin-categorie-modal/admin-categorie-modal.component";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-admin-categorie-maintenance',
  standalone: true,
    imports: [
        PanelModule,
        ButtonModule,
        TableModule
    ],
  templateUrl: './admin-categorie-maintenance.component.html',
  styleUrl: './admin-categorie-maintenance.component.scss'
})
export class AdminCategorieMaintenanceComponent implements OnInit{


  displayDialog = false;
  categorieMaintenanceList : CategorieMaintenance[] = [];

  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private categorieMaintenanceService: CategorieMaintenanceService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {

    this.categorieMaintenanceService.findAll().subscribe(
        res => {
          this.categorieMaintenanceList = res;
        },
        () => {
          this.messageService.add(
              {
                severity: 'error',
                summary: 'Charger',
                detail: 'Le chargement de la liste des refrences des categorie de maintenance a rencontré une erreur.',
                key: 'top'
              });
        });
  }

  delete(categorieMaintenanceId: number): void {
    this.categorieMaintenanceService.delete(categorieMaintenanceId).subscribe(
        (res) => {
          if (res) {
            this.categorieMaintenanceList = this.categorieMaintenanceList
                .filter((categorieMaintenance) => categorieMaintenance.id !== categorieMaintenanceId);
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
                detail: 'Une erreur s\'est produite lors de la suppression de la référence.',
                key: 'top'
              });
        });
  }

  onDelete(categorieMaintenanceId: number){
    this.confirmationService.confirm({
      message: `Vous êtes sur le point de supprimer la reference <br/>Souhaitez-vous confirmer?`,
      header: `Confirmation de la supprression`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.delete(categorieMaintenanceId);
      }
    });
  }

  showDialog(categorieMaintenanceUpdate: CategorieMaintenance) {
    this.displayDialog = true;
    const ref = this.dialogService.open(AdminCategorieModalComponent, {
      header: 'Ajouter des références',
      height: '480px',
      width: '720px',
      data: {
        categorieMaintenance : categorieMaintenanceUpdate
      },
    });

    ref.onClose.subscribe(
        () => {
          this.categorieMaintenanceService.findAll().subscribe(
              (res) => {
                this.categorieMaintenanceList = res
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
