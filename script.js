const cidadeInput = document.getElementById("cidade");
const temperatura = document.getElementById("temperatura");
const btnProcurar = document.getElementById("olhar-cidade");
const imagem = document.querySelector("img");
const erroCidade = document.getElementById("cidade-erro");

btnProcurar.addEventListener('click', async () => {
    let cidade = cidadeInput.value.trim().toLowerCase();
    
    // Validação imediata se o campo estiver vazio antes de fazer a requisição
    if (cidade === "") {
        erroCidade.innerHTML = "Digite uma Cidade";
        temperatura.innerText = "";
        imagem.src = "";
        imagem.classList.add("d-none"); // Oculta o quadrado preto da imagem no Bootstrap
        return;
    }

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=cf0c3c8af20137c73fc7a25961a89be3&units=metric&lang=pt_br`);
        
        // Se a API retornar erro (ex: 404), força a ida para o bloco catch
        if (!response.ok) {
            throw new Error("Cidade não encontrada");
        }

        let data = await response.json();
        
        // Atualiza a temperatura na tela
        temperatura.innerText = `${Math.round(data.main.temp)}ºC`; // Arredonda a temperatura
        
        // Controla e exibe o ícone do clima do Bootstrap
        let icon = data.weather[0].icon;
        imagem.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`); // Atualizado para https
        imagem.classList.remove("d-none"); // Mostra a imagem de volta na tela
        
        // Limpa mensagens de erro anteriores
        erroCidade.innerHTML = "";

    } catch (error) {
        console.error('Algo deu errado:', error);
        erroCidade.innerHTML = "Cidade Não Encontrada, verifique a escrita.";
        temperatura.innerText = "";
        imagem.src = "";
        imagem.classList.add("d-none"); // Oculta o quadrado preto da imagem se falhar
    }
});

// Executa a busca ao pressionar a tecla Enter dentro do campo de input
cidadeInput.addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault(); // Evita comportamentos inesperados do formulário
        btnProcurar.click();
    }
});
