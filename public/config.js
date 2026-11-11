/*
 * Configuration de l'application — à compléter une seule fois.
 * 1. Console Firebase > Paramètres du projet > Vos applications > Application Web > « Configuration »
 *    Copiez les valeurs dans FIREBASE_CONFIG ci-dessous.
 * 2. APP_CONFIG : domaines e-mail autorisés et administrateurs de la grille.
 *    Toute modification ici doit aussi être reportée dans firestore.rules (fonctions member et admin).
 */
window.FIREBASE_CONFIG = {
  apiKey: "A_REMPLACER",
  authDomain: "A_REMPLACER.firebaseapp.com",
  projectId: "A_REMPLACER",
  storageBucket: "A_REMPLACER.appspot.com",
  messagingSenderId: "A_REMPLACER",
  appId: "A_REMPLACER"
};

window.APP_CONFIG = {
  allowedDomains: ["iadfrance.fr"],
  adminEmails: ["guillaume.roque@iadfrance.fr"]
};
