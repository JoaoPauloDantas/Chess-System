# ♟️ Chess System - João Paulo Dantas

Projeto pessoal desenvolvido para estudo. A proposta nasceu da união de dois grandes hobbies meus atuais: a programação e o xadrez, embora hoje trrabalhe somente com advpl, sempre gostei de estudar mais areas da programação

O sistema simula um tabuleiro de xadrez, aplicando todas as regras do jogo, aplicando conceitos basicos de modelagem em css, e toda a logica do jogo em javascript.

Caso tenha alguma dica, feedback ou consideração, fique à vontade para me chamar!

---

## 🎮 Funcionalidades Implementadas

O grande desafio técnico deste projeto foi traduzir a lógica matemática e as exceções das regras do xadrez para o código JavaScript.

- **Regras Avançadas de Movimentação:** Suporte completo para os movimentos especiais **Roque** (curto e longo) e **En Passant**. "Tive muito trabalho em ambas jogadas do xadrez"
- **Sistema de Promoção de Peão:** Interface interativa que permite ao jogador escolher a nova peça (Dama, Torre, Bispo ou Cavalo) assim que o peão alcança a última fileira, quando promover vai selecionar a primeira letra da peça promovida, não quis colocar a imagem da peça ao selecionar
- **Validação de Xeque e Xeque-Mate:** Algoritmo preditivo que impede movimentos ilegais (que exponham o próprio Rei ao perigo) e detecta automaticamente quando a partida chegou ao fim, sempre que achava que tinha resolvido, podia jogar outras coisas com o rei em xeque, e voltava tudo do zero
- **Destaques Visuais Dinâmicos:** Realce visual das casas com movimentos possíveis e identificação de peças sob ameaça do oponente.
- **Histórico em Notação Oficial:** Um painel lateral que monitora o fluxo de turnos e traduz as jogadas da matriz para a notação oficial do xadrez em tempo real (ex: `e4`, `Nf3`).

## 🎯 Próximos Objetivos

- [ ] Implementar um sistema de dicas com sugestões das melhores jogadas possíveis de acordo com a posição atual no tabuleiro.
- [ ] Adicionar um cronômetro de tempo para partidas rápidas (Blitz).
- [ ] Criar aplicativo android e lançar na play store
Tudo isso acima vai demorar pra caramba pra entregar, agora estou entrando em projetos que vai sugar muito do meu tempo, e vai ser dificil focar

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do tabuleiro, peças e do painel lateral de histórico.
- **CSS3:** Layout moderno em *Dark Mode*, utilizando CSS Grid e Flexbox para garantir o alinhamento responsivo.
- **JavaScript (ES6+):** Lógica de estados, gerenciamento de turnos e árvore de validação de movimentos sem o uso de frameworks externos.
- **GitHub Pages:** Hospedagem e deploy automatizado para execução do jogo online.

---

## 👨‍💻 Contato

Estou sempre aberto a conexões e feedbacks sobre códigos!

e-mail: joaopaulo_74@outlook.com
