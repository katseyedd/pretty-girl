var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

// Purple space theme - more purple hues
var stars = 500;
var colorrange = [270, 280, 290, 300, 240];
var starArray = [];

// Planets array
var planets = [];
var nebulaDust = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    var opacity = Math.random();
    starArray.push({ x, y, radius, hue, sat, opacity });
}

// Initialize planets
for (var i = 0; i < 12; i++) {
    planets.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: getRandom(15, 50),
        hue: colorrange[getRandom(0, colorrange.length - 1)],
        sat: getRandom(60, 100),
        baseY: 0
    });
}

// Initialize nebula dust particles
for (var i = 0; i < 150; i++) {
    nebulaDust.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: Math.random() * 3,
        hue: getRandom(270, 300),
        opacity: Math.random() * 0.3,
        velocityX: (Math.random() - 0.5) * 0.3,
        velocityY: (Math.random() - 0.5) * 0.3
    });
}

var frameNumber = 0;
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;

var baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

function drawStars() {
    for (var i = 0; i < stars; i++) {
        var star = starArray[i];

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
        context.fill();
    }
}

function drawHeart(x, y, size) {
    var h = size * 0.6;
    context.beginPath();
    context.moveTo(x, y + h * 0.4);
    // Left bump
    context.bezierCurveTo(x - h * 0.5, y - h * 0.2, x - h * 0.8, y - h * 0.4, x - h * 0.6, y - h * 0.7);
    context.bezierCurveTo(x - h * 0.3, y - h * 0.9, x, y - h * 0.4, x, y - h * 0.1);
    // Right bump
    context.bezierCurveTo(x, y - h * 0.4, x + h * 0.3, y - h * 0.9, x + h * 0.6, y - h * 0.7);
    context.bezierCurveTo(x + h * 0.8, y - h * 0.4, x + h * 0.5, y - h * 0.2, x, y + h * 0.4);
    context.closePath();
}

function drawPlanets() {
    for (var i = 0; i < planets.length; i++) {
        var planet = planets[i];
        var orbitDistance = 30 * Math.sin(frameNumber * 0.001 + i);
        
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.fillStyle = "hsla(" + planet.hue + ", " + planet.sat + "%, 50%, 0.8)";
        context.fill();
        
        // Heart glow
        context.strokeStyle = "hsla(" + planet.hue + ", " + planet.sat + "%, 70%, 0.5)";
        context.lineWidth = 2;
        context.stroke();
    }
}

function drawNebula() {
    for (var i = 0; i < nebulaDust.length; i++) {
        var dust = nebulaDust[i];
        
        // Update position
        dust.x += dust.velocityX;
        dust.y += dust.velocityY;
        
        // Wrap around edges
        if (dust.x < 0) dust.x = canvas.offsetWidth;
        if (dust.x > canvas.offsetWidth) dust.x = 0;
        if (dust.y < 0) dust.y = canvas.offsetHeight;
        if (dust.y > canvas.offsetHeight) dust.y = 0;
        
        context.beginPath();
        context.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        context.fillStyle = "hsla(" + dust.hue + ", 80%, 60%, " + dust.opacity + ")";
        context.fill();
    }
}

function drawPurpleBackground() {
    // Create a gradient background with purple tones
    var gradient = context.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    gradient.addColorStop(0, "rgba(20, 5, 40, 1)");
    gradient.addColorStop(0.5, "rgba(30, 10, 60, 1)");
    gradient.addColorStop(1, "rgba(15, 5, 35, 1)");
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24); // Adjust font size based on screen width
    var lineHeight = 8;

    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    
    // glow effect - purple glow
    context.shadowColor = "rgba(150, 50, 255, 0.8)";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    if(frameNumber < 250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("Lara, everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    //fades out the text by decreasing the opacity
    if(frameNumber >= 250 && frameNumber < 500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("Lara, everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    //needs this if statement to reset the opacity before next statement on canvas
    if(frameNumber == 500){
        opacity = 0;
    }
    if(frameNumber > 500 && frameNumber < 750){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {           //shortens long sentence for mobile screens
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 750 && frameNumber < 1000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        
        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity - 0.01;
    }

    if(frameNumber == 1000){
        opacity = 0;
    }
    if(frameNumber > 1000 && frameNumber < 1250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1250 && frameNumber < 1500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 1500){
        opacity = 0;
    }
    if(frameNumber > 1500 && frameNumber < 1750){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1750 && frameNumber < 2000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.fillText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2000){
        opacity = 0;
    }
    if(frameNumber > 2000 && frameNumber < 2250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know you", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2250 && frameNumber < 2500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("and yet here I am to get the impossible chance to get to know you", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2500){
        opacity = 0;
    }
    if(frameNumber > 2500 && frameNumber < 2750){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["When I think about how big the universe is,", "all those stars and galaxies out there"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("When I think about how big the universe is, all those stars and galaxies out there", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2750 && frameNumber < 3000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["When I think about how big the universe is,", "all those stars and galaxies out there"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("When I think about how big the universe is, all those stars and galaxies out there", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 3000){
        opacity = 0;
    }
    if(frameNumber > 3000 && frameNumber < 3250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["all the things that had to happen just right,", "it makes what we have feel even more special"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("all the things that had to happen just right, it makes what we have feel even more special", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 3250 && frameNumber < 3500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["all the things that had to happen just right,", "it makes what we have feel even more special"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("all the things that had to happen just right, it makes what we have feel even more special", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 3500){
        opacity = 0;
    }
    if(frameNumber > 3500 && frameNumber < 3750){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Out of every possible way our lives could have gone,", "we somehow found each other"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Out of every possible way our lives could have gone, we somehow found each other", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 3750 && frameNumber < 4000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Out of every possible way our lives could have gone,", "we somehow found each other"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Out of every possible way our lives could have gone, we somehow found each other", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 4000){
        opacity = 0;
    }
    if(frameNumber > 4000 && frameNumber < 4250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Like two stars pulled together,", "we were meant to find one another"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Like two stars pulled together, we were meant to find one another", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 4250 && frameNumber < 4500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Like two stars pulled together,", "we were meant to find one another"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Like two stars pulled together, we were meant to find one another", canvas.width/2, canvas.height/2);
        }
        
        opacity = opacity - 0.01;
    }

    if(frameNumber == 4500){
        opacity = 0;
    }
    if(frameNumber > 4500 && frameNumber < 99999){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["I love you so much schatje, more than", "all the time and space in the universe can contain"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("I love you so much schatje, more than all the time and space in the universe can contain", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    
    if(frameNumber >= 4750 && frameNumber < 99999){
        context.fillStyle = `rgba(180, 100, 255, ${secondOpacity})`;


        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and I can't wait to spend all the time with you", "our love is interstellar"], canvas.width / 2, (canvas.height/2 + 60), fontSize, lineHeight);
        } else {
            context.fillText("and I can't wait to spend all the time in the world with you. Our love is interstellar", canvas.width/2, (canvas.height/2 + 50));
        }

        secondOpacity = secondOpacity + 0.01;
    }

    if(frameNumber >= 5000 && frameNumber < 99999){
        context.fillStyle = `rgba(180, 100, 255, ${thirdOpacity})`;
        context.fillText("Happy Valentine's Day my pretty girl <3", canvas.width/2, (canvas.height/2 + 120));
        thirdOpacity = thirdOpacity + 0.01;
    }   

     // Reset the shadow effect after drawing the text
     context.shadowColor = "transparent";
     context.shadowBlur = 0;
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
}

function draw() {
    drawPurpleBackground();
    
    drawStars();
    updateStars();
    drawNebula();
    drawPlanets();
    drawText();

    if (frameNumber < 99999) {
        frameNumber++;
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.requestAnimationFrame(draw);

