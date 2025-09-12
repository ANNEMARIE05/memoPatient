# Memo Patient

Une application moderne de gestion des patients médicaux développée avec Vue.js 3, TypeScript et Tailwind CSS v4.

## 🚀 Fonctionnalités

- **Page de connexion moderne** avec design sophistiqué
- **Dashboard complet** avec métriques et graphiques
- **Gestion des patients** avec registre complet
- **Système de messagerie** avec envoi de SMS
- **Gestion des rendez-vous** et dossiers médicaux
- **Interface responsive** et animations fluides
- **Authentification sécurisée** avec protection des routes

## 🛠️ Technologies utilisées

- **Vue.js 3** avec Composition API
- **TypeScript** pour la sécurité des types
- **Tailwind CSS v4** pour le styling moderne
- **Vue Router** pour la navigation
- **Font Awesome** pour les icônes
- **Vite** comme bundler

## 📦 Installation

1. Clonez le repository
2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Ouvrez votre navigateur sur `http://localhost:5173`

## 🔐 Connexion

Utilisez les identifiants suivants pour vous connecter :
- **Email** : `admin@test.com`
- **Mot de passe** : `Admin123@`

## 🎨 Design

L'application suit un design moderne avec :
- Cards avec bordures carrées et ombres légères
- Animations fluides et transitions
- Interface entièrement en français
- Couleurs cohérentes et professionnelles
- Responsive design pour tous les écrans

## 📱 Fonctionnalités principales

### Page de connexion
- Design moderne avec image de fond
- Validation des champs
- Gestion des erreurs
- Animations d'entrée

### Dashboard
- Métriques en temps réel
- Graphiques interactifs
- Planning du jour
- Dernières visites
- Navigation par onglets

### Composants réutilisables
- `MetricCard` : Cartes de métriques avec mini-graphiques
- `ChartCard` : Cartes avec graphiques en barres
- `DonutChart` : Graphiques en donut
- `Sidebar` : Navigation latérale
- `Header` : En-tête avec recherche et notifications

## 🔒 Sécurité

- Protection des routes avec `AuthGuard`
- Stockage sécurisé des sessions
- Validation des formulaires
- Modal de confirmation pour la déconnexion

## 🚀 Déploiement

Pour construire l'application pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## 📄 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── AuthGuard.vue   # Protection des routes
│   ├── ChartCard.vue   # Cartes avec graphiques
│   ├── DonutChart.vue  # Graphiques en donut
│   ├── Header.vue      # En-tête
│   ├── MetricCard.vue  # Cartes de métriques
│   └── Sidebar.vue     # Navigation latérale
├── views/              # Pages principales
│   ├── Dashboard.vue   # Tableau de bord
│   └── LoginPage.vue   # Page de connexion
├── App.vue             # Composant principal
├── main.ts             # Point d'entrée
└── style.css           # Styles globaux
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.