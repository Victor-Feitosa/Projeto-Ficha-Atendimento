$(document).ready(function(){
    $("#rg").inputmask("99.999.999-9");
    $("#cpf").inputmask("999.999.999-99");
    $("#cep").inputmask("99.999-999");
    $("#telefone").inputmask("(99) 99999-9999");
});

document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                }
            });
    }
});

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    if (cpf.length !== 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    let add = 0;
    for (let i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    add = 0;
    for (let i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

function getCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth(); 
    const year = now.getFullYear();

    return {
        day: day.toString().padStart(2, '0'),
        month: month.toString().padStart(2, '0'),
        year: year
    };
}


async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const form = document.getElementById('dataForm');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    if (!validarCPF(data.cpf)) {
        document.getElementById('cpfError').classList.remove('d-none');
        return;
    } else {
        document.getElementById('cpfError').classList.add('d-none');
    }

    data.empregado = data.empregado ? 'Sim' : 'Não';
    data.feminino = data.feminino ? 'Sim' : 'Não';

    doc.text(`Nome: ${data.nome}`, 10, 10);
    doc.text(`RG: ${data.rg}`, 10, 20);
    doc.text(`CPF: ${data.cpf}`, 10, 30);
    doc.text(`Telefone: ${data.telefone}`, 10, 40);
    doc.text(`Email: ${data.email}`, 10, 50);
    doc.text(`Senha do INSS: ${data.senhaINSS}`, 10, 60);
    doc.text(`Número da Casa: ${data.numero}`, 10, 70);
    doc.text(`CEP: ${data.cep}`, 10, 120);
    doc.text(`Empregado: ${data.empregado}`, 10, 130);
    doc.text(`Nome da empresa: ${data.empresa}`, 10, 140);
    doc.text(`Profissão: ${data.profissao}`, 10, 150);
    doc.text(`Opção Selecionada: ${data.menu}`, 10, 160);
    doc.text(`Informações: ${data.info}`, 10, 170);

    const cep = data.cep.replace(/\D/g, '');
    let addressData;
    if (cep.length === 8) {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        addressData = await response.json();
        if (!addressData.erro) {
            doc.text(`Rua: ${addressData.logradouro}`, 10, 80);
            doc.text(`Bairro: ${addressData.bairro}`, 10, 90);
            doc.text(`Cidade: ${addressData.localidade}`, 10, 100);
            doc.text(`Estado: ${addressData.uf}`, 10, 110);
        }
    }

    doc.save(`Dados Cliente - ${data.nome}.pdf`);
    
    if (document.getElementById('declaracao').checked && addressData) {
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const DataNova = new Date();
        const date = getCurrentDate();
        const declaracaoDoc = new jsPDF();
        const enderecoCompleto = addressData.logradouro
            ? `${addressData.logradouro}, nº ${data.numero}, ${addressData.bairro}, CEP ${data.cep}, em ${addressData.localidade}-${addressData.uf}`
            : `CEP ${data.cep}`;

        const declaracaoTextoMasc = `
${data.nome}, brasileiro, portador da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrito no CPF/MF sob nº ${data.cpf}, residente e domiciliado na ${enderecoCompleto}, venho perante a este instrumento declarar que não possuo endereço eletrônico.

${addressData.localidade}, ${date.day} de ${meses[DataNova.getMonth()]} de ${date.year}.`;

        const declaracaoTextoFem = `
${data.nome}, brasileira, portadora da Cédula de Identidade RG. nº ${data.rg} SSP/SP e inscrita no CPF/MF sob nº ${data.cpf}, residente e domiciliada na ${enderecoCompleto}, venho perante a este instrumento declarar que não possuo endereço eletrônico.
        
${addressData.localidade}, ${date.day} de ${meses[DataNova.getMonth()]} de ${date.year}.`;

        declaracaoDoc.text('DECLARAÇÃO', 105, 20, null, null, 'center');
        
        if(document.getElementById("feminino").checked){
            const splitTexto = declaracaoDoc.splitTextToSize(declaracaoTextoFem, 180);
            declaracaoDoc.text(splitTexto, 10, 40);
        } else {
            const splitTexto = declaracaoDoc.splitTextToSize(declaracaoTextoMasc, 180);
            declaracaoDoc.text(splitTexto, 10, 40);
        }


        declaracaoDoc.save(`declaracao_endereco_eletronico - ${data.nome}.pdf`);
    }
}
