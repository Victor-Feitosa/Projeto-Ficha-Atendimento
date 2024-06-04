$(document).ready(function(){
    $('#rg').mask('00.000.000-A');
    $('#cpf').mask('000.000.000-00');
    $('#telefone').mask('(00) 00000-0000');
    $('#cep').mask('00.000-000');

    $('#cep').on('blur', function() {
        const cep = $(this).val().replace(/\D/g, '');
        if (cep !== "") {
            const validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $.getJSON(`https://viacep.com.br/ws/${cep}/json/`, function(dados) {
                    if (!("erro" in dados)) {
                        $('#rua').val(dados.logradouro);
                        $('#bairro').val(dados.bairro);
                        $('#cidade').val(dados.localidade);
                        $('#estado').val(dados.uf);
                    } else {
                        alert("CEP não encontrado.");
                    }
                });
            } else {
                alert("Formato de CEP inválido.");
            }
        }
    });
    $('#togglePassword').on('click', function() {
        const passwordField = $('#senha');
        const passwordFieldType = passwordField.attr('type');
        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
            $(this).text('Esconder');
        } else {
            passwordField.attr('type', 'password');
            $(this).text('Mostrar');
        }
    });
});

function toggleEmpregadoFields() {
    const empregado = document.getElementById('empregado').checked;
    document.getElementById('empresaField').style.display = empregado ? 'block' : 'none';
    document.getElementById('profissaoField').style.display = empregado ? 'block' : 'none';
}

document.getElementById('mainForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Gather form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => data[key] = value);

    // Check if "Informações extras" is empty
    if (!data.informacoesextras) {
        data.informacoesextras = "Não há informações extras";
    }

    // Generate PDFs if necessary
    if (document.getElementById('declaracaoEnderecoEletronico').checked) {
        generateEnderecoEletronicoPDF(data);
    }
    if (document.getElementById('declaracaoJusticaGratuita').checked) {
        generateJusticaGratuitaPDF(data);
    }
    if (document.getElementById('declaracaoResponsabilidade').checked) {
        generateResponsabilidadePDF(data);
    }
    if (document.getElementById('declaracaoBeneficio').checked) {
        generateBeneficioPDF(data);
    }
    if (document.getElementById('fichaDadosCliente').checked) {
        generateFichaClientePDF(data);
    }
});

function generateEnderecoEletronicoPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARAÇÃO', 105, 20, null, null, 'center');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const content = `${data.nome.toUpperCase()}, brasileiro, portador da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrito no CPF/MF sob nº ${data.cpf}, residente e domiciliado na ${data.rua}, nº ${data.numerocasa}, ${data.bairro}, CEP ${data.cep}, em ${data.cidade}-${data.estado}, venho perante a este instrumento declarar que não possuo endereço eletrônico.`;
    doc.autoTable({
        startY: 30,
        head: [['']],
        body: [[content]],
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 2,
            valign: 'top',
            overflow: 'linebreak',
            halign: 'justify'
        }
    });
    const today = new Date();
    doc.text(`${data.cidade}, ${today.getDate()} de ${today.toLocaleString('default', { month: 'long' })} de ${today.getFullYear()}`, 105, 85, null, null, 'center');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.nome.toUpperCase(), 105, 95, null, null, 'center');
    doc.save(`Declaracao de Endereco Eletronico - ${data.nome}.pdf`);
}

function generateJusticaGratuitaPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARAÇÃO', 105, 20, null, null, 'center');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const content = `${data.nome.toUpperCase()}, brasileiro, portador da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrito no CPF/MF sob nº ${data.cpf}, residente e domiciliado na ${data.rua}, nº ${data.numerocasa}, ${data.bairro}, CEP ${data.cep}, em ${data.cidade}-${data.estado}, declaro para os devidos fins legais e de direito, que sou pessoa pobre na acepção jurídica da palavra, e não posso arcar com o pagamento das custas e despesas processuais, bem como honorários advocatícios, sem comprometer o sustento da minha família, responsabilizando-me pelas declarações e sujeitando-me às sanções cíveis, administrativa e criminal pela falsa declaração, nos termos do que preceitua o parágrafo 3º da Lei 7.115/83 e artigo 12 da Lei 1.060/50.`;
    doc.autoTable({
        startY: 30,
        head: [['']],
        body: [[content]],
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 2,
            valign: 'top',
            overflow: 'linebreak',
            halign: 'justify'
        }
    });
    doc.setFontSize(11);
    const today = new Date();
    doc.text(`${data.cidade}, ${today.getDate()} de ${today.toLocaleString('default', { month: 'long' })} de ${today.getFullYear()}`, 105, 110, null, null, 'center');
    doc.setFont('helvetica', 'bold');
    doc.text(data.nome.toUpperCase(), 105, 120, null, null, 'center');
    doc.save(`Declaracao de Pobreza - ${data.nome}.pdf`);
}

function generateResponsabilidadePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARAÇÃO', 105, 20, null, null, 'center');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const content = `${data.nome.toUpperCase()}, brasileiro, portador da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrito no CPF/MF sob nº ${data.cpf}, residente e domiciliado na ${data.rua}, nº ${data.numerocasa}, ${data.bairro}, CEP ${data.cep}, em ${data.cidade}-${data.estado}, declaro para os devidos fins legais e de direito, que todos os documentos por mim entregues ao advogado desta causa são cópias autênticas e fieis aos originais, sob responsabilidade exclusivamente minha.`;
    doc.autoTable({
        startY: 30,
        head: [['']],
        body: [[content]],
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 2,
            valign: 'top',
            overflow: 'linebreak',
            halign: 'justify'
        }
    });
    doc.setFontSize(11);
    const today = new Date();
    doc.text(`${data.cidade}, ${today.getDate()} de ${today.toLocaleString('default', { month: 'long' })} de ${today.getFullYear()}`, 105, 95, null, null, 'center');
    doc.setFont('helvetica', 'bold');
    doc.text(data.nome.toUpperCase(), 105, 105, null, null, 'center');
    doc.save(`Declaracao de Responsabilidade - ${data.nome}.pdf`);
}

function generateBeneficioPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DECLARAÇÃO', 105, 20, null, null, 'center');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const content = `${data.nome.toUpperCase()}, brasileiro, portador da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrito no CPF/MF sob nº ${data.cpf}, residente e domiciliado na ${data.rua}, nº ${data.numerocasa}, ${data.bairro}, CEP ${data.cep}, em ${data.cidade}-${data.estado}, declaro para os devidos fins legais e de direito, que não existe propositura de nenhuma ação com o mesmo número de benefício indicado na inicial.`;
    doc.autoTable({
        startY: 30,
        head: [['']],
        body: [[content]],
        theme: 'plain',
        styles: {
            fontSize: 11,
            cellPadding: 2,
            valign: 'top',
            overflow: 'linebreak',
            halign: 'justify'
        }
    });
    doc.setFontSize(11);
    const today = new Date();
    doc.text(`${data.cidade}, ${today.getDate()} de ${today.toLocaleString('default', { month: 'long' })} de ${today.getFullYear()}`, 105, 95, null, null, 'center');
    doc.setFont('helvetica', 'bold');
    doc.text(data.nome.toUpperCase(), 105, 105, null, null, 'center');
    doc.save(`Declaracao de Beneficio - ${data.nome}.pdf`);
}

function generateFichaClientePDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    const content = `
    DADOS:
    Nome: ${data.nome}
    RG: ${data.rg}
    CPF: ${data.cpf}
    Data de nascimento: ${data.datanascimento}
    
    CONTATO:
    Telefone: ${data.telefone}
    Email: ${data.email}
    
    ENDEREÇO:
    Rua: ${data.rua}
    Numero: ${data.numerocasa}
    Bairro: ${data.bairro}
    Cidade: ${data.cidade}
    Estado: ${data.estado}
    CEP: ${data.cep}
    
    TRABALHO:
    Nome da empresa: ${data.nomeempresa}
    Profissão: ${data.profissao}
    
    EXTRAS:
    Informações extras: ${data.informacoesextras}
    `;
    doc.autoTable({
        startY: 10,
        head: [['']],
        body: [[content]],
        theme: 'plain',
        styles: {
            fontSize: 12,
            cellPadding: 2,
            valign: 'top',
            overflow: 'linebreak'
        }
    });
    doc.save(`Ficha_Dados_Cliente - ${data.nome}.pdf`);
}
