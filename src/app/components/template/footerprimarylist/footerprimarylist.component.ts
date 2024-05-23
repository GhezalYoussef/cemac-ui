import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-footer-primary-list',
    template: `
  <div id="footer-primary-list" class="footer-primary-list">
    <a routerLink="/blank" routerLinkActive="active">Contact</a>
    <a routerLink="/blank" routerLinkActive="active">FAQ</a>
    <a routerLink="/blank" routerLinkActive="active">Plan du site</a>
    <a routerLink="/blank" routerLinkActive="active">Aide</a>
  </div>
`,
    standalone: true,
    imports: [RouterLink, RouterLinkActive]
})
export class FooterPrimaryListComponent {
}
