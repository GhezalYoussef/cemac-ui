import { Component, OnInit, inject } from "@angular/core";
import { CdBaseMenubarComponent } from "@tec/condor/components";
import { AuthenticationService, CdMenuItem } from "@tec/condor/services";
import { MenuItem } from "primeng/api";
import { NgClickOutsideDirective } from "ng-click-outside2";
import { MenubarModule } from "primeng/menubar";

@Component({
    selector: "app-menubar",
    template: `
    <p-menubar #mainMenu [model]="menuItems" styleClass="main-menu"  (click)="closeMobileMenuButton()" (clickOutside)="onClickedOutside($event)"
    (mouseleave)="hideMenuOnDesktop()"></p-menubar>
  `,
    standalone: true,
    imports: [MenubarModule, NgClickOutsideDirective],
})
export class AppMenubarComponent extends CdBaseMenubarComponent implements OnInit {
  menuItems: MenuItem[];

  authService = inject(AuthenticationService);

  items: CdMenuItem[] = [
    {
      label: "Accueil",
      icon: "pi pi-home",
      routerLink: "home",
    },
    {
      label: "Saisie",
      icon: "pi pi-home",
      routerLink: "saisie",
    },
    {
      label: "Analyse",
      icon: "pi pi-home",
      routerLink: "analyse",
    },
  ];

  getItems() {
    return this.items;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.authService.authenticatedSubject.subscribe(() => {
      this.menuItems = super.createMenu(this.items);
    });
    this.menuItems = super.createMenu(this.items);
  }
}
