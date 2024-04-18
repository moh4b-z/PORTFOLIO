function carregar() {
    fetch('Projetos.json')
        .then(response => response.json()) // Corrigir chamada de response.json()
        .then(projetos => {
            const container = document.querySelector('#CardParaProjetos');

            projetos.forEach(projeto => {
                const card = document.createElement("div");
                card.classList.add("Card");

                const titulo = document.createElement("h3");
                titulo.textContent = projeto.Nome; // Acessar o atributo 'Nome'

                const img = document.createElement("img");
                img.src = projeto.Img; // Acessar o atributo 'Img'
                img.classList.add("IMGprojeto"); // Adicionar classe para estilização CSS

                const link = document.createElement("a");
                link.href = projeto.Link; // Acessar o atributo 'Link'
                link.textContent = "Acesse o Projeto";

                const descricaoTitulo = document.createElement("h5");
                descricaoTitulo.textContent = "Descrição:";

                const descricao = document.createElement("p");
                descricao.textContent = projeto.Descrição; // Acessar o atributo 'Descrição'

                const linguagensTitulo = document.createElement("h5");
                linguagensTitulo.textContent = "Linguagens:";

                const linguagensContainer = document.createElement("div");
                linguagensContainer.classList.add("LinguagensProjetos");

                projeto.Linguagens.forEach(linguagem => {
                    const imgLinguagem = document.createElement("img");
                    imgLinguagem.src = linguagem;
                    linguagensContainer.appendChild(imgLinguagem);
                });

                card.appendChild(titulo);
                card.appendChild(img);
                card.appendChild(link);
                card.appendChild(descricaoTitulo);
                card.appendChild(descricao);
                card.appendChild(linguagensTitulo);
                card.appendChild(linguagensContainer);

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os projetos:', error);
        });
}

carregar();
