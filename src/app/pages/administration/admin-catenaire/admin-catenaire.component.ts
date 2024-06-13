import {Component, OnInit} from '@angular/core';

import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {Catenaire} from "../../../models/catenaire.model";
import {CatenaireService} from "../../../services/catenaire.service";
import {AdminCatenaireModalComponent} from "./admin-catenaire-modal/admin-catenaire-modal.component";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {FamilleCatenaire} from "../../../models/famille-catenaire.model";
import {FamilleCatenaireService} from "../../../services/famille-catenaire.service";

@Component({
  selector: 'app-admin-catenaire',
  standalone: true,
    imports: [
        ButtonModule,
        PanelModule,
        SharedModule,
        TableModule
    ],
  templateUrl: './admin-catenaire.component.html',
  styleUrl: './admin-catenaire.component.scss'
})
export class AdminCatenaireComponent implements OnInit {

  displayDialog = false;
  catenaireList : Catenaire[] = [];
  familleCatenaireList: FamilleCatenaire[] = [];

  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private catenaireService: CatenaireService,
              private confirmationService: ConfirmationService,
              private familleCatenaireService: FamilleCatenaireService) {
  }

  ngOnInit(): void {

    this.catenaireService.findAll().subscribe(
        res => {
          this.catenaireList = res;
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
    this.getFamilleCatenaireList();
  }

    getFamilleCatenaireList() {
        this.familleCatenaireService.findAll().subscribe(
            res => {
                this.familleCatenaireList = res;
            },
            () => {
                this.messageService.add(
                    {
                        severity: 'warn',
                        summary: 'Charger',
                        detail: 'Erreur lors du chargement de la liste.',
                        key: 'top'
                    });
            })
    }

    getFamilleCatenaire(idFamilleCatenaire:number){
      const familleCatenaire =  this.familleCatenaireList.find(familleCatenaire => familleCatenaire.id === idFamilleCatenaire);
      return familleCatenaire ? familleCatenaire.libelle : "test";
    }

  deleteCatenaire(catenaireId: number): void {
    this.catenaireService.delete(catenaireId).subscribe(
        (res) => {
          if (res) {
            this.catenaireList = this.catenaireList.filter((catenaire) => catenaire.id !== catenaireId);
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

  onDelete(catenaireId: number){
    this.confirmationService.confirm({
      message: `Vous êtes sur le point de supprimer la reference <br/>Souhaitez-vous confirmer?`,
      header: `Confirmation de la supprression`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteCatenaire(catenaireId);
      }
    });
  }


  showDialog(catenaireUpdate: Catenaire) {
    this.displayDialog = true;
    const ref = this.dialogService.open(AdminCatenaireModalComponent, {
      header: 'Ajouter des références',
      height: '350px',
      width: '720px',
      data: {
        catenaire: catenaireUpdate
      },
    });

    ref.onClose.subscribe(
        () => {
          this.catenaireService.findAll().subscribe(
              (res) => {
                this.catenaireList = res
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
