const prompt = require('prompt-sync')();
console.log();
console.log();
console.log("ð² Seja Bem-vindo ao jogo de DADOS ð²")
console.log();
console.log("========================");
console.log(" â¥  Press  ð² ENTER ð² ");
console.log("========================");
prompt();

jogadores = +prompt("â¢ Digite o nÃºmero de jogadores â ");
rodadas = +prompt("â¢ Digite o nÃºmero de rodadas â ");
//console.log(); 
console.log("======================================================");
for (let a = 0; a < rodadas; a++) {
    let listajogos = []
    for (let i = 0; i < jogadores; i++) {
        let jogo = {
            rod:(a + 1)+"Âª Rodada",
            nome: (i + 1)+ "Âº Jogador",
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
     console.log(`â®â® ${listajogos[0].rod} â¯â¯ ð² ð¡  ${listajogos[0].numero}  â â ð ${listajogos[0].nome} ð â â  `)  
     console.log();   


}
