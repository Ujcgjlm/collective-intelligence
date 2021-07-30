class Agent {
    constructor(color) {
        this.color = color;
        this.x = RandomInteger(r, canvas.width - r);
        this.y = RandomInteger(r, canvas.height - r);
        this.speed = RandomInteger(2, 7);
        this.angle = Math.random() * 2;
        this.a = 10000000000000;
        this.b = 10000000000000;
        this.nxt = RandomInteger(0, 1);
    }

    Move() {
        this.a += eho;
        this.b += eho;
        this.x = this.x + 0.1 * speed * this.speed * Math.cos((this.angle + Math.random() * deviation_of_angle - Math.random() * deviation_of_angle) * Math.PI);
        this.y = this.y + 0.1 * speed * this.speed * Math.sin((this.angle + Math.random() * deviation_of_angle - Math.random() * deviation_of_angle) * Math.PI);
        if (dis >= (bases[0].x - this.x) * (bases[0].x - this.x) + (bases[0].y - this.y) * (bases[0].y - this.y)) {
            this.a = 0;
            if (this.nxt === 0) {
                counter++;
                this.angle -= 1;
                if (this.angle < 0)
                    this.angle += 2;
                this.nxt = 1;
            }
        } else if (dis >= (bases[1].x - this.x) * (bases[1].x - this.x) + (bases[1].y - this.y) * (bases[1].y - this.y)) {
            this.b = 0;
            if (this.nxt == 1) {
                counter++;
                this.angle -= 1;
                if (this.angle < 0)
                    this.angle += 2;
                this.nxt = 0;
            }
        } else {
            if (this.x < r || this.x > canvas.width - r) {
                this.angle = 1 - this.angle;
            }
            if (this.y < r || this.y > canvas.height - r) {
                this.angle = 2 - this.angle;
            }
            if (this.angle < 0)
                this.angle += 2;
        }
        this.Draw(1);
    }

    Draw() {
        ctx.beginPath();

        if (Res_type.checked == 1) {
            if (this.nxt === 0) {
                ctx.fillStyle = Col1.value;
                ctx.strokeStyle = Col1.value;
                if (Graphics.checked == 1) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = Col1.value;
                }
            } else {
                ctx.fillStyle = Col2.value;
                ctx.strokeStyle = Col2.value;
                if (Graphics.checked == 1) {
                    ctx.shadowBlur = 4;
                    ctx.shadowColor = Col2.value;
                }
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            if (Graphics.checked == 1) {
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 4;
            }
        }
        ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class Base {
    constructor(color) {
        this.color = color;
        this.x = RandomInteger(rbase, canvas.width - rbase);
        this.y = RandomInteger(rbase, canvas.height - rbase);
        this.Draw();
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        if (Graphics.checked == 1) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }
        ctx.arc(this.x, this.y, rbase, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

var canvas = document.getElementById("canvas");
var EhoSlide = document.getElementById("eho");
var SpeedSlide = document.getElementById("speed");
var NumSlide = document.getElementById("num");
var Graphics = document.getElementById("graphics");
var Res_type = document.getElementById("res_type");
var Com_line = document.getElementById("com_line");
var Sz_ball = document.getElementById("sz_ball");
var Sz_base = document.getElementById("sz_base");
var Fad = document.getElementById("Fad");
var Col1 = document.getElementById("Col1");
var Col2 = document.getElementById("Col2");
var ctx = canvas.getContext("2d");
var r = 1;
var rbase = 25;
var speed = SpeedSlide.value;
var deviation_of_speed = 5;
var deviation_of_angle = 0.12;
var number_of_agents = 2000;
var agents = [];
var update = [];
var bases = [];
var UPDATE_TIME = 1000 / 60;
var dis = (r + rbase) * (r + rbase);
var eho = EhoSlide.value;
var chance = 1000; //от 10000
var counter = 0;
var prev = 0;
var now = 0;
var tm = 0;


Col1.value = '#FFFF00';
Col2.value = '#ADD8E6';
Graphics.checked = 1;
Com_line.checked = 1;

Resize();
window.addEventListener("resize", Resize);

Create_the_world();
Start_simulation();


function Create_the_world() {
    for (var i = 0; i < number_of_agents; ++i) {
        agents[i] = new Agent("white");
    }

    var distance = 0;
    while (distance < (rbase + rbase + 1) * (rbase + rbase + 1)) {
        bases[0] = new Base(Col1.value);
        bases[1] = new Base(Col2.value);
        distance = (bases[0].x - bases[1].x) * (bases[0].x - bases[1].x) + (bases[0].y - bases[1].y) * (bases[0].y - bases[1].y);
    }
}

function Start_simulation() {
    setInterval(Update, UPDATE_TIME); //Updating the game 60 times a second
}

function Update() {
    canvas.width = canvas.width;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Scream();

    for (var i = 0; i < number_of_agents; ++i)
        agents[i].Move();

    bases[0].Draw();
    bases[1].Draw();
    document.getElementById("score").innerHTML = "Total collected: " + counter + "<br>Collected in a second: " + now;
    tm++;
    if (tm == 60) {
        tm = 0;
        now = counter - prev;
        prev = counter;
    }

    number_of_agents = NumSlide.value;
    eho = EhoSlide.value;
    speed = SpeedSlide.value;
    r = Sz_ball.value;
    rbase = Sz_base.value;
    deviation_of_angle = Fad.value;
    bases[0].color = Col1.value;
    bases[1].color = Col2.value;
}

function Cou() {
    now = counter - prev;
    prev = counter;
}

function Scream() {
    var angl, agi, agj;
    update = agents;
    for (var i = 0; i < number_of_agents; i++) {
        agi = update[i];
        for (var j = 0; j < number_of_agents; j++) {
            if (i == j) continue;
            agj = update[j];
            if (eho * eho >= (agi.x - agj.x) * (agi.x - agj.x) + (agi.y - agj.y) * (agi.y - agj.y) && (agj.a + eho < agi.a || agj.b + eho < agi.b)) {
                angl = Math.atan((agi.y - agj.y) / (agi.x - agj.x)) / Math.PI;

                if (angl <= 0) {
                    if (agi.y >= agj.y)
                        angl = 2 + angl;
                    if (agi.y < agj.y)
                        angl = 1 + angl;
                } else {
                    if (agi.y >= agj.y)
                        angl = 1 + angl;
                    if (agi.y < agj.y)
                        angl = angl;
                }

                if (agj.a + eho < agi.a && RandomInteger(0, 10000) <= chance) {
                    agi.a = agj.a + eho;
                    if (agi.nxt === 0) {
                        if (Com_line.checked == 1) {
                            ctx.beginPath();
                            ctx.lineWidth = 3;
                            ctx.fillStyle = Col1.value;
                            ctx.strokeStyle = Col1.value;
                            if (Graphics.checked == 1) {
                                ctx.shadowBlur = 20;
                                ctx.shadowColor = Col1.value;
                            }
                            ctx.moveTo(agi.x, agi.y);
                            ctx.lineTo(agj.x, agj.y);
                            ctx.stroke();
                            ctx.shadowBlur = 0;
                            ctx.lineWidth = 1;
                        }
                        agi.angle = angl;
                    }
                }
                if (agj.b + eho < agi.b && RandomInteger(0, 10000) <= chance) {
                    agi.b = agj.b + eho;
                    if (agi.nxt == 1) {
                        if (Com_line.checked == 1) {
                            ctx.beginPath();
                            ctx.lineWidth = 3;
                            ctx.fillStyle = Col2.value;
                            ctx.strokeStyle = Col2.value;
                            if (Graphics.checked == 1) {
                                ctx.shadowBlur = 20;
                                ctx.shadowColor = Col2.value;
                            }
                            ctx.moveTo(agi.x, agi.y);
                            ctx.lineTo(agj.x, agj.y);
                            ctx.stroke();
                            ctx.shadowBlur = 0;
                            ctx.lineWidth = 1;
                        }
                        agi.angle = angl;
                    }
                }
            }
            agents[i] = agi;
            agents[j] = agj;
        }
    }
}

function Resize() {
    canvas.width = window.innerWidth - 17;
    canvas.height = window.innerHeight - 90;
    ///canvas.height = 400;
}

function RandomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

var tumbler = 0;
var which = -1;

canvas.onmousedown = function(e) {
    tumbler = 1;
    if ((e.y + scroll - bases[0].y) * (e.y + scroll - bases[0].y) + (e.x - bases[0].x) * (e.x - bases[0].x) <= rbase * rbase) {
        which = 0;
    } else
    if ((e.y + scroll - bases[1].y) * (e.y + scroll - bases[1].y) + (e.x - bases[1].x) * (e.x - bases[1].x) <= rbase * rbase) {
        which = 1;
    } else
        which = -1;
    canvas.onmousemove = mouseMove;
}

canvas.onmouseup = function(e) {
    tumbler = 0;
    which = -1;
    canvas.onmousemove = null;
}

function mouseMove(e) {
    if (tumbler == 0) {
        which = -1;
        return;
    }
    if (which == 0) {
        bases[0].x = e.x;
        bases[0].y = e.y + scroll;
    } else
    if (which == 1) {
        bases[1].x = e.x;
        bases[1].y = e.y + scroll;
    }
}

var scroll = 0;

window.onscroll = function() {
    scroll = window.pageYOffset ? window.pageYOffset : (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}