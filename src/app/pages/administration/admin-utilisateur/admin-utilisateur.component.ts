import {Component, OnInit} from '@angular/core';
import {Utilisateur} from "../../../models/Utilisateur.model";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {UtilisateurService} from "../../../services/utilisateur.service";
import {AdminUtilisateurModalComponent} from "./admin-utilisateur-modal/admin-utilisateur-modal.component";
import {PanelModule} from "primeng/panel";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ReactiveFormsModule} from "@angular/forms";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-admin-utilisateur',
  standalone: true,
    imports: [
        PanelModule,
        ButtonModule,
        TableModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        ToastModule
    ],
  templateUrl: './admin-utilisateur.component.html',
  styleUrl: './admin-utilisateur.component.scss'
})
export class AdminUtilisateurComponent implements OnInit {

    displayDialog = false;
    utilisateurList: Utilisateur[] = [];

    constructor(private dialogService: DialogService,
                private messageService: MessageService,
                private userService: UtilisateurService,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
        this.userService.getListUtilisateur().subscribe(
            (res) => {
                this.utilisateurList = res;
            },
            () => {
                this.messageService.add(
                    {
                        severity: 'error',
                        summary: 'Charger',
                        detail: 'Le chargement des utilisateurs a rencontré une erreur.',
                        key: 'top'
                    });
            }
        )
    }

    deleteUtilisateur(utilisateurId: number): void {
        this.userService.deleteUtilisateur(utilisateurId).subscribe(
            (res) => {
                if (res) {
                    this.utilisateurList = this.utilisateurList.filter((utilisateur) => utilisateur.id !== utilisateurId);
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
                        detail: 'Une erreur s\'est produite lors de la suppression de l\'utilisateur.',
                        key: 'top'
                    });
            }
        )
    }

    onDelete(utilisateurId: number){
        this.confirmationService.confirm({
            message: `Vous êtes sur le point de supprimer la reference <br/>Souhaitez-vous confirmer?`,
            header: `Confirmation de la supprression`,
            icon: 'pi pi-info-circle',
            accept: () => {
                this.deleteUtilisateur(utilisateurId);
            }
        });
    }

    showDialog(utilisateur: Utilisateur) {
        this.displayDialog = true;
        const ref = this.dialogService.open(AdminUtilisateurModalComponent, {
            header: 'Ajouter des utilisateurs',
            height: '450px',
            width: '720px',
            data: {
                utilisateur: utilisateur
            },
        });

        ref.onClose.subscribe(
            () => {
                this.userService.getListUtilisateur().subscribe(
                    (res) => {
                        this.utilisateurList = res
                    },
                    () => {
                        this.messageService.add(
                            {
                                severity: 'error',
                                summary: 'Charger',
                                detail: 'Problème rencontré lors du chargement des utilisateurs',
                                key: 'top'
                            });
                    })
            })
    }

}
