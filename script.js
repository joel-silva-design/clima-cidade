const cidadeInput = document.getElementById("cidade");
let temperatura = document.getElementById("temperatura");
let btnProcurar = document.getElementById("olhar-cidade");
let imagem = document.querySelector("img");
let erroCidade = document.getElementById("cidade-erro");

btnProcurar.addEventListener('click', async () => {
    let cidade = cidadeInput.value.trim().toLowerCase();
    console.log(cidade);

    try{

    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cidade)}&appid=cf0c3c8af20137c73fc7a25961a89be3&units=metric&lang=pt_br`)
        let data = await response.json();
            console.log('Resposta recebida:', data); 
            console.log('Dados processados:', data);
            console.log('longitude:', data.coord.lon, 'latitude:', data.coord.lat);
            temperatura.innerText =`${data.main.temp}ºC`
            let icon = data.weather[0].icon;
            imagem.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
            erroCidade.innerHTML = "";
    }
        
        catch(error) {
            if (cidadeInput.value === ""){
            erroCidade.innerHTML = "Digite uma Cidade";
            temperatura.innerText = "";
            imagem.src = "";
        }else {
            console.error('Algo deu errado:', error);
            erroCidade.innerHTML = "Cidade Não Encontrada, verifique a escrita da Cidade";
            temperatura.innerText = "";
            imagem.src = "";
        }
        };

});

document.addEventListener('keydown', (evento) => {
    if(evento.key === 'Enter'){
        btnProcurar.click();
    }
});