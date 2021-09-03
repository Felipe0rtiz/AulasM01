const prompt = require('prompt-sync')();
function replay (){
var entrada = prompt("Deseja jogar ? ");
if (entrada === "sim"){
  login();
}else if(entrada === "nao"){
  console.log("Obrigado");

 }
}
function replay2 (){
var entrada = prompt("Deseja jogar novamente ? ");
if (entrada === "sim"){
  login();
}else if(entrada === "nao"){
  console.log("Obrigado");

 }
}
//////// nome + rodadas = apresentacao menu jogo
function login (){
  var nome = prompt("Digite seu nickname : ");
  //var rodadas = +prompt("Quantas rodadas deseja jogar ?");
  var regras = prompt("Gostaria de ler as regras ? ");
  if (regras === "sim"){
    console.log("\nRegras : Você tem três opcões para jogar : ↳ pedra   (0) \n\n                                           ↳ papel   (1) \n\n                                           ↳ tesoura (2)\n==================================================\n         • Pedra ganha da tesoura\n         • Tesoura ganha do papel\n         • Papel ganha da pedra\n==================================================");
  }else {
    console.log("Que pena , ler as regras é muito importante!");
    return login('');
  }
  console.log();
  console.log("Para iniciar ,tecle ENTER :");
  prompt(" ");
  console.log();
  console.log("Seja bem-vindo (a) : " + nome + "\nVocê jogará 5 rodadas contra o pc\n");
}

var entrada = prompt("Deseja jogar ? ");
if (entrada === "sim"){
  login();
}else if(entrada === "nao"){
  console.log("Obrigado ! para iniciar novamente : tecle ENTER");
  prompt(" ");
  replay("");
}

var pedra = "0";
var papel = "1";
var tesoura = "2";
var cont = 0;
var pontospc = 0;
var pontosu = 0;
var vencedor = 0;
var empates = 0;
var contempate = 0;
var rodadas = 0;
var total = 0;
var rodadasuganhou = 0;
var rodadaspcganhou = 0;

for(var i = 0; i < 5;i++){
var listaescolhau = ["0" , "1" , "2"];
var numerou = +prompt("Digite o numero da sua jogada : ");
var numero = listaescolhau[numerou];
if(numero == "0"){
  console.log("▶  Você jogou : PEDRA ");
}
else if(numero == "1"){
  console.log("▶  Você jogou : PAPEL");
}
else if(numero == "2"){
  console.log("▶  Você jogou : TESOURA");
}
console.log();
var listaescolhapc = ["0" , "1" , "2"]
var entradapc = Math.floor(Math.random() * 3);
var escolhapc = listaescolhapc[entradapc];
if(escolhapc == "0"){
  console.log("▶  Pc jogou : PEDRA");
}
else if(escolhapc == "1"){
  console.log("▶  Pc jogou : PAPEL");
}
else if(escolhapc == "2"){
  console.log("▶  Pc jogou : TESOURA");
}
console.log();
if(numerou == "0" && escolhapc == "1"){
  pontospc++;
  alert("Papel embrulha Pedra");
}
if(numerou == "0" && escolhapc == "2"){
  pontosu++;
  alert("Pedra quebra Tesoura");
}
if(numerou == "1" && escolhapc == "2"){
  pontospc++;
  alert("Tesoura corta Papel");
}
if (numerou == "1" && escolhapc == "0"){
  pontosu++;
  alert("Papel ganha da Pedra");
}
if(numerou == "2" && escolhapc == "0"){
  pontospc++;
  alert("Pedra quebra Tesoura");
}
if(numerou == "2" && escolhapc == "1"){
  pontosu++;
  alert("Tesoura corta Papel");
}
if(numerou == escolhapc){
  alert("EMPATE");  
  empates += 1;
  contempate += 1;
}
}
console.log("=====================================================");
if(pontosu > pontospc){
  alert("❰❰❰❰❰ Você foi o vencedor do jogo! ❱❱❱❱❱ PONTOS : " +pontosu);
}
else if(pontosu < pontospc){
  alert("❰❰❰❰❰ Pc foi o vencedor do jogo! ❱❱❱❱❱ PONTOS : " +pontospc);
}
else if(pontosu = pontospc){
  alert("❰❰❰❰❰ PARTIDA EMPATADA !!! ❱❱❱❱❱");
}
console.log("=====================================================");
console.log();
console.log("Fim de Jogo !");
replay2();