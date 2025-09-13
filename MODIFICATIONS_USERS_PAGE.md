# Modifications de la page de gestion des utilisateurs

## Résumé des changements

### 1. Suppression des statistiques
- Retrait de la section des cartes de statistiques (MetricCard)
- Suppression des imports liés aux statistiques
- Suppression de la variable `userStats` et de ses dépendances

### 2. Implémentation de la pagination côté serveur
- Installation du package `@bhplugin/vue3-datatable`
- Remplacement du tableau HTML standard par le composant Vue3Datatable
- Configuration du mode serveur avec `isServerMode: true`
- Ajout des styles CSS personnalisés pour le composant

### 3. Configuration des colonnes
- Définition des colonnes avec les propriétés `title`, `field`, `sortable`
- Utilisation de slots pour les colonnes personnalisées (utilisateur, statut, actions)
- Maintien de la fonctionnalité de tri sur les colonnes appropriées

### 4. Gestion des événements
- `@pageChange` : Gestion du changement de page
- `@pageSizeChange` : Gestion du changement de taille de page
- Conservation de la recherche et des filtres existants

### 5. Types TypeScript
- Création d'un fichier de déclaration de types pour `@bhplugin/vue3-datatable`
- Résolution des problèmes de types TypeScript

## Fonctionnalités conservées
- Recherche d'utilisateurs avec debounce
- Filtrage par profil
- Actions CRUD (voir, modifier, supprimer)
- Navigation vers les pages de détail et d'édition
- Notifications de succès

## Avantages de la nouvelle implémentation
- Pagination côté serveur pour de meilleures performances
- Interface utilisateur moderne et responsive
- Gestion automatique de la pagination
- Support du tri côté serveur
- Meilleure expérience utilisateur avec les indicateurs de chargement
