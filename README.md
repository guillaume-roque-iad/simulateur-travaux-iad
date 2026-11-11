# Simulateur Travaux

## Mise en ligne actuelle : GitHub Pages

Chaque modification poussée sur la branche `main` est publiée automatiquement par GitHub Actions
(fichier `.github/workflows/pages.yml`) à l'adresse `https://<compte>.github.io/<dépôt>/`.

Tant que `public/config.js` contient `A_REMPLACER`, l'application fonctionne en **mode démonstration** :
toutes les estimations, les aides, la négociation et le PDF sont disponibles, mais sans connexion,
sans grille partagée ni historique.

Pour activer les fonctions d'équipe, suivez les étapes 1 à 4 ci-dessous, puis :
1. Renseignez `public/config.js` et poussez la modification.
2. Dans **Authentication > Paramètres > Domaines autorisés**, ajoutez `<compte>.github.io`.
3. Dans **Firestore Database > Règles**, collez le contenu de `firestore.rules` et publiez.

L'étape 5 (déploiement Firebase Hosting) devient alors facultative.

---

# Variante : hébergement sur Firebase

Application web installable (PWA) : estimation des travaux, aides MaPrimeRénov' et éco-PTZ,
négociation, photos, synthèse PDF, historique par conseiller et grille de prix commune.

Durée estimée de la mise en ligne : 30 à 45 minutes, une seule fois.

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `public/index.html` | L'application |
| `public/config.js` | **À compléter** : configuration Firebase, domaines autorisés, administrateurs |
| `public/sw.js` | Fonctionnement hors connexion |
| `public/manifest.webmanifest`, `public/icons/` | Installation sur l'écran d'accueil |
| `public/mentions-legales.html` | Mentions légales et RGPD (**adresse à compléter**) |
| `firestore.rules` | Règles de sécurité de la base de données |
| `firebase.json`, `.firebaserc` | Configuration du déploiement (**identifiant de projet à compléter**) |

## Étape 1 — Créer le projet Firebase

1. Ouvrez https://console.firebase.google.com et cliquez sur **Créer un projet**.
   Nom conseillé : `simulateur-travaux-iad`. Google Analytics n'est pas nécessaire.
2. Notez l'**identifiant du projet** affiché (par exemple `simulateur-travaux-iad`).
   Remplacez `A_REMPLACER` par cet identifiant dans le fichier `.firebaserc`.

## Étape 2 — Déclarer l'application Web

1. Dans le projet : **Paramètres du projet** (roue dentée) > **Vos applications** > icône **Web** `</>`.
2. Nom : `Simulateur Travaux`. Ne cochez pas « Firebase Hosting » à ce stade.
3. Copiez les valeurs `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`
   dans `public/config.js`, à la place des `A_REMPLACER`.

## Étape 3 — Activer la connexion

Menu **Authentication** > **Commencer** > onglet **Sign-in method** :

1. **Google** : activez-le et choisissez votre e-mail d'assistance.
2. **E-mail/Mot de passe** : activez-le, puis activez aussi **Lien envoyé par e-mail (connexion sans mot de passe)**.

Si vous ajoutez un domaine personnalisé (étape 7), ajoutez-le aussi dans **Authentication > Paramètres > Domaines autorisés**.

## Étape 4 — Créer la base de données

Menu **Firestore Database** > **Créer une base de données** :
- Mode : **production**.
- Emplacement : **europe-west9 (Paris)**, pour un hébergement des données en France.
  Ce choix est définitif.

## Étape 5 — Déployer

Sur votre ordinateur :

1. Installez Node.js (version LTS) depuis https://nodejs.org
2. Ouvrez un terminal et lancez :

```bash
npm install -g firebase-tools
firebase login
cd chemin/vers/simulateur-travaux-app
firebase deploy
```

L'adresse de l'application s'affiche à la fin : `https://<identifiant-du-projet>.web.app`

## Étape 6 — Premier lancement (administrateur)

1. Ouvrez l'adresse et connectez-vous avec **guillaume.roque@iadfrance.fr**.
2. Onglet **Grille et calibration** : vérifiez les valeurs, puis cliquez sur **Publier la grille pour l'équipe**.
3. Faites une simulation complète et un PDF pour valider le fonctionnement.

## Étape 7 — Diffuser à l'équipe

- Partagez l'adresse. Chaque conseiller se connecte avec son adresse **@iadfrance.fr**
  (compte Google ou lien reçu par e-mail).
- **Installer sur iPhone** : ouvrir dans Safari > bouton Partager > **Sur l'écran d'accueil**.
- **Installer sur Android** : ouvrir dans Chrome > menu ⋮ > **Installer l'application**.
- **Domaine personnalisé** (facultatif, par exemple `travaux.tribu-immo.com`) :
  **Hosting** > **Ajouter un domaine personnalisé**, puis suivez les instructions DNS.

## Réglages courants

- **Ajouter un administrateur** : ajoutez son e-mail dans `public/config.js` (`adminEmails`)
  **et** dans `firestore.rules` (fonction `admin`), puis `firebase deploy`.
- **Ouvrir à d'autres adresses que @iadfrance.fr** : modifiez `allowedDomains` dans `public/config.js`
  **et** la fonction `member` dans `firestore.rules`.
- **Publier une nouvelle version** : modifiez les fichiers, augmentez `VERSION` dans `public/sw.js`
  (par exemple `travaux-v2`), puis `firebase deploy`.
- **Mettre à jour le barème des aides** : il se trouve dans `public/index.html`, bloc `BAREME`
  (source : service-public.gouv.fr). À vérifier chaque trimestre.

## Coûts

La formule gratuite de Firebase (Spark) suffit pour démarrer avec une équipe de cette taille.
Les quotas (lectures, écritures, e-mails de connexion) sont consultables dans la console ;
si l'envoi de liens par e-mail devient limitant, la connexion Google reste disponible.

## Sécurité, en résumé

- Seules les adresses vérifiées @iadfrance.fr accèdent aux données.
- Chaque conseiller ne voit que ses propres simulations.
- Seul l'administrateur modifie la grille et consulte les retours terrain.
- Le revenu fiscal des acquéreurs n'est jamais enregistré sur le serveur.
