const cidadeInput = document.getElementById("cidade");
const temperatura = document.getElementById("temperatura");
const btnProcurar = document.getElementById("olhar-cidade");
const imagem = document.querySelector("img");
const erroCidade = document.getElementById("cidade-erro");
const descricaoClima = document.getElementById("descricao-clima");

// Mapeamento dos elementos de opções
const checkSensacao = document.getElementById("check-sensacao");
const checkUmidade = document.getElementById("check-umidade");
const checkVento = document.getElementById("check-vento");

const containerExtras = document.getElementById("detalhes-extras");
const linhaSensacao = document.getElementById("dado-sensacao");
const textSensacao = linhaSensacao.querySelector(".target-dado");
const linhaUmidade = document.getElementById("dado-umidade");
const textUmidade = linhaUmidade.querySelector(".target-dado");
const linhaVento = document.getElementById("dado-vento");
const textVento = linhaVento.querySelector(".target-dado");

btnProcurar.addEventListener('click', async () => {
    let cidade = cidadeInput.value.trim().toLowerCase();
    
    if (cidade === "") {
        erroCidade.innerHTML = "Digite uma Cidade";
        limparTela();
        return;
    }

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=cf0c3c8af20137c73fc7a25961a89be3&units=metric&lang=pt_br`);
        
        if (!response.ok) {
            throw new Error("Cidade não encontrada");
        }

        let data = await response.json();
        
        // 1. Atualiza dados principais
        temperatura.innerText = `${Math.round(data.main.temp)}ºC`;
        descricaoClima.innerText = data.weather[0].description;
        
        let icon = data.weather[0].icon;
        imagem.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
        imagem.classList.remove("d-none");
        erroCidade.innerHTML = "";

        // 2. Injeta os valores da API nos elementos ocultos
        textSensacao.innerText = `${Math.round(data.main.feels_like)}ºC`;
        textUmidade.innerText = `${data.main.humidity}%`;
        textVento.innerText = `${Math.round(data.wind.speed * 3.6)} km/h`; // Converte m/s para km/h

        // 3. Renderiza quais informações exibir baseado nos Checkboxes
        atualizarFiltrosVisiveis();

    } catch (error) {
        console.error('Algo deu errado:', error);
        erroCidade.innerHTML = "Cidade Não Encontrada, verifique a escrita.";
        limparTela();
    }
});

// Função que gerencia a exibição baseada nas caixas marcadas
function atualizarFiltrosVisiveis() {
    // Se nenhum dado principal estiver carregado, mantém tudo oculto
    if (temperatura.innerText === "") return;

    let temAlgumAtivo = false;

    // Controla Sensação
    if (checkSensacao.checked) {
        linhaSensacao.classList.remove("d-none");
        temAlgumAtivo = true;
    } else {
        linhaSensacao.classList.add("d-none");
    }

    // Controla Umidade
    if (checkUmidade.checked) {
        linhaUmidade.classList.remove("d-none");
        temAlgumAtivo = true;
    } else {
        linhaUmidade.classList.add("d-none");
    }

    // Controla Vento
    if (checkVento.checked) {
        linhaVento.classList.remove("d-none");
        temAlgumAtivo = true;
    } else {
        linhaVento.classList.add("d-none");
    }

    // Mostra ou esconde o container pai completo
    if (temAlgumAtivo) {
        containerExtras.classList.remove("d-none");
    } else {
        containerExtras.classList.add("d-none");
    }
}

// Ouvintes de evento para atualizar a tela imediatamente se o usuário mudar as opções
[checkSensacao, checkUmidade, checkVento].forEach(checkbox => {
    checkbox.addEventListener('change', atualizarFiltrosVisiveis);
});

function limparTela() {
    temperatura.innerText = "";
    descricaoClima.innerText = "";
    imagem.src = "";
    imagem.classList.add("d-none");
    containerExtras.classList.add("d-none");
}

cidadeInput.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        btnProcurar.click();
    }
});
