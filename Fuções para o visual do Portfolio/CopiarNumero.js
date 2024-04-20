document.addEventListener('DOMContentLoaded', function() {
    const whatsappLink = document.getElementById('whatsappLink');

    // Adicionar evento de clique ao link
    whatsappLink.addEventListener('click', function(e) {
        e.preventDefault(); // Prevenir o comportamento padrão do link

        // Número de telefone para copiar
        const phoneNumber = '11 96977-5971';

        // Copiar o número de telefone para a área de transferência
        navigator.clipboard.writeText(phoneNumber)
            .then(() => {
                // Exibir mensagem de sucesso
                alert('Número de telefone copiado: ' + phoneNumber);
            })
            .catch(err => {
                console.error('Erro ao copiar número de telefone: ', err);
                // Exibir mensagem de erro, se necessário
            });
    });
});
