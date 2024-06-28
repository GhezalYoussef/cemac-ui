import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {NgClass, NgIf} from "@angular/common";
import {ExcelService} from "../../../services/excel.service";

@Component({
  selector: 'app-admin-famille-catenaire',
  standalone: true,
    imports: [
        ButtonModule,
        PanelModule,
        SharedModule,
        TableModule,
        NgIf,
        NgClass
    ],
  templateUrl: './admin-famille-catenaire.component.html',
  styleUrl: './admin-famille-catenaire.component.scss'
})
export class AdminFamilleCatenaireComponent implements OnInit {

  displayDialog = false;
  familleCatenaireList : FamilleCatenaire[] = [];
  messageErreurList : string[] = [];
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInputElementRef: ElementRef<HTMLInputElement>;

  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private familleCatenaireService: FamilleCatenaireService,
              private confirmationService: ConfirmationService,
              private excelService: ExcelService) {
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
      header: 'Ajouter des références',
      height: '350px',
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

    clearFile() {
        this.fileInputElementRef.nativeElement.value = '';
        this.selectedFile = null;
    }

    onAddAll(){
        this.confirmationService.confirm({
            message: `Voulez-vous vraiment modifier toute la liste des périodes ? Cela écrasera toute l'ancienne liste et en créera une nouvelle !`,
            header: `Confirmation de la modification`,
            icon: 'pi pi-info-circle',
            accept: () => {
                this.addAll();
            }
        });
    }

    addAll(){
        this.familleCatenaireService.addAll(this.familleCatenaireList).subscribe(
            (result) => {
                if (result) {
                    this.messageService.add(
                        {
                            severity: 'success',
                            summary: 'Ajouter',
                            detail: 'Mise à jour terminée avec succès.',
                            key: 'top'
                        });
                }
            },
            () => {
                this.messageService.add(
                    {
                        severity: 'error',
                        summary: 'Ajouter',
                        detail: 'Il y a eu une erreur lors de la mise à jour !',
                        key: 'top'
                    });
            });
    }

    importDonnees(event: any): void {
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            this.excelService.importDonnees(this.selectedFile).subscribe({
                next: (data) => {
                    console.log(data.body);
                    if(data.body){
                        if(data.body.messageErreurList.length !== 0){
                            this.messageErreurList = [];
                            this.messageErreurList.push(data.body.messageErreurList[0]);
                            this.messageErreurList.push(data.body.messageErreurList[1]);
                            this.messageErreurList.push(data.body.messageErreurList[2]);
                            this.messageErreurList.push(data.body.messageErreurList[3]);
                            if(data.body.messageErreurList.length > 4){
                                this.messageErreurList.push("...");
                            }
                            this.messageErreurList.push();
                            this.displayDialog = true;
                        }
                        if(data.body.catenaireList.length !== 0) {
                            this.familleCatenaireList = data.body.familleCatenaireList;
                        }
                    }
                },
                error: (error) => {
                    console.log(error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur du Chargement',
                        detail: error,
                        key: 'top'
                    });
                }
            });
        }
    }
}
