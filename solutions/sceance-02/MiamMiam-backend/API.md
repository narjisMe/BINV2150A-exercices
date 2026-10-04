# API MiamMiam

## GET /

Vérifie que le serveur répond.

### Authentification

Aucune.

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : renvoie le texte « MiamMiam API ».

Adresse du serveur : http://localhost:3000

## GET /recipes/:id

Récupère une recette à partir de son identifiant.

### Paramètre de chemin

- `id` : entier strictement positif identifiant la recette.

### Authentification

Aucune : cette route est publique.

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : renvoie la recette au format JSON (RecipeDTO).
- `400 Bad Request` : l’identifiant est invalide.
- `404 Not Found` : aucune recette ne possède cet identifiant.

### Exemple

GET http://localhost:3000/recipes/1

## GET /recipes

Récupère la liste des recettes, éventuellement filtrée.

### Paramètres de requête facultatifs

- `categoryId` : identifiant entier d’une catégorie.
- `authorId` : identifiant entier de l’auteur.
- `search` : texte recherché dans le titre ou la description.
- `ingredient` : texte recherché dans le nom des ingrédients.
- `maxPrepTime` : durée maximale totale, préparation et cuisson
  comprises, en minutes (entier positif ou nul).

Les filtres peuvent être combinés : une recette doit respecter
tous les critères fournis.

### Authentification

Aucune : cette route est publique.

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : tableau de recettes au format JSON (RecipeDTO[]).
  Si aucune recette ne correspond, renvoie `[]`.
- `400 Bad Request` : categoryId ou authorId n’est pas un entier,
  ou maxPrepTime n’est pas un entier positif ou nul.

### Exemple

GET http://localhost:3000/recipes?search=chocolat&maxPrepTime=60

## POST /recipes

Crée une recette. L’utilisateur connecté devient son auteur.

### En-têtes

- `Content-Type: application/json`
- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Objet NewRecipeDTO contenant :

- `title` : texte non vide.
- `description` : texte.
- `imageUrl` : texte facultatif.
- `prepTime` et `cookTime` : nombres positifs ou nuls, en minutes.
- `servings` : nombre supérieur ou égal à 1.
- `difficulty` : nombre compris entre 1 et 5.
- `categoryId` : identifiant d’une catégorie existante.
- `tags` : tableau de textes facultatif.
- `ingredients` : tableau d’objets contenant `name` (texte),
  `quantity` (nombre) et `unit` (texte).
- `steps` : tableau de textes.

L’identifiant, l’auteur et les dates sont définis par le serveur.

### Réponses

- `201 Created` : renvoie la recette créée (RecipeDTO).
- `400 Bad Request` : données invalides ou catégorie inexistante.
- `401 Unauthorized` : token absent ou invalide.
- `500 Internal Server Error` : échec de l’enregistrement.

## PUT /recipes/:id

Remplace les données modifiables d’une recette existante.
Son identifiant, son auteur et sa date de création sont conservés.

### Paramètre de chemin

- `id` : entier strictement positif identifiant la recette.

### Authentification

Utilisateur connecté, auteur de la recette ou administrateur.

### En-têtes

- `Content-Type: application/json`
- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Objet NewRecipeDTO, avec les mêmes champs et contraintes
que POST /recipes.

Tous les champs obligatoires doivent être envoyés,
même ceux dont la valeur ne change pas.

### Réponses

- `204 No Content` : recette modifiée, sans corps de réponse.
- `400 Bad Request` : identifiant ou données invalides,
  ou catégorie inexistante.
- `401 Unauthorized` : token absent ou invalide.
- `403 Forbidden` : utilisateur ni auteur ni administrateur.
- `404 Not Found` : recette inexistante.
- `500 Internal Server Error` : échec de l’enregistrement.

## DELETE /recipes/:id

Supprime une recette et la retire des favoris des utilisateurs.

### Paramètre de chemin

- `id` : entier strictement positif identifiant la recette.

### Authentification

Utilisateur connecté, auteur de la recette ou administrateur.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `204 No Content` : recette supprimée, sans corps de réponse.
- `400 Bad Request` : identifiant invalide.
- `401 Unauthorized` : token absent ou invalide.
- `403 Forbidden` : utilisateur ni auteur ni administrateur.
- `404 Not Found` : recette inexistante.
- `500 Internal Server Error` : échec de la suppression.

### Exemple

DELETE http://localhost:3000/recipes/5
Authorization: <token reçu à la connexion>

## POST /auth/register

Crée un compte utilisateur et renvoie un token de connexion.

### Authentification

Aucune.

### En-tête

- `Content-Type: application/json`

### Corps de la requête

- `email` : texte non vide contenant `@`.
- `password` : texte non vide.
- `firstName` : texte non vide.
- `lastName` : texte non vide.

### Réponses

- `201 Created` : compte créé, renvoie un objet contenant `token`.
- `400 Bad Request` : données invalides.
- `409 Conflict` : création refusée, notamment si l’email est déjà utilisé.
- `500 Internal Server Error` : échec de la connexion après création.

## POST /auth/login

Vérifie l’email et le mot de passe, puis renvoie un token.

### Authentification

Aucune connexion préalable nécessaire.

### En-tête

- `Content-Type: application/json`

### Corps de la requête

- `email` : texte non vide.
- `password` : texte non vide.

### Réponses

- `200 OK` : connexion réussie, renvoie un objet contenant `token`.
- `400 Bad Request` : email ou mot de passe absent,
  vide ou d’un type incorrect.
- `401 Unauthorized` : identifiants incorrects.

## GET /auth/me

Renvoie les informations de l’utilisateur identifié par le token.

### Authentification

Utilisateur connecté.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : informations de l’utilisateur au format JSON (UserDTO),
  sans son mot de passe.
- `401 Unauthorized` : token absent ou invalide.

## GET /categories

Récupère toutes les catégories de recettes.

### Authentification

Aucune.

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : tableau de catégories au format JSON (CategoryDTO[]).
  Si aucune catégorie n’existe, renvoie `[]`.

## GET /categories/:id

Récupère une catégorie à partir de son identifiant.

### Paramètre de chemin

- `id` : entier strictement positif identifiant la catégorie.

### Authentification

Aucune.

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : catégorie au format JSON (CategoryDTO).
- `400 Bad Request` : identifiant invalide.
- `404 Not Found` : catégorie inexistante.

## GET /users

Récupère la liste de tous les utilisateurs.

### Authentification

Administrateur connecté uniquement.

### En-tête

- `Authorization: <token administrateur reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : tableau d’utilisateurs au format JSON (UserDTO[]),
  sans les mots de passe.
- `401 Unauthorized` : token absent ou invalide.
- `403 Forbidden` : utilisateur connecté non administrateur.

## GET /users/:id

Récupère les informations d’un utilisateur.

### Paramètre de chemin

- `id` : entier strictement positif identifiant l’utilisateur.

### Authentification

Utilisateur connecté.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `200 OK` :
  - UserDTO si l’utilisateur consulte son propre profil
    ou s’il est administrateur.
  - UserShortDTO pour le profil d’un autre utilisateur :
    uniquement son identifiant, son prénom et son nom.
  - Le mot de passe n’est jamais renvoyé.
- `400 Bad Request` : identifiant invalide.
- `401 Unauthorized` : token absent ou invalide.
- `404 Not Found` : utilisateur inexistant.

## DELETE /users/:id

Supprime un utilisateur.
Un administrateur ne peut pas supprimer son propre compte.

### Paramètre de chemin

- `id` : entier strictement positif identifiant l’utilisateur.

### Authentification

Administrateur connecté uniquement.

### En-tête

- `Authorization: <token administrateur reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `204 No Content` : utilisateur supprimé, sans corps de réponse.
- `400 Bad Request` : identifiant invalide ou tentative
  de supprimer son propre compte.
- `401 Unauthorized` : token absent ou invalide.
- `403 Forbidden` : utilisateur connecté non administrateur.
- `404 Not Found` : utilisateur inexistant.
- `500 Internal Server Error` : échec de la suppression.

## GET /users/me/favorites

Récupère les recettes favorites de l’utilisateur connecté.

### Authentification

Utilisateur connecté.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `200 OK` : tableau de recettes au format JSON (RecipeDTO[]).
  Si aucun favori n’est trouvé, renvoie `[]`.
- `401 Unauthorized` : token absent ou invalide.

## PUT /users/me/favorites/:recipeId

Ajoute une recette aux favoris de l’utilisateur connecté.
Si elle est déjà présente, aucun doublon n’est ajouté.

### Paramètre de chemin

- `recipeId` : entier strictement positif identifiant la recette.

### Authentification

Utilisateur connecté.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun : l’identifiant de la recette est fourni dans le chemin.

### Réponses

- `204 No Content` : recette ajoutée ou déjà présente dans les favoris.
- `400 Bad Request` : identifiant invalide.
- `401 Unauthorized` : token absent ou invalide.
- `404 Not Found` : recette inexistante.
- `500 Internal Server Error` : échec de l’enregistrement.

## DELETE /users/me/favorites/:recipeId

Retire une recette des favoris de l’utilisateur connecté.
La recette elle-même n’est pas supprimée.

### Paramètre de chemin

- `recipeId` : entier strictement positif identifiant la recette.

### Authentification

Utilisateur connecté.

### En-tête

- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Aucun.

### Réponses

- `204 No Content` : recette retirée des favoris,
  ou déjà absente des favoris.
- `400 Bad Request` : identifiant invalide.
- `401 Unauthorized` : token absent ou invalide.
- `500 Internal Server Error` : échec de l’enregistrement.

## PATCH /recipes/:id

Modifie uniquement les champs fournis d’une recette.
Les champs absents conservent leur valeur actuelle.
L’identifiant, l’auteur et la date de création sont conservés.
La date de modification est actualisée.

### Paramètre de chemin

- `id` : entier strictement positif identifiant la recette.

### Authentification

Utilisateur connecté, auteur de la recette ou administrateur.

### En-têtes

- `Content-Type: application/json`
- `Authorization: <token reçu à la connexion>`

### Corps de la requête

Objet UpdatedRecipeDTO.

Les champs de POST /recipes peuvent être envoyés, mais ils sont
tous facultatifs. Les champs fournis respectent les mêmes
contraintes que pour la création.

Un tableau fourni remplace entièrement l’ancien tableau.
Un objet vide est accepté : les données restent identiques,
mais la date de modification est actualisée.

### Réponses

- `200 OK` : renvoie la recette modifiée (RecipeDTO).
- `400 Bad Request` : identifiant ou données invalides,
  ou catégorie fournie inexistante.
- `401 Unauthorized` : token absent ou invalide.
- `403 Forbidden` : utilisateur ni auteur ni administrateur.
- `404 Not Found` : recette inexistante.
- `500 Internal Server Error` : échec de l’enregistrement.