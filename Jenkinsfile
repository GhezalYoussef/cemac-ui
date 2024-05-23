#!/usr/bin/env groovy

// Version du template Node : 2.0.4
// Documentation : https://docs.apps.eul.sncf.fr/construire/templates/node/

// Déclaration de la shared library build_libs
@Library('build_libs') _

// Options du build
Map options = [
    // Nombre de builds à conserver dans l'historique des builds du job Jenkins
    NUM_TO_KEEP: 10,
    // Branche sur laquelle l'analyse qualité, la publication et le build Docker sont applicables
    BRANCH_DEVELOP: 'develop',
    // Version de Node
    NODE_VERSION: 'hydrogen-alpine',
    // Définir à true si une image Docker applicative est à produire
    DOCKER_BUILD: false,
    // Définir à true pour des logs du build Docker plus détaillés
    IMAGE_BUILD_VERBOSE: false,
    // Type du dépôt de publication : 'generic' ou 'maven' (déprécié)
    PACKAGE_TYPE: 'generic',
]

// Valorisation des options par défaut
options = defaultBuildOptions(options)

// Propriétés du job
properties([
    // Connexion GitLab
    gitLabConnection("${options['GITLAB_NAME']}"),
    // Conservation des N dernières exécutions
    buildDiscarder(logRotator(numToKeepStr: "${options['NUM_TO_KEEP']}")),
    // Déclenchement du job via webhook GitLab lors de push de nouveau code ou de création de merge request
    pipelineTriggers([[$class: 'GitLabPushTrigger', triggerOnPush: true, triggerOnMergeRequest: true, branchFilterType: 'All']])
])

// L'analyse qualité, la publication des artefacts et le build Docker sont lancés uniquement sur la branche de développement
Boolean qualityAnalysisEnabled = env.BRANCH_NAME == options['BRANCH_DEVELOP']
Boolean publishEnabled = env.BRANCH_NAME == options['BRANCH_DEVELOP']
Boolean dockerEnabled = env.BRANCH_NAME == options['BRANCH_DEVELOP'] && options['DOCKER_BUILD'] == true

// Sinon, s'il est activé, l'horodatage des logs du CLI eul est décalé d'une heure
env.TZ = 'Europe/Paris'

// Horodatage des lignes de log Jenkins
timestamps {
    // Prise en charge des codes ANSI pour affichage de logs Jenkins colorisés
    ansiColor('xterm') {
        withTools([
            [name: 'node', image: 'node-web-browsers', registry: 'eul', version: "${options['NODE_VERSION']}"],
            [name: 'sonar-scanner', version: 'latest', registry: 'eul'],
            dockerEnabled ? [name: 'buildkit', image: 'moby/buildkit', version: 'rootless'] : [:],
        ]) {
            try {
                stage('Checkout') {
                    println '🔰 Récupération du code source'
                    scmInfo = checkout scm
                    env.GIT_COMMIT = scmInfo.GIT_COMMIT
                    env.GIT_URL = scmInfo.GIT_URL
                    println '✔️ Récupération du code source effectuée'
                }
                stage('Setup') {
                    container('node') {
                        println '🔰 Configuration du build'
                        // Le fichier package.json doit être présent à la racine du projet
                        if (!fileExists('package.json')) {
                            error '❌ Le fichier package.json est introuvable'
                        }
                        println '🔰 Extraction des informations du package.json'
                        // Récupération de l'attribut name de package.json
                        env.NAME = sh(script: "node -p \"require('./package.json').name\"", returnStdout: true).trim()
                        // Récupération de l'attribut version de package.json
                        env.VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                        if (options['PACKAGE_TYPE'] == 'maven' && !env.VERSION.endsWith('-SNAPSHOT') && env.BRANCH_NAME != 'master') {
                            error "❌ La version doit être suffixée par -SNAPSHOT dans le cas d'une publication au format maven : ${env.VERSION}"
                        }
                        // Dans le cas d'une publication generic, des versions suffixées  -alpha, -beta, -rc peuvent être utilisées et/ou suffixées par le n° de build
                        println "📜 Nom extrait du package.json : ${env.NAME}"
                        println "📜 Version extraite du package.json : ${env.VERSION}"

                        // Si besoin de mettre à jour npm dans la dernière version stable, décommenter la commande ci dessous
                        // https://docs.npmjs.com/try-the-latest-stable-version-of-npm#upgrading-on-nix-osx-linux-etc
                        // sh 'npm i -g npm@latest && npm --version'

                        // Désactivation des options npm non utiles en CI
                        sh 'eul npm config set audit false && npm config set fund false'
                        println '✔️ Configuration du build effectuée'
                    }
                }
                stage('Install') {
                    container('node') {
                        println '🔰 Installation des packages'
                        sh 'eul npm ci'
                        println '✔️️ Installation des packages effectuée'
                    }
                }
                stage('Build') {
                    container('node') {
                        println '🔰 Build'
                        sh 'eul npm run build'
                        println '✔️️ Build effectué'
                    }
                }
                stage('Tests') {
                    container('node') {
                        println '🔰 Exécution des tests unitaires'
                        if (sh(script: 'eul npm test', returnStatus: true)) {
                            unstable '⚠️️ Les tests unitaires ont échoué'
                        }
                        println '✔️️ Exécution des tests unitaires effectuée'
                    }
                }
                stage('QA') {
                    when(qualityAnalysisEnabled) {
                        container('sonar-scanner') {
                            println '🔰 Analyse qualité'
                            withSonarQubeEnv('sonarqube') {
                                // Le nom de la branche est ajouté à la fin du nom du projet SonarQube
                                String sonarBranch = env.BRANCH_NAME?.replaceAll(/[\\]/, '_').replaceAll(/[, ]/, '')
                                String sonarProjectName = "${env.NAME} ${sonarBranch}".trim()
                                sh """\
                                    eul sonar-scanner \
                                    -Dsonar.projectKey=${options['PROJECT_SONAR_KEY_BRANCH']} \
                                    -Dsonar.projectName="${sonarProjectName}" \
                                    -Dsonar.projectVersion=${env.VERSION} \
                                    -Dsonar.links.ci=${JOB_URL} \
                                    -Dsonar.links.homepage=${GIT_URL} \
                                """
                            }
                            println '✔️️ Analyse qualité effectuée'
                        }
                    }
                }
                stage('Local CVE scan') {
                    container('node') {
                        println '🔰 Scan de sécurité local sur les artefacts produits'
                        // Scan CVE déclenché avant la publication des artefacts pour ne pas publier d'artefact avec des vulnerabilités
                        if (sh(script: 'eul artefacts cve-scan --local --critical --npm', returnStatus: true)) {
                            // La présence de CVE dans les artefacts est bloquante
                            error "❌ Le scan de CVE a identifié des vulnérabilités critiques dans l'artefact ou ses dépendances"
                        }
                        println '✔️️ Scan CVE local effectué'
                    }
                }
                stage('Publish') {
                    when(publishEnabled) {
                        container('node') {
                            println "🔰 Publication des artefacts du projet dans Artifactory depuis la branche ${BRANCH_NAME}"
                            String archiveExtension = 'tar.gz'
                            String archiveFilename = "${env.NAME}-${env.VERSION}.$archiveExtension"
                            // Création du tar.gz du dossier dist, possibilité d'ajouter cette étape dans le postbuild
                            // défini dans le package.json : "postbuild": "tar -zcvf {nom_archive}.tar.gz dist/*".
                            // Pour ne pas inclure le dossier parent dist, remplacer par un "cd dist && tar -zcvf {nom_archive}.tar.gz *"
                            //  et mettre à jour le paramètre archiveFilename de l'appel à eul artefacts upload (le préfixer par dist/)
                            sh "tar -zcvf ${archiveFilename} dist/*"
                            // En convention maven
                            String groupId = options['GROUP_ID'].replaceAll('[.]', '/')
                            String targetLocation = "$groupId/$NAME/$VERSION/$NAME-$VERSION.$archiveExtension"
                            // Upload au format generic avec une convention maven.
                            // Avec le generic, on est libre sur le choix de la convention et donc du dossier de destination :
                            // eul artefact upload -T generic $archiveFilename a/b/c/d/e/"
                            // sans paramètre supplémentaire le dépôt de destination par défaut est packageType_areris_dev
                            if (sh(script: "eul artefacts upload -T ${options['PACKAGE_TYPE']} $archiveFilename $targetLocation", returnStatus: true)) {
                                error "❌ L'upload de l'artefact ${archiveFilename} a échoué"
                            }
                            // Publication des infos de build dans artifactory
                            sh 'eul artefacts build-publish'
                            // Publication Jenkins du lien sur le build Artifactory
                            publishArtifactoryBuildLink()
                            println '✔️ Publication des artefacts effectuée'
                        }
                    }
                }
                stage('CVE scan') {
                    when(publishEnabled) {
                        container('node') {
                            println '🔰 Scan CVE distant sur les artefacts produits sur Artifactory'
                            // Pour des raisons de performances, l'exécution du scan de build est asynchrone : le résultat final du scan n'est pas attendu par le pipeline.
                            // Le lien Artifactory vers le scan de build est publié directement dans le job et accessible.
                            // Pour forcer le pipeline à attendre le résultat du scan de build, il faut rajouter le flag `--wait-for-result` à la commande de scan cve comme suit:
                            // <eul artefacts cve-scan --wait-for-result>
                            // cf: https://docs.apps.eul.sncf.fr/share/securise-scan-dependances
                            if (sh(script: 'eul artefacts cve-scan', returnStatus: true)) {
                                // Si le pipeline arrive à ce stage cela veut dire qu'il a passé le scan local et ne présente pas de CVE critiques mais hautes.
                                // Pour mettre la pipeline en erreur, remplacer unstable "⚠️..." par error "❌..." dans la ligne suivante
                                unstable "⚠️️ Le scan de CVE a identifié des vulnérabilités hautes dans l'artefact ou ses dépendances"
                            }
                            println '✔️ Scan CVE distant effectué'
                        }
                    }
                }
                stage('Docker build') {
                    when(dockerEnabled) {
                        container('buildkit') {
                            println '🔰 build Docker avec Buildkit'
                            String dockerVerboseOption = options['IMAGE_BUILD_VERBOSE'] ? '--debug' : ''
                            env.GROUP_ID = options['GROUP_ID'].replaceAll('[.]', '/')
                            env.IMAGE_NAME = options['PROJECT_NAME']
                            env.IMAGE_VERSION = env.VERSION
                            env.ARTEFACT_REPO_URL = "https://artefact-repo.apps.eul.sncf.fr/artifactory/${options['PACKAGE_TYPE']}_${env.EUL_ARESIS}"
                            result = sh(
                                returnStatus: true,
                                script: """
                                    eul image $dockerVerboseOption build docker/nginx \
                                        --tag=$IMAGE_NAME:$IMAGE_VERSION \
                                        --build-arg 'ARTEFACT_REPO_URL=$ARTEFACT_REPO_URL' \
                                        --build-arg 'GROUP_ID=$GROUP_ID' \
                                        --build-arg 'IMAGE_NAME=$IMAGE_NAME' \
                                        --build-arg 'VERSION=$IMAGE_VERSION' \
                                    """)
                            if (result != 0) {
                                error '❌ Le build Docker avec BuildKit a échoué'
                            }
                            println '✔️ build Docker effectué'
                        }
                    }
                }
                stage('Docker CVE scan') {
                    when(dockerEnabled) {
                        container('buildkit') {
                            println '🔰 Scan CVE distant sur l\'image docker produite'
                            // L'éxecution du scan docker est synchrone. C'est à dire, le résultat final du scan est attendu par le pipeline.
                            // Pour forcer le pipeline à ne pas attendre le résultat du scan docker, il faut enlever le flag `--wait-for-result` à la commande de scan comme suit:
                            // <eul image scan>
                            // cf: https://docs.apps.eul.sncf.fr/share/scan-conteneur
                            result = sh(script: "eul image scan $IMAGE_NAME:$IMAGE_VERSION --wait-for-result", returnStatus: true)
                            if (result > 0) {
                                if (result == 4) {
                                    // La présence de CVE critiques dans l'image docker n'est pas bloquante.
                                    // Pour mettre le pipeline en erreur, remplacer unstable "⚠️..." par error "❌..." dans la ligne suivante.
                                    unstable "⚠️️ Le scan CVE distant Docker a identifié des vulnérabilités critiques dans l'image produite"
                                } else {
                                    error '❌ Le Scan CVE distant Docker a échoué'
                                }
                            }

                            println '✔️ Scan CVE distant sur l\'image docker produite effectué'
                        }
                    }
                }

                updateGitlabCommitStatus name: 'build', state: 'success'
                println '👍 Build du job de snapshot terminé avec succès'
                currentBuild.result = 'SUCCESS'
            } catch (all) {
                currentBuild.result = 'FAILURE'
                updateGitlabCommitStatus name: 'build', state: 'failed'
                // Envoi d'un mail en cas d'échec
                emailext(
                    body: '$DEFAULT_CONTENT',
                    subject: '$DEFAULT_SUBJECT',
                    // Destinataires : auteurs d'une modification du code et déclencheur du pipeline
                    recipientProviders: [[$class: 'DevelopersRecipientProvider'], [$class: 'RequesterRecipientProvider']],
                    // Pour également envoyer le mail à une liste d'adresses (séparées par des ,) :
                    //to: "adressmail1, adressmail2"
                )
                throw all
            }
            finally {
                // Collecte et remontée dans Jenkins des problèmes rencontrés pendant le build
                addNgIssuesReportToJob('tools': ['cveScan', 'npm', 'taskScanner'])
                // Pour le suivi et les indicateurs eUL
                eulNotify()
            }
        }
    }
}
