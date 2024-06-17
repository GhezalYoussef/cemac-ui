import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Periodicite} from "../../../models/periodicite.model";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {PeriodiciteService} from "../../../services/periodicite.service";
import {AdminPeriodiciteModalComponent} from "./admin-periodicite-modal/admin-periodicite-modal.component";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {CategorieMaintenanceService} from "../../../services/categorie-maintenance.service";
import {ExcelService} from "../../../services/excel.service";
import {FileUploadModule} from "primeng/fileupload";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {A11yService} from "@tec/condor/services";
import {StyleClassModule} from "primeng/styleclass";
import {MessageModule} from "primeng/message";

@Component({
  selector: 'app-admin-periodicite',
  standalone: true,
    imports: [
        ButtonModule,
        PanelModule,
        SharedModule,
        TableModule,
        FileUploadModule,
        NgIf,
        NgClass,
        DialogModule,
        NgForOf,
        StyleClassModule,
        MessageModule
    ],
  templateUrl: './admin-periodicite.component.html',
  styleUrl: './admin-periodicite.component.scss'
})
export class AdminPeriodiciteComponent implements OnInit {

  displayDialog = false;
  periodiciteList : Periodicite[] = [];
  typeCategorieList : string[] = [];
  messageErreurList : string[] = [];
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInputElementRef: ElementRef<HTMLInputElement>;
  currentContrast = inject(A11yService).currentContrast;

  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private periodiciteService: PeriodiciteService,
              private categorieMaintenanceService: CategorieMaintenanceService,
              private confirmationService: ConfirmationService,
              private excelService: ExcelService) {
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
    this.getTypeCategorieMaintenanceList();
  }

  getTypeCategorieMaintenanceList(){
      this.categorieMaintenanceService.findAll().subscribe(
          res => {
              const typeCategorieArray = res.map(categorie => categorie.categorieMaintenance);
              const uniqueNamesSet = new Set(typeCategorieArray);
              this.typeCategorieList = Array.from(uniqueNamesSet);
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
                    if(data.body.periodiciteList.length !== 0) {
                        this.periodiciteList = data.body.periodiciteList;
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

  clearFile() {
    this.fileInputElementRef.nativeElement.value = '';
    this.selectedFile = null;
  }

  showDialog(periodiciteUpdate: Periodicite) {
    const ref = this.dialogService.open(AdminPeriodiciteModalComponent, {
      header: 'Ajouter des références',
      height: '600px',
      width: '720px',
      data: {
        periodicite: periodiciteUpdate,
        typeCategorieList : this.typeCategorieList
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

  closeDialog() {
    this.displayDialog = false;
  }

  addAll(){
    this.periodiciteService.addAll(this.periodiciteList).subscribe(
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

}
