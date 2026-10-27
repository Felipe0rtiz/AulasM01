# Tiger Fortune — Tiger Club

Caça-níquel demonstrativo de três rolos e três linhas, com ilustrações locais, animação de rolos, som, modo turbo, histórico e até dez giros automáticos. Inspirado no estilo Fortune Tiger, com arte e regras próprias; não reproduz o algoritmo ou a tabela oficial. Créditos fictícios, sem dinheiro real, depósitos ou saques.

## Abrir

Com Python 3, na raiz do repositório:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

Abra `http://localhost:3000`. Não há instalação ou build obrigatório. As fontes do Google são opcionais. Os controles ficam fixos em celulares e janelas baixas.

Também é possível gerar um HTML completo, com imagens, CSS e JavaScript embutidos, que funciona diretamente pelo arquivo sem servidor:

```sh
python3 scripts/build-download.py
```

Por padrão, o arquivo fica em `$WORKSPACE_ROOT/output/tiger-club.html` (ou `./output/tiger-club.html` se a variável não estiver definida). Abra esse arquivo no navegador. O gerador aceita `--output /caminho/tiger-club.html`.

## Regras desta demonstração

- Valores exibidos em reais brasileiros, sempre com centavos: saldo inicial R$ 1.000,00 fictícios. Giros: R$ 5,00, R$ 10,00, R$ 25,00, R$ 50,00 ou R$ 100,00. Saldo, giros e prêmios são simulados; a formatação não adiciona dinheiro real.
- As cinco linhas ficam sempre ativas: três horizontais e duas diagonais. Cada linha recebe 1/5 do valor total do giro.
- Três símbolos iguais pagam o valor da linha multiplicado por: tigres ×50, jades ×20, lingotes ×15, moedas ×10, lanternas ×5, tangerinas ×3.
- Tigres são curingas e substituem os outros símbolos. Uma linha só de tigres paga ×50.
- Prêmios de várias linhas são somados; o custo total é descontado apenas uma vez por giro.
- Quadro cheio: nove símbolos iguais, aceitando curingas, multiplicam a soma dos prêmios por 10.
- Probabilidades independentes por posição: tigre 2%, jade 10%, lingote 13%, moeda 20%, lanterna 25%, tangerina 30%. Não há manipulação dos resultados por saldo ou histórico.
- Auto executa até dez rodadas, para se faltar saldo e pode ser interrompido após o giro atual. Turbo acelera os próximos giros. Espaço gira quando o foco não está em outro botão.
- O histórico guarda as últimas 50 rodadas da sessão. Renovar saldo volta para R$ 1.000,00 fictícios e limpa o histórico; mantém o valor escolhido, som e turbo. Recarregar a página reinicia a sessão.

A versão anterior usava cartas e apenas três horizontais, sem curingas ou bônus. As regras acima substituem aquele comportamento para atender à mudança para caça-níquel.

## Verificar

Com Node.js 18 ou superior:

```sh
node --check app.mjs
node --test game-engine.test.mjs
```

Os exercícios JavaScript originais continuam independentes do jogo.
