$(document).ready(function(){
    var paused = false;
    var mode = 1;
    var intervalID = null;

    //Key Handling
    var buttonManager = {
        pressed: [false, false, false, false],
        press: function(key){
            if(mode === 1){
                if(key >= 37 && key <= 40){
                    this.pressed[key-37] = true;
                }
            } else if(mode === 2){
                switch(key){
                    case 65:
                        this.pressed[0] = true;
                        break;
                    case 87:
                        this.pressed[1] = true;
                        break;
                    case 68:
                        this.pressed[2] = true;
                        break;
                    case 83:
                        this.pressed[3] = true;
                        break;
                }
            }
        },
        release: function(key){
            if(mode === 1){
                if(key >= 37 && key <= 40){
                    this.pressed[key-37] = false;
                }
            } else if(mode === 2){
                switch(key){
                    case 65:
                        this.pressed[0] = false;
                        break;
                    case 87:
                        this.pressed[1] = false;
                        break;
                    case 68:
                        this.pressed[2] = false;
                        break;
                    case 83:
                        this.pressed[3] = false;
                        break;
                }
            }
        }
    };

    //game runner
    var game = {
        canvas: document.createElement("canvas"),
        guy: createPlayer(),
        enemies: [],
        start: function(){
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.context = this.canvas.getContext("2d");
            $('#screen').append(this.canvas);
        },
        clear: function(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        },
        update: function(){
            this.guy.updateSpeeds();
            this.guy.update();
            var en = this.enemies;
            for(var i = 0; i < en.length; i++){
                en[i].update();
                checkCollide(en[i], this.guy);
                if(!en[i].alive){
                    en[i] = "deleted";
                }
            }
            var list = [];
            var j = 0;
            for(var i = 0; i < en.length; i++){
                if(en[i] !== "deleted"){
                    list[j] = en[i];
                    j++;
                }
            }
            this.enemies = list;
        },
        draw: function(){
            this.guy.draw(this.context);
            var en = this.enemies;
            for(var i = 0; i < en.length; i++){
                en[i].draw(this.context);
            }
        },
        drawPaused: function(){
            this.context.font = "30px Ariel";
            this.context.fillStyle = "#ffffff";
            this.context.fillText("PAUSED", 200, 200);
        },
        generateEnemies: function(){
            if(this.enemies.length < 15){
                var side = Math.floor(Math.random() * 4);
                var position = Math.floor(Math.random() * this.canvas.width);
                var size = Math.floor(Math.random() * 42 + 8);
                var speed = Math.floor(Math.random() * 9 + 1);
                switch(side){
                    case 0:
                        this.enemies[this.enemies.length] = Enemy(0, position, size, speed, 0, "#00ff00");
                        break;
                    case 1:
                        this.enemies[this.enemies.length] = Enemy(position, 0, size, 0, speed, "#00ff00");
                        break;
                    case 2:
                        this.enemies[this.enemies.length] = Enemy(this.canvas.width, position, size, speed * -1, 0, "#00ff00");
                        break;
                    case 3:
                        this.enemies[this.enemies.length] = Enemy(position, this.canvas.height, size, 0, speed * -1, "#00ff00");
                        break;
                }
            }
        },
        reset: function(){
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.guy = createPlayer();
            this.enemies = [];
        }
    };

    function checkCollide(enemy, hero){
        if(enemy.x < hero.x+hero.size &&
        enemy.x+enemy.size > hero.x &&
        enemy.y < hero.y+hero.size &&
        enemy.y+enemy.size > hero.y){
            if(enemy.size >= hero.size){
                hero.alive = false;
            } else {
                enemy.alive = false;
                hero.size++;
            }
        }
    }
    

    //Generic Person
    function Person(x, y, size, xSpeed, ySpeed, color){
        return {
            x: x,
            y: y,
            size: size,
            xSpeed: xSpeed,
            ySpeed: ySpeed,
            color: color,
            alive: true,
            update: function(){
                if(this.alive){
                    this.x += this.xSpeed;
                    if(this.x > game.canvas.width){
                        this.x = 0;
                    } else if(this.x < 0){
                        this.x = game.canvas.width;
                    }
                    this.y += this.ySpeed;
                    if(this.y > game.canvas.height){
                        this.y = 0;
                    } else if(this.y < 0){
                        this.y = game.canvas.height;
                    }
                }
            },
            draw: function(context){
                if(this.alive){
                    context.fillStyle = this.color;
                    context.fillRect(this.x, this.y, this.size, this.size);
                }
            }
        };
    }

    $(document).keydown(function(event){
        if(event.which === 27)
            paused = !paused;
        game.guy.buttons.press(event.which);
    });

    $(document).keyup(function(event){
        game.guy.buttons.release(event.which);
    });

    //returns object with references to Person but specific update method and alive param
    function Enemy(x, y, size, xSpeed, ySpeed, color){
        var person = Person(x, y, size, xSpeed, ySpeed, color);
        person.update = function(){
            this.x += this.xSpeed;
            if(this.x > game.canvas.width){
                this.alive = false;
            } else if(this.x < 0){
                this.alive = false;
            }
            this.y += this.ySpeed;
            if(this.y > game.canvas.height){
                this.alive = false;
            } else if(this.y < 0){
                this.alive = false;
            }
        };
        return person;
    }

    //function to create and set up player
    function createPlayer(){
        var guy = Person(250, 250, 10, 0, 0, "#ff0000");
        guy.buttons = buttonManager;
        guy.maxSpeed = 10;
        guy.updateSpeeds = function(){
            var idlex = true;
            var idley = true;
            if(this.buttons.pressed[0] && this.xSpeed > this.maxSpeed * -1){
                this.xSpeed--;
                idlex = false;
            }
            if(this.buttons.pressed[1] && this.ySpeed > this.maxSpeed * -1){
                this.ySpeed--;
                idley = false;
            }
            if(this.buttons.pressed[2] && this.xSpeed < this.maxSpeed){
                this.xSpeed++;
                idlex = false;
            }
            if(this.buttons.pressed[3] && this.ySpeed < this.maxSpeed){
                this.ySpeed++;
                idley = false;
            }
            //if no buttons pressed, slow down
            if(idlex){
                if(this.xSpeed > 0)
                    this.xSpeed --;
                else if(this.xSpeed < 0)
                    this.xSpeed ++;
            }
            if(idley){
                if(this.ySpeed > 0)
                    this.ySpeed --;
                else if(this.ySpeed < 0)
                    this.ySpeed ++;
            }
        }
        return guy;
    }

    
    function reset(){
        game.reset();
        $("#start").show();
        $("#one").show();
        $("#two").show();
        $("canvas").hide();
    }

    $("#one").click(function(){
        $(this).addClass("selected");
        $("#two").removeClass("selected");
        mode = 1;
    });

    $("#two").click(function(){
        $(this).addClass("selected");
        $("#one").removeClass("selected");
        mode = 2;
    });

    $("#start").click(function(){
        $("canvas").show();
        $("#start").hide();
        $("#one").hide();
        $("#two").hide();
        game.start();
        game.draw();
        setTimeout(run, 1000);
        function run(){
            var count = 0;
            intervalID = setInterval(function(){
                if(!paused){
                    game.clear();
                    game.generateEnemies();
                    game.update();
                    game.draw();
                    if(!game.guy.alive){
                        count += 30;
                    }
                    if(count > 1000){
                        clearInterval(intervalID);
                        reset();
                    }
                } else{
                    game.clear();
                    game.drawPaused();
                }
            }, 30);
        }
    });
});