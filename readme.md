# GIT

## Rappels de base

* Chacun fork le projet. Si git clone du projet de Jeff, il faut modifier le git config pour pusher sur votre github
* Une branche par fonctionnalité. Vous ne travaillez jamais sur la branche master.
* La branche doit être nommée explicitement avec le nom de la fonctionnalité(ex: "element-anime-map")
* Vous pushez la branch sur le dépôt github lorsque la fonctionnalité est prête et vous faites un pull request.

## Initialisation d'un dépôt git
* git init: initialise un dépôt git dans le répertoire courant.

## Tracking & versionning (Snapshotting)

* git add <nomdufichieroudurépertoire>: Ajout d'un ou plusieurs fichiers ou répertoires du tracking.
* git rm <nomduoudesfichiersouduoudesrépertoires>: Enlève un ou plusieurs fichiers ou répertoires du tracking.
* git status: Affiche le statut des fichiers, ceux qui sont trackés et ceux qui ne le sont pas.
* git commit -m "Message à afficher": Versionne les fichiers trackés sous un numéro de commit et lie le message à afficher à ce commit.

## Récupération d'un dépôt git à distance (github, gitlab, etc)
* git clone <urldudépôtàrécupérer>: clone le dépôt à distance dans le répertoire courant.

## Branching 
* git branch -d: Supprime la branche courante.
* git branch
* git checkout -b: Ajout d'une branche sur lequel on passe.
* git checkout <nom de la branche>: On passe sur la branche spécifiée.
* git log: Permet d'afficher les commits
* git tag <nomdutag>: Permet de donner une version de tag au projet.


## Partage et update des projets.

* git pull: Incorpore les changements d'un dépôt à distance dans la branche courante.
* git push: On met à jour le dépôt à distance avec le dépôt git local.


