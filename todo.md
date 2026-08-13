# Correctif assets et stack

## Correctif logos autonomes — nouvelle passe

- [x] Créer un module unique contenant les vrais logos SVG de la stack.
- [x] Supprimer les imports `@/assets/stack-icons/*.svg` de `Home.tsx.
- [x] Vérifier que le build ne dépend plus de fichiers d’icônes absents.
- [x] Tester après redémarrage et sauvegarder le checkpoint.


## Correctif logos et cartes — nouvelle passe

- [x] Identifier la règle qui limite la hauteur réelle des images de service.
- [x] Afficher le visuel complet sans crop et conserver un texte de carte lisible.
- [x] Ajouter de vrais logos SVG de marque dans `src/assets/stack-icons/`.
- [x] Remplacer les faux symboles inline par les logos SVG locaux.
- [x] Recompiler, tester desktop/mobile et sauvegarder un nouveau checkpoint.


## Correctif cartes et carrousel

- [x] Afficher l’image complète des cartes sans crop agressif et préserver le petit texte.
- [x] Supprimer la seconde ligne du stack et garder un seul rail répété en boucle.
- [x] Rendre les marques/icônes de chaque technologie visiblement distinctes.
- [x] Tester le rendu desktop/mobile et sauvegarder le checkpoint.


## Correctif imports stack

- [x] Supprimer les imports `@/assets/stack-icons/*.svg` absents du projet utilisateur.
- [x] Ajouter un rendu SVG autonome ou un fallback visuel directement dans `Home.tsx`.
- [x] Recompiler et vérifier le carrousel après redémarrage.


## Assets locaux du site

- [x] Créer un dossier `src/assets/site-images/` versionné dans le projet.
- [x] Copier le visuel hero et les visuels des cartes de services dans ce dossier.
- [x] Remplacer toutes les références `/manus-storage/...` par des imports locaux.
- [x] Vérifier le build et le rendu avec les images réellement incluses.


## Correctif de fiabilité après redémarrage

## Correctif de compilation

- [x] Supprimer l’import `simple-icons` non résolu de `Home.tsx.
- [x] Remplacer les marques externes par des SVG embarqués et testables sans dépendance.
- [x] Vérifier le build et le preview après redémarrage.


- [x] Copier les images réellement utilisées dans un emplacement frontend autonome ou les servir via les URLs webdev persistantes validées.
- [x] Remplacer les icônes CDN par des SVG de marque locaux ou embarqués.
- [x] Refaire un test après redémarrage complet du serveur.


- [x] Vérifier les chemins utilisés par le hero et les cartes de services.
- [x] Remplacer les références fragiles par des URLs d’assets persistantes ou des fallbacks fiables.
- [x] Ajouter une icône visible pour chaque technologie de la stack.
- [x] Activer le défilement animé du carrousel avec une boucle sans saut.
- [x] Tester le rendu desktop/mobile et la console navigateur.
- [ ] Créer un checkpoint final.

## Notes

- Ne pas modifier le backend ni supprimer d’assets avant d’avoir confirmé qu’ils sont inutilisés.
- Préserver la direction visuelle SA7TEC : fond clair, bleu électrique, cartes compactes, animation sobre.

## Style Decisions

- Les images de hero et de services doivent rester contextuelles, compactes et visibles.
- Les icônes de stack doivent être reconnaissables au premier regard, sans transformer la section en dashboard chargé.
- L’animation doit être continue, douce et désactivable via `prefers-reduced-motion`.

## Style reference

- Design system: editorial product-studio, cobalt blue accents, cream/light surfaces, condensed display typography, compact image cards, restrained motion.
