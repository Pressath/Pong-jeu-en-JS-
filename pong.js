// selection du canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");


// creation du joueur de l'utilisateur -- objet js 
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// creation du joueur com soitr le joueur d'ordinateur -- objet js 
const com = {
    // com pour computer
    x : cvs.height + 90,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

// creation de la balle -- objet js
const ball ={
    x : cvs.height/2,
    y : cvs.height/2,
    radius : 5,
    speed : 2,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}


// dessiner le rectangle --- fonction
function drawRect(x,y,w,h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// creer le milieu --- objet js
const net = {
    x : cvs.width / 2,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
}

// dessiner le milieu --- fonction
function drawNet() {
    for (let i = 0; i < cvs.height; i +=15) {
       drawRect(net.x, net.y + i, net.width, net.height, net.color)
        
    }
}


//  dessiner le cercle --- fonction
function drawCircle(x,y,r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

// écrire le texte --- fonction
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '30px fantasy';
    ctx.fillText(text, x, y);
}

// render the game --- fonction
function render() {
    // netoyer le canvas --- fonction
    drawRect(0, 0, cvs.width, cvs.height, "BLACK");

    //dessiner le net --- fonction
    drawNet();

    // ecire le score --- fonction
    drawText(user.score, cvs.width/4, cvs.height/5, "Red");
    drawText(com.score, 3 * cvs.width/4, cvs.height/5, "red");

    // dessiner l'utilisateur et le com --- fonction
    drawRect(user.x, user.y, user.width, user.height, user.color)
    drawRect(com.x, com.y, com.width, com.height, com.color)

    // dessiner la balle --- fonction
    drawCircle(ball.x, ball.y, ball.radius, ball.color)
}


// controler l'utilisateur --- fonction
cvs.addEventListener('mousemove', movePaddle);
function movePaddle(event){
    let rect = cvs.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height/2; 
}

// detection de la collision --- fonction
// b = bordure et p c'est le player soit user ou com
function collisionDetect(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.rigth  = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height  ;
    p.left = p.x;
    p.rigth = p.x + p.width;

    return b.rigth > p.left && b.bottom > p.top && b.left < p.rigth && b.top < p.bottom;
}   


// remettre la balle
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = Math.random() * 100; // redirection alearoire de balle
    ball.speed = 5;
    ball.velocityX = - ball.velocityY ;
}

// mise à jour -- fonction
function update() {
    ball.x += ball.velocityX ;
    ball.y += ball.velocityY;

    // controler le paddle
    let level = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * level;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = - ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    // reorientation de la balle en cas de collision
    if(collisionDetect(ball, player)){
        //ball.velocityX =- ball.velocityX;

        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint = collidePoint / (player.height/2);
        let angleRaid = collidePoint * Math.PI/4;

        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRaid);
        ball.velocityY = direction * ball.speed * Math.sin(angleRaid);
        ball.speed += 0.5;
    }

    // changer le score à chaque point cumulé
    if(ball.x - ball.radius < 0){
        com.score ++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width) {
        user.score ++;
        resetBall();
    }

}


// initialisation du jeu --- fonction
function game() {
    update();
    render();
}

// loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);