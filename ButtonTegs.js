document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.NOsendoAplicado button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Adiciona a classe 'clicked' apenas ao botão clicado
            this.classList.toggle('clicked');
            // Mover o botão clicado para a div 'sendoAplicado'
            const buttonContainer = this.parentNode;
            const sendoAplicado = document.querySelector('.sendoAplicado');
            const beingAppliedButtons = sendoAplicado.querySelectorAll('button');
            
            if (buttonContainer.classList.contains('NOsendoAplicado')) {
                sendoAplicado.prepend(this);
                buttonContainer.classList.remove('NOsendoAplicado');
            } else {
                // Mover o botão clicado para o início da lista de botões em 'sendoAplicado'
                sendoAplicado.prepend(this);
                // Reordenar os botões em 'sendoAplicado' para manter a ordem dos mais recentes à esquerda
                beingAppliedButtons.forEach(button => {
                    if (button !== this && button.classList.contains('clicked')) {
                        sendoAplicado.prepend(button);
                    }
                });
            }
        });
    });
});

