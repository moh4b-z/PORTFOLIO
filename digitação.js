const el = document.querySelector("#ifeitoDigitacao");
const texts = [
    " de Desenvolvimento Web",
    " com IAs",
    " de Automatização de Serviço",
    " Mobiles",
    " de Jogos"
];
const intervalo = 200; // Intervalo entre a digitação de cada caractere
const parada = 800;   // Tempo de pausa após completar a digitação de cada texto

let currentTextIndex = 0;

function showTextWithPause(el, text, intervalo, callback) {
    const charArray = text.split("");
    let currentIndex = 0;

    const typer = setInterval(() => {
        if (currentIndex >= charArray.length) {
            clearInterval(typer);
            setTimeout(callback, parada); // Chama o callback após o tempo de pausa
        } else {
            el.innerHTML += charArray[currentIndex];
            currentIndex++;
        }
    }, intervalo);
}

function eraseText(el, intervalo, callback) {
    const text = el.innerHTML;
    const charArray = text.split("");
    let currentIndex = charArray.length - 1;

    const eraser = setInterval(() => {
        if (currentIndex < 0) {
            clearInterval(eraser);
            el.innerHTML = ""; // Após apagar completamente, chama o callback
            callback();
        } else {
            charArray.pop(); // Remove o último caractere
            el.innerHTML = charArray.join(""); // Atualiza o conteúdo do elemento
            currentIndex--;
        }
    }, intervalo);
}

function typeTextsInCycle(el, texts, intervalo) {
    showTextWithPause(el, texts[currentTextIndex], intervalo, () => {
        setTimeout(() => {
            eraseText(el, intervalo, () => {
                currentTextIndex = (currentTextIndex + 1) % texts.length;
                typeTextsInCycle(el, texts, intervalo);
            });
        }, parada);
    });
}

// Iniciar o ciclo de digitação dos textos
typeTextsInCycle(el, texts, intervalo);


/*
const el = document.querySelector("#ifeitoDigitacao");
const text1 = "de Desenvolvimento Web";
const text2 = " com IAs";
const text3 = " de Automatização de Servico";
const text4 = " Mobiles";
const text5 = " de Jogos";
const intervalo = 200;
const parada = 1000;


function showText(el, text, intervalo){
    const char = text.split("").reverse();
    const typer = setInterval(() => {
        if(!char.length) {
            return clearInterval(typer);
        }
        const next = char.pop();

        el.innerHTML += next;
    }, intervalo);
}
showText(el, text1, intervalo);
*/