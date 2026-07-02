const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
const moveHistoryContainer = document.getElementById("moveHistory");
let contadorJogadas = 1;

// JOguinho de xadrez, joãozinho 30 rei dos fontes
const pieces = [
    "♜","♞","♝","♛","♚","♝","♞","♜",
    "♟","♟","♟","♟","♟","♟","♟","♟",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "♙","♙","♙","♙","♙","♙","♙","♙",
    "♖","♘","♗","♕","♔","♗","♘","♖"
];

const imagensPecas = {
    // Peças Brancas
    "♙": "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
    "♖": "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
    "♘": "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
    "♗": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
    "♕": "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
    "♔": "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",

    // Peças Pretas, no xadrez tem peças pretas então é só não cagar regra
    "♟": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
    "♜": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
    "♞": "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
    "♝": "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
    "♛": "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
    "♚": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
};

const estadoInicial = [
    "♜","♞","♝","♛","♚","♝","♞","♜",
    "♟","♟","♟","♟","♟","♟","♟","♟",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "","","","","","","","",
    "♙","♙","♙","♙","♙","♙","♙","♙",
    "♖","♘","♗","♕","♔","♗","♘","♖"
];

let selectedSquareIndex = null;
let turnoAtual = "W"; // "W" = Brancas, "B" = Pretas
let movimentosPossiveis = [];
let casasAmeacadas = [];
let ultimoMovimento = null;
let roqueBrancasCurto = true;
let roqueBrancasLongo = true;
let roquePretasCurto = true;
let roquePretasLongo = true;

function obterCorDaPeca(peca) {
    if (peca === "") return null;
    const pecasBrancas = ["♙", "♖", "♘", "♗", "♕", "♔"];
    return pecasBrancas.includes(peca) ? "W" : "B";
}

function promoverPeca(index, peca) {
    const cor = obterCorDaPeca(peca);
    const opcoes = cor === "W"
        ? { D: "♕", T: "♖", B: "♗", C: "♘" }
        : { D: "♛", T: "♜", B: "♝", C: "♞" };

    const escolha = prompt("Promoção do peão! Escolha: Dama (D), Torre (T), Bispo (B) ou Cavalo (C)").toUpperCase();
    const novaPeca = opcoes[escolha] || opcoes.D;
    pieces[index] = novaPeca;
    return novaPeca;
}

function ehEnPassant(fromIndex, toIndex, peca) {
    if ((peca !== "♙" && peca !== "♟") || pieces[toIndex] !== "") {
        return false;
    }

    const fromRow = Math.floor(fromIndex / 8);
    const fromCol = fromIndex % 8;
    const toRow = Math.floor(toIndex / 8);
    const toCol = toIndex % 8;

    if (Math.abs(toRow - fromRow) !== 1 || Math.abs(toCol - fromCol) !== 1) {
        return false;
    }

    if (!ultimoMovimento) {
        return false;
    }

    const [lastFrom, lastTo, lastPiece] = ultimoMovimento;
    const lastRow = Math.floor(lastTo / 8);
    const lastCol = lastTo % 8;

    if (peca === "♙") {
        const capturedIndex = (toRow + 1) * 8 + toCol;
        return lastPiece === "♟" && lastFrom === lastTo - 16 && lastRow === fromRow && lastCol === toCol && pieces[capturedIndex] === "♟";
    }

    if (peca === "♟") {
        const capturedIndex = (toRow - 1) * 8 + toCol;
        return lastPiece === "♙" && lastFrom === lastTo + 16 && lastRow === fromRow && lastCol === toCol && pieces[capturedIndex] === "♙";
    }

    return false;
}

function criarTabuleiro() {
    board.innerHTML = "";

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const index = row * 8 + col;
            const square = document.createElement("div");
            square.classList.add("square");

            if ((row + col) % 2 === 0) {
                square.classList.add("white");
            } else {
                square.classList.add("black");
            }

            const caracterePeca = pieces[index];
            if (caracterePeca !== "") {
                const img = document.createElement("img");
                img.src = imagensPecas[caracterePeca];
                img.alt = caracterePeca;
                square.appendChild(img);
            }

            square.dataset.index = index;

            if (index === selectedSquareIndex) {
                square.classList.add("selected");
            }

            if (movimentosPossiveis.includes(index)) {
                square.classList.add("possible-move");
            }

            if (casasAmeacadas.includes(index)) {
                square.classList.add("threatened");
            }

            square.addEventListener("click", () => tratarCliqueNaCasa(index));
            board.appendChild(square);
        }
    }
}

function movimentoValido(fromIndex, toIndex, peca) {
    if (fromIndex === toIndex) return false;

    const fromRow = Math.floor(fromIndex / 8);
    const fromCol = fromIndex % 8;
    const toRow = Math.floor(toIndex / 8);
    const toCol = toIndex % 8;
    const arrancoLinha = toRow - fromRow;
    const arrancoColuna = toCol - fromCol;

    const pecaDestino = pieces[toIndex];
    if (pecaDestino !== "") {
        const corOrigem = obterCorDaPeca(peca);
        const corDestino = obterCorDaPeca(pecaDestino);
        if (corOrigem === corDestino) return false;
    }

    if (peca === "♙") {
        if (arrancoColuna !== 0) {
            if (arrancoLinha === -1 && Math.abs(arrancoColuna) === 1) {
                return pecaDestino !== "" || ehEnPassant(fromIndex, toIndex, peca);
            }
            return false;
        }
        if (arrancoLinha === -1) return pecaDestino === "";
        if (fromRow === 6 && arrancoLinha === -2) return pieces[fromIndex - 8] === "" && pecaDestino === "";
        return false;
    }

    if (peca === "♟") {
        if (arrancoColuna !== 0) {
            if (arrancoLinha === 1 && Math.abs(arrancoColuna) === 1) {
                return pecaDestino !== "" || ehEnPassant(fromIndex, toIndex, peca);
            }
            return false;
        }
        if (arrancoLinha === 1) return pecaDestino === "";
        if (fromRow === 1 && arrancoLinha === 2) return pieces[fromIndex + 8] === "" && pecaDestino === "";
        return false;
    }

    if (peca === "♖" || peca === "♜") {
        if (fromRow !== toRow && fromCol !== toCol) return false;

        const passoLinha = Math.sign(arrancoLinha);
        const passoCol = Math.sign(arrancoColuna);
        let r = fromRow + passoLinha;
        let c = fromCol + passoCol;

        while (r !== toRow || c !== toCol) {
            if (pieces[r * 8 + c] !== "") return false;
            r += passoLinha;
            c += passoCol;
        }
        return true;
    }

    if (peca === "♗" || peca === "♝") {
        if (Math.abs(arrancoLinha) !== Math.abs(arrancoColuna)) return false;

        const passoLinha = Math.sign(arrancoLinha);
        const passoCol = Math.sign(arrancoColuna);
        let r = fromRow + passoLinha;
        let c = fromCol + passoCol;

        while (r !== toRow || c !== toCol) {
            if (pieces[r * 8 + c] !== "") return false;
            r += passoLinha;
            c += passoCol;
        }
        return true;
    }

    if (peca === "♘" || peca === "♞") {
        const rAbs = Math.abs(arrancoLinha);
        const cAbs = Math.abs(arrancoColuna);
        return (rAbs === 2 && cAbs === 1) || (rAbs === 1 && cAbs === 2);
    }

    if (peca === "♕" || peca === "♛") {
        const ehMovimentoTorre = fromRow === toRow || fromCol === toCol;
        const ehMovimentoBispo = Math.abs(arrancoLinha) === Math.abs(arrancoColuna);

        if (!ehMovimentoTorre && !ehMovimentoBispo) return false;

        const passoLinha = Math.sign(arrancoLinha);
        const passoCol = Math.sign(arrancoColuna);
        let r = fromRow + passoLinha;
        let c = fromCol + passoCol;

        while (r !== toRow || c !== toCol) {
            if (pieces[r * 8 + c] !== "") return false;
            r += passoLinha;
            c += passoCol;
        }
        return true;
    }

    if (peca === "♔" || peca === "♚") {
        if (Math.abs(arrancoLinha) <= 1 && Math.abs(arrancoColuna) <= 1) {
            return true;
        }

        const cor = obterCorDaPeca(peca);
        if (cor === "W") {
            if (fromIndex === 60 && toIndex === 62 && roqueBrancasCurto && pieces[61] === "" && pieces[62] === "") {
                return true;
            }
            if (fromIndex === 60 && toIndex === 58 && roqueBrancasLongo && pieces[59] === "" && pieces[58] === "" && pieces[57] === "") {
                return true;
            }
        } else {
            if (fromIndex === 4 && toIndex === 6 && roquePretasCurto && pieces[5] === "" && pieces[6] === "") {
                return true;
            }
            if (fromIndex === 4 && toIndex === 2 && roquePretasLongo && pieces[3] === "" && pieces[2] === "" && pieces[1] === "") {
                return true;
            }
        }
        return false;
    }
    return false;
}

function encontrarRei(cor) {
    const caractereRei = cor === "W" ? "♔" : "♚";
    return pieces.indexOf(caractereRei);
}

function reiEstaEmXeque(cor) {
    const indexRei = encontrarRei(cor);
    if (indexRei === -1) return false;

    for (let i = 0; i < 64; i++) {
        const peca = pieces[i];
        if (peca !== "" && obterCorDaPeca(peca) !== cor && movimentoValido(i, indexRei, peca)) {
            return true;
        }
    }
    return false;
}

function jogadaDeixaReiEmXeque(fromIndex, toIndex, peca) {
    const pecaOrigemOriginal = pieces[fromIndex];
    const pecaDestinoOriginal = pieces[toIndex];

    pieces[toIndex] = pecaOrigemOriginal;
    pieces[fromIndex] = "";

    const corJogador = obterCorDaPeca(peca);
    const result = reiEstaEmXeque(corJogador);

    pieces[fromIndex] = pecaOrigemOriginal;
    pieces[toIndex] = pecaDestinoOriginal;

    return result;
}

function movimentosLegais(cor) {
    for (let fromIndex = 0; fromIndex < 64; fromIndex++) {
        const peca = pieces[fromIndex];

        if (peca !== "" && obterCorDaPeca(peca) === cor) {
            for (let toIndex = 0; toIndex < 64; toIndex++) {
                if (movimentoValido(fromIndex, toIndex, peca) && !jogadaDeixaReiEmXeque(fromIndex, toIndex, peca)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function xequeMate(cor) {
    return reiEstaEmXeque(cor) && !movimentosLegais(cor);
}

function atualizarDestaques() {
    if (selectedSquareIndex === null) {
        movimentosPossiveis = [];
        casasAmeacadas = [];
        return;
    }

    const pecaSelecionada = pieces[selectedSquareIndex];
    movimentosPossiveis = [];
    casasAmeacadas = [];

    for (let i = 0; i < 64; i++) {
        if (movimentoValido(selectedSquareIndex, i, pecaSelecionada) && !jogadaDeixaReiEmXeque(selectedSquareIndex, i, pecaSelecionada)) {
            movimentosPossiveis.push(i);
        }
    }

    const corOponente = turnoAtual === "W" ? "B" : "W";
    for (let i = 0; i < 64; i++) {
        const peca = pieces[i];
        if (peca !== "" && obterCorDaPeca(peca) === corOponente) {
            for (let j = 0; j < 64; j++) {
                if (movimentoValido(i, j, peca) && pieces[j] !== "" && obterCorDaPeca(pieces[j]) !== corOponente) {
                    casasAmeacadas.push(j);
                }
            }
        }
    }
}

function adicionarAoHistorico(fromIndex, toIndex, peca) {
    if (!moveHistoryContainer) return;
    
    const colunas = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const paraCasa = colunas[toIndex % 8] + (8 - Math.floor(toIndex / 8));
    
    let prefixo = "";
    if (["♖", "♜"].includes(peca)) prefixo = "T";
    if (["♘", "♞"].includes(peca)) prefixo = "C";
    if (["♗", "♝"].includes(peca)) prefixo = "B";
    if (["♕", "♛"].includes(peca)) prefixo = "D";
    if (["♔", "♚"].includes(peca)) prefixo = "R";

    const textoJogada = `${prefixo}${paraCasa}`;

    if (contadorJogadas === 1 && turnoAtual === "W") {
        moveHistoryContainer.innerHTML = "";
    }

    if (turnoAtual === "W") {
        const row = document.createElement("div");
        row.classList.add("move-row");
        row.id = `move-row-${contadorJogadas}`;
        row.innerHTML = `
            <div class="move-number">${contadorJogadas}.</div>
            <div class="move-white">${textoJogada}</div>
            <div class="move-black"></div>
        `;
        moveHistoryContainer.appendChild(row);
    } else {
        const row = document.getElementById(`move-row-${contadorJogadas}`);
        if (row) {
            row.querySelector(".move-black").textContent = textoJogada;
        }
        contadorJogadas++;
    }
    moveHistoryContainer.scrollTop = moveHistoryContainer.scrollHeight;
}

function reiniciarJogo() {
    pieces.splice(0, pieces.length, ...estadoInicial);
    turnoAtual = "W";
    selectedSquareIndex = null;
    movimentosPossiveis = [];
    casasAmeacadas = [];
    ultimoMovimento = null;
    roqueBrancasCurto = true;
    roqueBrancasLongo = true;
    roquePretasCurto = true;
    roquePretasLongo = true;
    
    contadorJogadas = 1;
    if (moveHistoryContainer) {
        moveHistoryContainer.innerHTML = '<p class="empty-history">Nenhum movimento realizado.</p>';
    }
    
    criarTabuleiro();
}

restartButton.addEventListener("click", reiniciarJogo);

function tratarCliqueNaCasa(index) {
    const pecaClicada = pieces[index];

    if (selectedSquareIndex === null) {
        if (pecaClicada !== "") {
            const corDaPeca = obterCorDaPeca(pecaClicada);
            if (corDaPeca !== turnoAtual) {
                alert("Não é a sua vez! É a vez das " + (turnoAtual === "W" ? "Brancas" : "Pretas"));
                return;
            }

            selectedSquareIndex = index;
            atualizarDestaques();
            criarTabuleiro();
        }
    } else {
        if (selectedSquareIndex === index) {
            selectedSquareIndex = null;
            movimentosPossiveis = [];
            casasAmeacadas = [];
            criarTabuleiro();
            return;
        }

        const pecaSelecionada = pieces[selectedSquareIndex];
        if (movimentoValido(selectedSquareIndex, index, pecaSelecionada)) {
            if (jogadaDeixaReiEmXeque(selectedSquareIndex, index, pecaSelecionada)) {
                alert("Movimento inválido! Você está deixando o rei em xeque.");
                selectedSquareIndex = null;
                movimentosPossiveis = [];
                casasAmeacadas = [];
                criarTabuleiro();
                return;
            }

            if (pecaSelecionada === "♔" && selectedSquareIndex === 60 && index === 62) {
                pieces[63] = "";
                pieces[61] = "♖";
            } else if (pecaSelecionada === "♔" && selectedSquareIndex === 60 && index === 58) {
                pieces[56] = "";
                pieces[59] = "♖";
            } else if (pecaSelecionada === "♚" && selectedSquareIndex === 4 && index === 6) {
                pieces[7] = "";
                pieces[5] = "♜";
            } else if (pecaSelecionada === "♚" && selectedSquareIndex === 4 && index === 2) {
                pieces[0] = "";
                pieces[3] = "♜";
            }

            if (ehEnPassant(selectedSquareIndex, index, pecaSelecionada)) {
                const toRow = Math.floor(index / 8);
                const toCol = index % 8;
                const capturedIndex = pecaSelecionada === "♙" ? (toRow + 1) * 8 + toCol : (toRow - 1) * 8 + toCol;
                pieces[capturedIndex] = "";
            }

            pieces[index] = pecaSelecionada;
            pieces[selectedSquareIndex] = "";

            if ((pecaSelecionada === "♙" && index < 8) || (pecaSelecionada === "♟" && index >= 56)) {
                promoverPeca(index, pecaSelecionada);
            }

            ultimoMovimento = [selectedSquareIndex, index, pecaSelecionada];
            
            // Registra a jogada ANTES de mudar o turno
            adicionarAoHistorico(selectedSquareIndex, index, pecaSelecionada);

            if (pecaSelecionada === "♔") {
                roqueBrancasCurto = false;
                roqueBrancasLongo = false;
            } else if (pecaSelecionada === "♚") {
                roquePretasCurto = false;
                roquePretasLongo = false;
            } else if (pecaSelecionada === "♖") {
                if (selectedSquareIndex === 56) roqueBrancasLongo = false;
                if (selectedSquareIndex === 63) roqueBrancasCurto = false;
            } else if (pecaSelecionada === "♜") {
                if (selectedSquareIndex === 0) roquePretasLongo = false;
                if (selectedSquareIndex === 7) roquePretasCurto = false;
            }

            const proximoTurno = turnoAtual === "W" ? "B" : "W";

            if (reiEstaEmXeque(proximoTurno)) {
                setTimeout(() => alert("XEQUE! O rei está em xeque!"), 100);
            }

            if (xequeMate(proximoTurno)) {
                criarTabuleiro();
                setTimeout(() => {
                    alert("XEQUE-MATE! Vitória das " + (turnoAtual === "W" ? "Brancas" : "Pretas") + "!");
                    reiniciarJogo();
                }, 100);
                return;
            }

            turnoAtual = proximoTurno;
        } else {
            alert("Movimento inválido para esta peça!");
        }

        selectedSquareIndex = null;
        movimentosPossiveis = [];
        casasAmeacadas = [];
        criarTabuleiro();
    }
}

// Inicializa o jogo pela primeira vez
criarTabuleiro();