import { HttpClient, provideHttpClient } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideNoopAnimations } from "@angular/platform-browser/animations";
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from "@ngx-translate/core";
import { ContrastEnum } from "@tec/condor/api";
import { CdA11yComponent, CdFooterComponent, CdHeaderTitleComponent } from "@tec/condor/components";
import { AuthenticationService, ConstantService, UnknownOidcService } from "@tec/condor/services";
import { findComponent } from "@tec/condor/utils";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { MessageService } from "primeng/api";
import { createTranslateLoader } from "src/main";
import { AppComponent } from "./app.component";
import { AppMenubarComponent } from "./components/template/menubar/menubar.component";
import { AppTopMenuComponent } from "./components/template/topmenu/topmenu.component";

describe("AppComponent", () => {
  let cs: ConstantService;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        // Logger
        importProvidersFrom(LoggerModule.forRoot({ level: NgxLoggerLevel.ERROR })),
        // I18N
        importProvidersFrom(TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        })),
        // AuthenticationService
        { provide: AuthenticationService, useClass: UnknownOidcService },
        MessageService, TranslateService
      ]
    }).compileComponents();

    cs = TestBed.inject(ConstantService);
    await cs.load();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Suppression des données insérées par le composant A11yComponent
    document.body.classList.remove(ContrastEnum.DEFAULT, ContrastEnum.REVERSE);
    localStorage.removeItem(CdA11yComponent.A11Y_CONTRAST_PROPERTY);
  });

  it("should create the AppComponent", () => {
    expect(component).toBeTruthy();
  });

  it('should create CdHeaderTitleComponent', () => {
    const headerTitleComponent = findComponent(fixture, CdHeaderTitleComponent);
    const headerTitleEl = headerTitleComponent.nativeElement;

    expect(headerTitleComponent).toBeTruthy();
    expect(headerTitleEl.querySelector('.ShowOnDesktop').textContent.trim()).toContain('Titre de votre application');
    expect(headerTitleEl.querySelector('.ShowOnMobile').textContent.trim()).toEqual('');
  });

  it('should create AppTopMenuComponent', () => {
    const appTopMenuComponent = findComponent(fixture, AppTopMenuComponent);
    expect(appTopMenuComponent).toBeTruthy();
  });

  it('should display "Me connecter" with FontAwesome Power icon', () => {
    const appTopMenuComponent = findComponent(fixture, AppTopMenuComponent);
    const appTopMenuEl = appTopMenuComponent.nativeElement;

    const userMenuItemText = appTopMenuEl.querySelector('.p-panelmenu .user-menu .p-menuitem-text');
    const userPowerIcon = appTopMenuEl.querySelector('.p-panelmenu .user-menu .p-menuitem-icon.fas.fa-power-off');

    expect(userMenuItemText.textContent).toBe('Me connecter');
    expect(userPowerIcon).toBeTruthy();
  });

  it('should create CdA11yComponent', () => {
    const cdA11yComponent = findComponent(fixture, CdA11yComponent);
    expect(cdA11yComponent).toBeTruthy();
  });

  it('should display the default constrast', () => {
    const cdA11yComponent = findComponent(fixture, CdA11yComponent);

    expect(cdA11yComponent).toBeTruthy();
    expect(document.body.classList.contains(ContrastEnum.DEFAULT)).toBeTruthy();
  });

  it('should display the reverse constrast', () => {
    const cdA11yComponent = findComponent(fixture, CdA11yComponent);

    // click pour afficher les boutons de changement de contraste
    cdA11yComponent.query(By.css('.cd-a11y-button')).nativeElement.click();
    fixture.detectChanges();

    const contrastButtons = cdA11yComponent.queryAll(By.css('.cd-a11y :not(.cd-a11y-button).p-button'));
    expect(contrastButtons.length).toEqual(2);

    // click sur le bouton correspondant au contraste inversé (dark theme)
    contrastButtons[1].nativeElement.click();
    fixture.detectChanges();

    expect(document.querySelector('body').classList.contains('reverse-contrast')).toBe(true);
  });

  it('should create the AppMenubarComponent', () => {
    const appMenubarComponent = findComponent(fixture, AppMenubarComponent);
    expect(appMenubarComponent).toBeTruthy();
  });

  it('should create the CdFooterComponent', () => {
    const cdFooterComponent = findComponent(fixture, CdFooterComponent);
    expect(cdFooterComponent).toBeTruthy();
  });
});
