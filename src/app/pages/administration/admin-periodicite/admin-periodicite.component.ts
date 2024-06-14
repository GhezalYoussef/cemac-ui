import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {NgClass, NgIf} from "@angular/common";

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
        NgClass
    ],
  templateUrl: './admin-periodicite.component.html',
  styleUrl: './admin-periodicite.component.scss'
})
export class AdminPeriodiciteComponent implements OnInit {

  displayDialog = false;
  periodiciteList : Periodicite[] = [];
  typeCategorieList : string[] = [];
  selectedFile: File | null = null;
  @ViewChild('fileInput') fileInputElementRef: ElementRef<HTMLInputElement>;

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

    importDonnees(event: any): void {
      console.log('test');
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files[0];
            this.excelService.importDonnees(this.selectedFile).subscribe({
                next: (data) => {
                    this.periodiciteList = data.body;
                },
                error: (error) => {
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
        this.fileInputElementRef.nativeElement.value = ''; // Efface la sélection du fichier
        this.selectedFile = null;
    }

  showDialog(periodiciteUpdate: Periodicite) {
    this.displayDialog = true;
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


}
