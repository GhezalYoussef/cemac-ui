### Build Docker Multistage ###
## ----------------------------
## Récupération de l'artefact
FROM registry-docker.apps.eul.sncf.fr/hub/nginx:1.25-alpine as downloader

# Variables d'env. exportées dans le build Docker des Jenkinsfile*
ARG ARTEFACT_REPO_URL
ARG ARTEFACT_USER
ARG GROUP_ID
ARG IMAGE_NAME
ARG VERSION

USER root

# --fail option to return exit !=0 on 404 response code
RUN --mount=type=secret,id=artefact_pwd \
  curl --fail -L -u $ARTEFACT_USER:`cat /run/secrets/artefact_pwd` \
    "${ARTEFACT_REPO_URL}/${GROUP_ID}/${IMAGE_NAME}/$VERSION/${IMAGE_NAME}-$VERSION.tar.gz" \
    -o /opt/front.tar.gz

## ----------------------------
## Image applicative finale
FROM registry-docker.apps.eul.sncf.fr/hub/nginx:1.25-alpine

USER root

# Configuration NGINX
# - activation de la compression GZIP (level compression : 4)
COPY ./docker/nginx/nginx.conf /etc/nginx/nginx.conf

# - port 8080 : port non root
# - try_files : redirige les routes Angular (URLs du front) vers la page index.html
# - configuration de l'entête Cache-Control (pour index.html et pour les ressources statiques)
# - configuration de l'entête Content-Security-Policy (CSP) : ajout d'un nonce
# - configuration de l'entête X-XSS-Protection
# - ajout d'un bloc 'Location' pour les URLs vers le backend (à configurer lorsque NGINX est utilisé comme reverse proxy)
COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

# Copie les fichiers de l'application
COPY --from=downloader /opt/front.tar.gz /opt/front.tar.gz
WORKDIR /usr/share/nginx/html
RUN tar xfz /opt/front.tar.gz --strip-components=2 -C /usr/share/nginx/html

USER nginx

EXPOSE 8080