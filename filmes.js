const prompt = require('prompt-sync')();
let entrada = prompt("gostria de ver a recomendaçao de alguns filmes ?");
if(entrada == "sim"){
 console.log(filme1 , filme2 , filme3 , filme4 , filme5)
}if(entrada == "nao"){
  console.log("Obrigado!volte sempre");
}


let filme1 = {
  nome : "procurando nemo",
  tipo : "aventura",
  direçao : "Andrew Stanton , Lee Unkrich",
  elenco : " Albert Brooks, Ellen DeGeneres, Alexander Gould",
  lançamento : "Relançamento em 12 de outubro de 2012",
  duraçao : "1h 41min",
  sinopse : "O passado reserva tristes memórias para Marlin nos recifes de coral, onde perdeu sua esposa e toda a ninhada. Agora, ele cria seu único filho Nemo com todo o cuidado do mundo, mas o pequeno e simpático peixe-palhaço acaba exagerando durante uma simples discussão e acaba sendo capturado por um mergulhador. Agora, o pai super protetor precisa entrar em ação e parte numa busca incansável pelo mar aberto, na esperança de encontrar seu amado filhote. No meio do caminho, ele acaba conhecendo Dory e, juntos, a dupla vai viver uma incrível aventura. Enquanto isso, Nemo também vive uma intensa experiência ao lado de seus novos amigos habitantes de um aquário, pois eles precisam ajudá-lo a escapar do destino que lhe foi reservado: ir parar nas mãos da terrível Darla, sobrinha do dentista que o capturou"
}

console.log(filme1);
console.log();

// let filme2 = {
//   nome = "a lista" ,
//   genero = "Drama",
//   direçao : "1 de maio de 2019",
//   elenco : "Liam Neeson, Ben Kingsley, Ralph Fiennes",
//   lançamento : "1 de maio de 2019",
//   duraçao : "3h 15min",
//   sinopse :"A inusitada história de Oskar Schindler (Liam Neeson), um sujeito oportunista, sedutor, armador, simpático, comerciante no mercado negro, mas, acima de tudo, um homem que se relacionava muito bem com o regime nazista, tanto que era membro do próprio Partido Nazista (o que não o impediu de ser preso algumas vezes, mas sempre o libertavam rapidamente, em razão dos seus contatos). No entanto, apesar dos seus defeitos, ele amava o ser humano e assim fez o impossível, a ponto de perder a sua fortuna mas conseguir salvar mais de mil judeus dos campos de concentração."
// }

//  console.log(filme2);
//  console.log();

let filme3 = {
  nome : "Deadpool",
  genero : "Comedia",
  direçao : "Tim Miller",
  elenco : "Ryan Reynolds, Morena Baccarin, Ed Skrein",
  lançamento : "11 de fevereiro de 2016",
  duraçao : "1h 48min",
  sinopse : "Ex-militar e mercenário, Wade Wilson (Ryan Reynolds) é diagnosticado com câncer em estado terminal, porém encontra uma possibilidade de cura em uma sinistra experiência científica. Recuperado, com poderes e um incomum senso de humor, ele torna-se Deadpool e busca vingança contra o homem que destruiu sua vida."
 }
 console.log(filme3);
 console.log();
 let filme4 = {
  nome : "O Exorcista",
  genero : "Terror",
  direçao : "William Friedkin",
  elenco : "Linda Blair, Ellen Burstyn, Max von Sydow",
  lançamento : "29 de julho de 1974",
  duraçao : "2h 01min",
  sinopse : "Em Georgetown, Washington, uma atriz vai gradativamente tomando consciência que a sua filha de doze anos está tendo um comportamento completamente assustador. Deste modo, ela pede ajuda a um padre, que também um psiquiatra, e este chega a conclusão de que a garota está possuída pelo demônio. Ele solicita então a ajuda de um segundo sacerdote, especialista em exorcismo, para tentar livrar a menina desta terrível possessão."
 }
 
 let filme5 = {
  nome : "EXTRAORDINÁRIO",
  genero : "Familia",
  direçao :" Stephen Chbosky",
  elenco : "julia Roberts, Jacob Tremblay, Owen Wilson",
  lançamento : "7 de dezembro de 2017",
  duraçao : "1h 51min",
  sinopse : "Auggie Pullman (Jacob Tremblay) é um garoto que nasceu com uma deformação facial, o que fez com que passasse por 27 cirurgias plásticas. Aos 10 anos, ele pela primeira vez frequentará uma escola regular, como qualquer outra criança. Lá, precisa lidar com a sensação constante de ser sempre observado e avaliado por todos à sua volta."
}

// filme1.genero = "Aventura"
// filme1.direçao = "Andrew Stanton , Lee Unkrich",


 console.log(filme5);
 console.log();