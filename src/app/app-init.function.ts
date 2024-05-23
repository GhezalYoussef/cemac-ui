import { Injector } from "@angular/core";
import { ConstantService, AuthenticationService } from "@tec/condor/services";
import { NGXLogger } from "ngx-logger";

export function initApplication(cs: ConstantService, injector: Injector, logger: NGXLogger): () => Promise<void> {
  const t1 = performance.now();
  return () =>
    Promise.all([
      // Promesses chaînées
      Promise.resolve(
        // Chargement des constantes en premier !
        // 'api/config' web service JRAF d'exposition de propriétés
        cs.load("api/config")
      )
        .then(() => {
          // Récupération de l'utilisateur connecté
          injector.get(AuthenticationService).loadCurrentUser();
        })
        .then(() => {
          // Surcharge du niveau de log par défaut
          // La propriété log.level.front est envoyée par le backend via le service d'exposition de JRAF (api/config)
          if (!isNaN(+cs.get("log.level.front"))) {
            logger.updateConfig({ level: Number(cs.get("log.level.front")) });
          }
        })
        .then(() => {
          // Autre fonction d'initialisation
        }),
    ])
      .then(() => {
        const t2 = performance.now();
        const took = ((t2 - t1) / 1000).toFixed(3);
        logger.debug("Initialisation terminée avec succès (temps d'exécution:", took, ")");
      })
      .catch((ex) => logger.error("Erreur lors de l'initialisation de l'application:", ex));
}
