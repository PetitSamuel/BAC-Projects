

/* déclare les variables (joueur + obstacles)
il n'y a qu'un seul caractère joueur cependant les obstacles sont tous générés
indépendament à partir de la fonction obstacles */

var joueur;
var obst = [];

/* distA et distB sont les normes des vecteurs partant des sommets haut et
bas du coté droit arrivant aux extremités des deux obstacles */

var distA;
var distB;

/* a représente l'index de l'obstacle à passer ( = l'obstacle avec
lequel la distance est donnée) */

var a = 0;
var score = 0;

/* les fonctions draw et setup son présentes lors de l'ouverture du fichier p5,
la fonction draw représente ce qui est affiché à l'écran et la fonction setup
l'initialisation du programme */

function setup() {

  // définit l'espace de jeu

  createCanvas(900, 500);

  /* - associe la variable joueur ET le tableau obst au fonctions créées
      nous pouvons maintenant utiliser le nom de l'objet pour obtenir des
  caractéristiques spécifiques à cet objet, par exemple, à la place de "this.x",
  on pourrait utiliser "joueur.x"  */
  joueur = new Joueur();
  obst.push(new Obstacle());

}


/*la fonction draw représente ce qui est affiché à l'écran, tout ce qui est à
l'intérieur est effectué de nombreuses fois par secondes */
function draw() {


/* distA et distB sont les 2 normes allant des deux extremités du carré aux
2 extremités de l'obstacles ils sont calculés a l'aide d'un vecteur de type AB :
 (xB - xA; yB - yA) leur norme est ensuite de RACINE(x^2 + y^2)
a noter : - seul la position y diffère des 2 vecteurs
          - pow (a, b) = a^b */
  distA = int(sqrt(pow((obst[a].xObs - 60 - joueur.xJoueur), 2) + pow((obst[a].hauteurObs - joueur.yJoueur), 2)));
  distB = int(sqrt(pow((obst[a].xObs - 60 - joueur.xJoueur), 2) + pow((height - obst[a].hauteurObs - joueur.yJoueur - 60), 2)));

  //background gère l'aspect du fond
  background(198, 83, 83);

  /* execJoueur fonction présente dans la fonction Joueur()
  détermine son aspect et son déplacement selon les valeurs définies */
  joueur.execJoueur();

  //gère la taille du texte
  textSize(18);

  //permet d'afficher les textes à l'écran
  // text(text affiché, position X, position Y)
  fill(0);
  text("Distance A: " + distA + " px", 600, 400);
  text("Distance B: " + distB + " px", 600, 450);
  text("Score : " + score, 600, 50);

  //a l'opposé du joueur, il y a plusieurs obstacles, on a besoin d'une boucle les parcourant tous pour les animer tous
  for (var i = 0; i < obst.length; i++) {

    //même commentaire que pour le joueur, cela détermine le déplacement, position et aspect des obstacles
    obst[i].execObs();

//conditions gérant l'appartion d'obstacles : chaque obstacle est espacé de 350 px
if(obst[i].xObs == width - 350){
      obst.push(new Obstacle());
}

// arrête le jeu pour une valeur a d'obstacles définis
if(a >= 5){

//arrête les déplacements et positionne le joueur au milieu
  joueur.yJoueur = height / 2 - 60 / 2 ;
  obst[i].vitesseObs = 0;

//affiche le score final
  fill(51, 51, 51);
  text("Vous avez obtenu un score de : "+score, 330, 250)
}

  }

  //conditions permettant d'augmenter a (l'index du prochain obstacle a passer)
      if (joueur.xJoueur == obst[a].xObs) {
        a = a + 1;
      }

  //2 conditions permettant d'augmenter ou baisser le score
      if (joueur.xJoueur + 60 == obst[a].xObs) {
        if (joueur.yJoueur < obst[a].hauteurObs || (joueur.yJoueur + 60) > height - obst[a].hauteurObs) {

  //A noter : le score augmente proportionellement en fonction de l'espacement de la porte
          score = score - obst[a].distance;

  //à noter : le else est dans la premiere boucle if
        } else {

          //si le joueur n'arrive pas à passer la porte, son score diminue
          //(beaucoup si l'espace libre est grand, moins si l'espace est étroit)
          score = score + height - obst[a].distance;
        }
      }
}


// la fonction mousePressed et mouseIsPressed sont incluses à p5.js
//a noter : on aurait aussi pu utiliser l'équivalent une touche du clavier

function mousePressed() {

//cette fonction est à l'extérieur de draw()
//elle est uniquement executée si la souris est pressée

//effectue un saut suivant les valeurs définies
    joueur.saut();
}

//Ceci sont les 2 fonctions permettant la construction des 2 objets requis au jeu
function Joueur() {

  //position x et y de la boule
  this.xJoueur = 100;
  this.yJoueur = 0;

  //variables permettant de gérer le déplacement du joueur sur l'axe y
  //les valeurs ont été définies pour permettre un environnement de jeu correct
  this.pesanteur = 0.35;
  this.forceSaut = 13;
  this.qttMvt = 0;


  //contient l'aspect + les paramètres de déplacement vers le bas + ses limites
  this.execJoueur = function() {

    //définit l'aspect visuel du joueur en fonction de ses positions x et y
    //la fonction rect est de la forme rect(X, Y, Largeur, Hauteur)
    fill(4, 167, 173);
    rect(this.xJoueur, this.yJoueur, 60, 60);


//suite de calculs permettant le déplacement du joueur sur l'axe y

        //ajoute de façon continue la valeur de la pesanteur à la quanitée de mouvement
        this.qttMvt = this.qttMvt + this.pesanteur;


        //change ensuite la position y par cette valeur de mouvement,
        //cette valeur de mouvement pourra ensuite être affectée par le saut
        this.yJoueur = this.yJoueur + this.qttMvt;

        //une valeur de mouvement positive va faire baisser la position de l'objet,
        //une valeur négative va la monter
        // car l'origine du repère est situé en haut à gauche de l'espace


        //limite le déplacement du joueur hors du cadre de jeu
        //permet l'effet de "portes", si le joueur passe la porte du bas il arrive en haut et vice versa
        if (this.yJoueur > height) {
          this.yJoueur = 0;
        }
        if (this.yJoueur < 0) {
          this.yJoueur = height;
        }

        // limite les quantités de mouvement (pour éviter des déplacement trop rapide)
        if (this.qttMvt < -20) {
          this.qttMvt = -20
        }
        if (this.qttMvt > 20) {
          this.qttMvt = 20
        }
          }

        //permet le saut lorsque cette fonction est executée
        //agit sur "valeurMouv", si cette valeur est négative un déplacement vers le haut sera apreçu
  this.saut = function() {
    this.qttMvt = this.qttMvt - this.forceSaut;
  }
    }


//cette fonction est responsables des obstacles du jeux
function Obstacle() {

//this.vide est l'espace entre le milieu (height/2) et une extremité
this.vide = random(60, 200);
//this.distance correspond au vide total entre les 2 obstacles
this.distance = int(this.vide *2);

//correspond à la hauteur des 2 obstacles
this.hauteurObs = height/2 - this.vide;


this.xObs = width;
this.vitesseObs = 2;

//donne l'aspect, position, déplacement aux objets Obstacles
  this.execObs = function() {

// donne la couleur (rgb)
    fill(255, 209, 91);

    //rect(x, y,largeur, hauteur) à partir du point d'origine haut gauche
    //x est commun à chaque couple d'obstacle
    //y est la position la plus haute du rectangle, donc 0 et Height - hauteur obstacle
    //largeur est constant
    //la hauteur du haut et du bas sont égales
    rect(this.xObs, 0, 30, this.hauteurObs);
    rect(this.xObs, height - this.hauteurObs, 30, this.hauteurObs);

//la vitesse de déplacement des obstacle est fixe, un obstacle
//commence à Width et ce calcul diminue sa position jusqu'à sortir de l'espace défini
    this.xObs = this.xObs - this.vitesseObs;
  }
}
