const prompt = require('prompt-sync')();

jogadores = +prompt("Digite o número de jogadores ➞ ");
rodadas = +prompt("Digite o número de rodadas ➞ ");
//console.log(); 
console.log("======================================================");
for (let a = 0; a < rodadas; a++) {
    let listajogos = []
    for (let i = 0; i < jogadores; i++) {
        let jogo = {
            rod:(a + 1)+"ª Rodada",
            nome: (i + 1)+ "º Jogador",
            numero: Math.floor(Math.random() * 6 + 1),            
        };
        listajogos.push(jogo);               
        listajogos.sort((a, b) => {           
            if (b.numero < a.numero) {                
                return -1;                
            } else {
                return true;
            }       
        });
       
    }
     console.log(listajogos);   
     console.log(); 
     console.log(`❮❮ ${listajogos[0].rod} ❯❯ O maior valor é 🡆  ${listajogos[0].numero}  ★ ★ ★  ${listajogos[0].nome} ★ ★ ★ `)  
     console.log();   

}
