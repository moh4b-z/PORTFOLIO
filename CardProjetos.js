function carregar() {
    fetch('Projetos.json')
        .then(response => response.json)
        .then(Projetos => {
            const container = document.querySelector('#CardParaProjetos')

            Projetos.map(Projeto => {
                const card = document.createElement("div")
                card.classList.add("card")

                const titulo = document.createElement("h3")
                titulo.textContent = jogo.nome

                const img = document.createElement("img")
                img.src = jogo.img


                card.appendChild(titulo)
                card.appendChild(img)
                container.appendChild(card)
            })

        })
}
carregar()