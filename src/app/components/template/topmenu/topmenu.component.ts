import { Component } from "@angular/core";
import { MenuItem } from "primeng/api";
import { TemplateModule } from "@tec/condor/components";

@Component({
    selector: 'app-topmenu',
    template: `
    <cd-topmenu 
      [topLeftMenuItems]="topLeftMenuItems" 
      [additionalUserMenuItems]="additionalUserMenuItems"
      [topRightMenuItems]="topRightMenuItems">
    </cd-topmenu>
  `,
    standalone: true,
    imports: [TemplateModule]
})
export class AppTopMenuComponent {

  // Items du topmenu de gauche (contient les items utilisateur)
  topLeftMenuItems: MenuItem[] = [];

  // Items supplémentaires affichés lorsque l'utilisateur est authentifié
  additionalUserMenuItems: MenuItem[] = [];

  // Items du topmenu de droite
  // Lorsque la largeur de la fenêtre < 960px ces items disparraissent du bandeau 
  // et sont accessibles via le bouton "3 petits points"
  topRightMenuItems: MenuItem[] = [];
}
