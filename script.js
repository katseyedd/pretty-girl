var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

// Envelope functionality
var envelope = document.getElementById("envelope");
var isEnvelopeOpen = false;

envelope.addEventListener("click", function() {
    if (!isEnvelopeOpen) {
        isEnvelopeOpen = true;
        envelope.classList.add("opened");
    }
});

envelope.addEventListener("touchstart", function(e) {
    e.preventDefault();
    envelope.click();
});

// Purple space theme - more purple hues
var stars = 500;
var colorrange = [270, 280, 290, 300, 240];
var starArray = [];

// Planets array
var planets = [];
var nebulaDust = [];
var sparkles = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values and varied sizes
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    // Randomize star sizes - some big, some small
    var radius = Math.random() < 0.2 ? Math.random() * 2.5 : Math.random() * 1.2;
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
        radius: Math.random() * 4 + 1,
        hue: getRandom(250, 310),
        opacity: Math.random() * 0.2 + 0.05,
        velocityX: (Math.random() - 0.5) * 0.2,
        velocityY: (Math.random() - 0.5) * 0.2
    });
}

// Initialize falling stars array
var fallingStars = [];

function initFallingStars() {
    if (Math.random() < 0.02) { // 2% chance per frame to spawn a new falling star
        fallingStars.push({
            x: Math.random() * canvas.offsetWidth,
            y: -20,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1.5,
            opacity: 1,
            hue: [270, 280, 290, 300, 320][Math.floor(Math.random() * 5)],
            length: Math.random() * 40 + 20
        });
    }
    // Remove dead stars from array
    fallingStars = fallingStars.filter(function(star) { return star.opacity > 0; });
}

// Initialize cosmic nebula clouds for galaxy effect
var nebulaClouds = [];
for (var i = 0; i < 12; i++) {
    nebulaClouds.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: Math.random() * 200 + 100,
        hue: getRandom(240, 310),
        opacity: Math.random() * 0.1 + 0.02
    });
}

// Initialize sparkles around hearts
function initSparkles() {
    sparkles = [];
    for (var i = 0; i < 200; i++) {
        sparkles.push({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            size: Math.random() * 2,
            opacity: Math.random(),
            twinkleSpeed: Math.random() * 0.05 + 0.02,
            targetOpacity: Math.random(),
            distToHeart: Math.random() * 300 + 50,
            angle: Math.random() * Math.PI * 2
        });
    }
}

initSparkles();

// Moon setup
var moonImage = new Image();
moonImage.src = "public/moon.png";
var moon = {
    x: canvas.offsetWidth * 0.5,
    y: canvas.offsetHeight * 0.5,
    radius: 250,
    angle: 0,
    opacity: 0.4
};

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
        // Brighter fill with increased lightness
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 95%, " + (star.opacity * 0.9 + 0.1) + ")";
        context.fill();
        
        // Add glow effect around stars
        context.strokeStyle = "hsla(" + star.hue + ", 100%, 90%, " + (star.opacity * 0.5) + ")";
        context.lineWidth = star.radius * 0.5;
        context.stroke();
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
        
        // Enhanced romantic glow effect - multiple layers
        var glowIntensity = Math.sin(frameNumber * 0.01 + i) * 0.3 + 0.7;
        
        // Extra outer glow for more prominence
        context.strokeStyle = "hsla(320, 100%, 50%, " + (glowIntensity * 0.2) + ")";
        context.lineWidth = 16;
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.stroke();
        
        // Outer romantic glow (pink/magenta)
        context.strokeStyle = "hsla(320, 100%, 60%, " + (glowIntensity * 0.4) + ")";
        context.lineWidth = 8;
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.stroke();
        
        // Mid glow (purple)
        context.strokeStyle = "hsla(" + planet.hue + ", " + planet.sat + "%, 70%, " + (glowIntensity * 0.6) + ")";
        context.lineWidth = 4;
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.stroke();
        
        // Heart fill
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.fillStyle = "hsla(" + planet.hue + ", " + planet.sat + "%, 50%, 0.9)";
        context.fill();
        
        // Inner bright glow
        context.strokeStyle = "hsla(320, 100%, 80%, " + (glowIntensity * 0.5) + ")";
        context.lineWidth = 1;
        drawHeart(planet.x, planet.y + orbitDistance, planet.radius);
        context.stroke();
    }
}

function drawMoon() {
    if (!moonImage.complete) return; // Wait for image to load
    
    // Gentle floating animation
    moon.angle += 0.001; // Rotation speed
    var floatOffset = Math.sin(frameNumber * 0.0015) * 15;
    
    context.save();
    context.globalAlpha = moon.opacity;
    
    // Add glow effect
    context.shadowColor = "rgba(200, 180, 255, 0.6)";
    context.shadowBlur = 40;
    
    // Translate to moon center for rotation
    context.translate(moon.x, moon.y + floatOffset);
    context.rotate(moon.angle);
    
    // Draw moon image
    context.drawImage(
        moonImage,
        -moon.radius,
        -moon.radius,
        moon.radius * 2,
        moon.radius * 2
    );
    
    // Apply purple tint only within the moon circle
    context.globalCompositeOperation = "multiply";
    context.fillStyle = "rgba(180, 100, 255, 0.6)";
    context.beginPath();
    context.arc(0, 0, moon.radius, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
    
    context.restore();
}

function drawSparkles() {
    for (var i = 0; i < sparkles.length; i++) {
        var sparkle = sparkles[i];
        
        // Update twinkle effect
        if (sparkle.opacity >= sparkle.targetOpacity) {
            sparkle.opacity -= sparkle.twinkleSpeed;
            if (sparkle.opacity <= 0) {
                sparkle.targetOpacity = Math.random() * 0.9 + 0.3;
                sparkle.opacity = 0;
            }
        } else {
            sparkle.opacity += sparkle.twinkleSpeed;
        }
        
        // Draw sparkle with brighter colors
        context.beginPath();
        context.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2);
        context.fillStyle = "hsla(300, 100%, 85%, " + sparkle.opacity + ")";
        context.fill();
        
        // Add stronger glow around sparkle
        context.strokeStyle = "hsla(280, 100%, 90%, " + sparkle.opacity + ")";
        context.lineWidth = 1.5;
        context.stroke();
        
        // Add a cross pattern for sparkle effect with more visibility
        context.strokeStyle = "hsla(290, 100%, 88%, " + (sparkle.opacity * 0.9) + ")";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(sparkle.x - sparkle.size * 3, sparkle.y);
        context.lineTo(sparkle.x + sparkle.size * 3, sparkle.y);
        context.moveTo(sparkle.x, sparkle.y - sparkle.size * 3);
        context.lineTo(sparkle.x, sparkle.y + sparkle.size * 3);
        context.stroke();
    }
}

function drawFallingStars() {
    for (var i = 0; i < fallingStars.length; i++) {
        var star = fallingStars[i];
        
        // Update position with slight easing for smoother movement
        star.x += star.vx;
        star.y += star.vy;
        star.opacity -= 0.006; // Slower fade for smoother effect
        
        // Remove if off screen or too faded
        if (star.y > canvas.offsetHeight || star.opacity <= 0) {
            fallingStars.splice(i, 1);
            continue;
        }
        
        // Draw smooth gradient trail effect with multiple layers
        var trailOpacity = Math.max(0, star.opacity - 0.2);
        var trailGradient = context.createLinearGradient(star.x, star.y - star.length * star.opacity, star.x, star.y);
        trailGradient.addColorStop(0, "hsla(" + star.hue + ", 100%, 60%, 0)");
        trailGradient.addColorStop(0.3, "hsla(" + star.hue + ", 100%, 70%, " + (trailOpacity * 0.6) + ")");
        trailGradient.addColorStop(1, "hsla(" + star.hue + ", 100%, 80%, " + trailOpacity + ")");
        
        context.strokeStyle = trailGradient;
        context.lineWidth = 3.5;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        context.moveTo(star.x, star.y - star.length * star.opacity);
        context.lineTo(star.x, star.y);
        context.stroke();
        
        // Save context for shadow effect
        context.save();
        context.shadowColor = "hsla(" + star.hue + ", 100%, 70%, " + (star.opacity * 0.8) + ")";
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        
        // Draw outer glow ring
        context.beginPath();
        context.arc(star.x, star.y, 5, 0, Math.PI * 2);
        context.fillStyle = "hsla(" + star.hue + ", 100%, 80%, " + (star.opacity * 0.3) + ")";
        context.fill();
        
        // Draw mid glow ring
        context.beginPath();
        context.arc(star.x, star.y, 3.5, 0, Math.PI * 2);
        context.fillStyle = "hsla(" + star.hue + ", 100%, 85%, " + (star.opacity * 0.5) + ")";
        context.fill();
        
        // Draw bright core
        context.beginPath();
        context.arc(star.x, star.y, 2, 0, Math.PI * 2);
        context.fillStyle = "hsla(" + star.hue + ", 100%, 95%, " + star.opacity + ")";
        context.fill();
        
        context.restore();
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
        context.fillStyle = "hsla(" + dust.hue + ", 100%, 65%, " + dust.opacity + ")";
        context.fill();
        
        // Add subtle glow around dust
        context.strokeStyle = "hsla(" + dust.hue + ", 100%, 75%, " + (dust.opacity * 0.6) + ")";
        context.lineWidth = 0.5;
        context.stroke();
    }
}

function drawPurpleBackground() {
    // Create radial gradient for galactic core effect
    var radialGradient = context.createRadialGradient(
        canvas.offsetWidth * 0.5, canvas.offsetHeight * 0.5, 0,
        canvas.offsetWidth * 0.5, canvas.offsetHeight * 0.5, Math.max(canvas.offsetWidth, canvas.offsetHeight) * 0.8
    );
    radialGradient.addColorStop(0, "rgba(80, 40, 150, 0.8)");     // Bright center
    radialGradient.addColorStop(0.3, "rgba(50, 20, 100, 0.8)");   // Mid
    radialGradient.addColorStop(0.6, "rgba(30, 10, 60, 1)");      // Outer
    radialGradient.addColorStop(1, "rgba(10, 2, 25, 1)");         // Dark edges
    
    context.fillStyle = radialGradient;
    context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Add linear gradient overlay for depth
    var linearGradient = context.createLinearGradient(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    linearGradient.addColorStop(0, "rgba(40, 20, 80, 0.4)");
    linearGradient.addColorStop(0.5, "rgba(20, 5, 40, 0.2)");
    linearGradient.addColorStop(1, "rgba(10, 5, 30, 0.4)");
    
    context.fillStyle = linearGradient;
    context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    // Draw large cosmic nebula clouds for galaxy effect
    for (var i = 0; i < nebulaClouds.length; i++) {
        var cloud = nebulaClouds[i];
        
        var cloudGradient = context.createRadialGradient(
            cloud.x, cloud.y, 0,
            cloud.x, cloud.y, cloud.radius
        );
        cloudGradient.addColorStop(0, "hsla(" + cloud.hue + ", 100%, 60%, " + cloud.opacity + ")");
        cloudGradient.addColorStop(0.5, "hsla(" + cloud.hue + ", 80%, 40%, " + (cloud.opacity * 0.5) + ")");
        cloudGradient.addColorStop(1, "hsla(" + cloud.hue + ", 60%, 20%, 0)");
        
        context.fillStyle = cloudGradient;
        context.beginPath();
        context.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        context.fill();
    }
    
    // Add additional cosmic background dust for atmosphere
    context.fillStyle = "rgba(100, 50, 200, 0.02)";
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
        context.strokeText(line, x, y + index * (fontSize + lineHeight));
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24); // Adjust font size based on screen width
    var lineHeight = 8;

    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    
    // Text stroke for visibility
    context.strokeStyle = "rgba(0, 0, 0, 0.6)";
    context.lineWidth = 3;
    
    // glow effect - purple glow
    context.shadowColor = "rgba(150, 50, 255, 0.8)";
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    if(frameNumber < 250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("Lara, everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        context.fillText("Lara, everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    //fades out the text by decreasing the opacity
    if(frameNumber >= 250 && frameNumber < 500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("Lara, everyday I cannot believe how lucky I am", canvas.width/2, canvas.height/2);
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
            context.strokeText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 750 && frameNumber < 1000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        
        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["amongst trillions and trillions of stars,", "over billions of years"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
            context.fillText("amongst trillions and trillions of stars, over billions of years", canvas.width/2, canvas.height/2);
        }

        opacity = opacity - 0.01;
    }

    if(frameNumber == 1000){
        opacity = 0;
    }
    if(frameNumber > 1000 && frameNumber < 1250){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1250 && frameNumber < 1500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        context.fillText("to be alive, and to get to spend this life with you", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 1500){
        opacity = 0;
    }
    if(frameNumber > 1500 && frameNumber < 1750){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        context.fillText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1750 && frameNumber < 2000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;
        context.strokeText("is so incredibly, unfathomably unlikely", canvas.width/2, canvas.height/2);
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
            context.strokeText("and yet here I am to get the impossible chance to get to know you", canvas.width/2, canvas.height/2);
            context.fillText("and yet here I am to get the impossible chance to get to know you", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2250 && frameNumber < 2500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and yet here I am to get the impossible", "chance to get to know you"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("and yet here I am to get the impossible chance to get to know you", canvas.width/2, canvas.height/2);
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
            context.strokeText("When I think about how big the universe is, all those stars and galaxies out there", canvas.width/2, canvas.height/2);
            context.fillText("When I think about how big the universe is, all those stars and galaxies out there", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2750 && frameNumber < 3000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["When I think about how big the universe is,", "all those stars and galaxies out there"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("When I think about how big the universe is, all those stars and galaxies out there", canvas.width/2, canvas.height/2);
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
            context.strokeText("all the things that had to happen just right, it makes what we have feel even more special", canvas.width/2, canvas.height/2);
            context.fillText("all the things that had to happen just right, it makes what we have feel even more special", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 3250 && frameNumber < 3500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["all the things that had to happen just right,", "it makes what we have feel even more special"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("all the things that had to happen just right, it makes what we have feel even more special", canvas.width/2, canvas.height/2);
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
            context.strokeText("Out of every possible way our lives could have gone, we somehow found each other", canvas.width/2, canvas.height/2);
            context.fillText("Out of every possible way our lives could have gone, we somehow found each other", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 3750 && frameNumber < 4000){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Out of every possible way our lives could have gone,", "we somehow found each other"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("Out of every possible way our lives could have gone, we somehow found each other", canvas.width/2, canvas.height/2);
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
            context.strokeText("Like two stars pulled together, we were meant to find one another", canvas.width/2, canvas.height/2);
            context.fillText("Like two stars pulled together, we were meant to find one another", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 4250 && frameNumber < 4500){
        context.fillStyle = `rgba(180, 100, 255, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Like two stars pulled together,", "we were meant to find one another"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.strokeText("Like two stars pulled together, we were meant to find one another", canvas.width/2, canvas.height/2);
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
            context.strokeText("I love you so much schatje, more than all the time and space in the universe can contain", canvas.width/2, canvas.height/2);
            context.fillText("I love you so much schatje, more than all the time and space in the universe can contain", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    
    if(frameNumber >= 4750 && frameNumber < 99999){
        context.fillStyle = `rgba(180, 100, 255, ${secondOpacity})`;


        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["and I can't wait to spend all the time with you", "Our love is interstellar"], canvas.width / 2, (canvas.height/2 + 60), fontSize, lineHeight);
        } else {
            context.strokeText("and I can't wait to spend all the time in the world with you. Our love is interstellar", canvas.width/2, (canvas.height/2 + 50));
            context.fillText("and I can't wait to spend all the time in the world with you. Our love is interstellar", canvas.width/2, (canvas.height/2 + 50));
        }

        secondOpacity = secondOpacity + 0.01;
    }

    if(frameNumber >= 5000 && frameNumber < 99999){
        context.fillStyle = `rgba(180, 100, 255, ${thirdOpacity})`;
        context.strokeText("Happy Valentine's Day my pretty girl <3", canvas.width/2, (canvas.height/2 + 120));
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
    initFallingStars();
    drawFallingStars();
    drawMoon();
    drawNebula();
    drawPlanets();
    drawSparkles();
    
    // Only draw text and increment frame if envelope is open
    if (isEnvelopeOpen) {
        drawText();
        if (frameNumber < 99999) {
            frameNumber++;
        }
    }

    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSparkles();
});

window.requestAnimationFrame(draw);

