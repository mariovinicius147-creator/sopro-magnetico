const dataInput = document.getElementById("data");
const situacaoSelect = document.getElementById("situacao");
const horarioSelect = document.getElementById("horario");

const entradaInput = document.getElementById("entrada");
const saidaAlmocoInput = document.getElementById("saidaAlmoco");
const retornoAlmocoInput = document.getElementById("retornoAlmoco");
const saidaInput = document.getElementById("saida");

const areaHorario = document.getElementById("areaHorario");
const almoco = document.getElementById("almoco");
const totalHoras = document.getElementById("totalHoras");

const observacaoInput = document.getElementById("observacao");

const guardarButton = document.getElementById("guardar");
const historicoButton = document.getElementById("historico");
const calendarioButton = document.getElementById("calendario");
const resumoButton = document.getElementById("resumo");


function definirDataHoje() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    dataInput.value = `${ano}-${mes}-${dia}`;
}


function horarioParaMinutos(horario) {
    if (!horario || !horario.includes(":")) {
        return null;
    }

    const partes = horario.split(":");

    const hora = Number(partes[0]);
    const minuto = Number(partes[1]);

    if (
        Number.isNaN(hora) ||
        Number.isNaN(minuto) ||
        hora < 0 ||
        hora > 23 ||
        minuto < 0 ||
        minuto > 59
    ) {
        return null;
    }

    return hora * 60 + minuto;
}


function formatarMinutos(total) {
    const horas = Math.floor(total / 60);
    const minutos = total % 60;

    return `${horas}h ${minutos}min`;
}


function calcularTotal() {
    const horarioDia = horarioSelect.value;

    const entrada = horarioParaMinutos(entradaInput.value);
    const saida = horarioParaMinutos(saidaInput.value);

    if (entrada === null || saida === null) {
        totalHoras.textContent = "0h 0min";
        return 0;
    }

    let total = 0;

    if (horarioDia === "07:00-15:00") {
        total = saida - entrada;
    } else {
        const saidaAlmoco =
            horarioParaMinutos(saidaAlmocoInput.value);

        const retornoAlmoco =
            horarioParaMinutos(retornoAlmocoInput.value);

        if (
            saidaAlmoco === null ||
            retornoAlmoco === null
        ) {
            totalHoras.textContent = "0h 0min";
            return 0;
        }

        const primeiraParte = saidaAlmoco - entrada;
        const segundaParte = saida - retornoAlmoco;

        if (
            primeiraParte < 0 ||
            segundaParte < 0
        ) {
            totalHoras.textContent = "0h 0min";
            return 0;
        }

        total = primeiraParte + segundaParte;
    }

    if (total < 0) {
        total = 0;
    }

    totalHoras.textContent = formatarMinutos(total);

    return total;
}


function aplicarHorarioSelecionado() {
    const horario = horarioSelect.value;

    localStorage.setItem(
        "ultimo_horario",
        horario
    );

    if (horario === "07:00-15:00") {
        entradaInput.value = "07:00";
        saidaInput.value = "15:00";

        saidaAlmocoInput.value = "";
        retornoAlmocoInput.value = "";

        almoco.style.display = "none";
    }

    else if (horario === "08:00-17:30") {
        entradaInput.value = "08:00";
        saidaAlmocoInput.value = "13:00";
        retornoAlmocoInput.value = "14:30";
        saidaInput.value = "17:30";

        almoco.style.display = "block";
    }

    else {
        entradaInput.value = "08:00";
        saidaAlmocoInput.value = "13:00";
        retornoAlmocoInput.value = "14:00";
        saidaInput.value = "17:00";

        almoco.style.display = "block";
    }

    calcularTotal();
}


function atualizarSituacao() {
    if (situacaoSelect.value === "Presente") {
        areaHorario.style.display = "block";
    } else {
        areaHorario.style.display = "none";
    }
}


function carregarRegistos() {
    const texto = localStorage.getItem(
        "registos_sopro_magnetico"
    );

    if (!texto) {
        return [];
    }

    try {
        return JSON.parse(texto);
    } catch {
        return [];
    }
}


function guardarRegistos(registos) {
    localStorage.setItem(
        "registos_sopro_magnetico",
        JSON.stringify(registos)
    );
}


function guardarRegisto() {
    if (!dataInput.value) {
        alert("Escolha uma data.");
        return;
    }

    const situacao = situacaoSelect.value;

    let totalMinutos = 0;

    if (situacao === "Presente") {
        totalMinutos = calcularTotal();
    }

    const registo = {
        data: dataInput.value,
        situacao: situacao,
        horarioDia:
            situacao === "Presente"
                ? horarioSelect.value
                : "",
        entrada:
            situacao === "Presente"
                ? entradaInput.value
                : "",
        saidaAlmoco:
            situacao === "Presente"
                ? saidaAlmocoInput.value
                : "",
        retornoAlmoco:
            situacao === "Presente"
                ? retornoAlmocoInput.value
                : "",
        saida:
            situacao === "Presente"
                ? saidaInput.value
                : "",
        observacao: observacaoInput.value.trim(),
        totalMinutos: totalMinutos
    };

    const registos = carregarRegistos();

    const indice = registos.findIndex(
        item => item.data === registo.data
    );

    if (indice >= 0) {
        registos[indice] = registo;
    } else {
        registos.push(registo);
    }

    guardarRegistos(registos);

    alert("Registo guardado com sucesso.");
}


function mostrarHistorico() {
    const registos = carregarRegistos();

    if (registos.length === 0) {
        alert("Ainda não existem registos.");
        return;
    }

    const ordenados = [...registos].sort(
        (a, b) =>
            new Date(b.data) - new Date(a.data)
    );

    let texto = "HISTÓRICO\n\n";

    ordenados.forEach(registo => {
        texto +=
            `${formatarData(registo.data)}\n`;

        texto +=
            `${registo.situacao}\n`;

        if (registo.situacao === "Presente") {
            texto +=
                `Horário: ${registo.horarioDia}\n`;

            texto +=
                `Entrada: ${registo.entrada}\n`;

            if (
                registo.horarioDia !==
                "07:00-15:00"
            ) {
                texto +=
                    `Almoço: ${registo.saidaAlmoco} - ${registo.retornoAlmoco}\n`;
            } else {
                texto +=
                    "Intervalo: 15 min\n";
            }

            texto +=
                `Saída: ${registo.saida}\n`;

            texto +=
                `Total: ${formatarMinutos(
                    registo.totalMinutos
                )}\n`;
        }

        if (registo.observacao) {
            texto +=
                `Obs.: ${registo.observacao}\n`;
        }

        texto += "\n";
    });

    alert(texto);
}


function mostrarResumoMensal() {
    const registos = carregarRegistos();

    if (registos.length === 0) {
        alert("Ainda não existem registos.");
        return;
    }

    const hoje = new Date();

    const anoAtual = hoje.getFullYear();

    const mesAtual =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const prefixo =
        `${anoAtual}-${mesAtual}`;

    const registosMes =
        registos.filter(
            registo =>
                registo.data.startsWith(prefixo)
        );

    let presentes = 0;
    let faltas = 0;
    let faltasJustificadas = 0;
    let ferias = 0;
    let baixa = 0;
    let folgas = 0;
    let totalMinutos = 0;

    registosMes.forEach(registo => {
        switch (registo.situacao) {
            case "Presente":
                presentes++;
                totalMinutos +=
                    registo.totalMinutos || 0;
                break;

            case "Falta":
                faltas++;
                break;

            case "Falta justificada":
                faltasJustificadas++;
                break;

            case "Férias":
                ferias++;
                break;

            case "Baixa médica":
                baixa++;
                break;

            case "Folga":
                folgas++;
                break;
        }
    });

    const texto =
        `RESUMO DO MÊS\n\n` +
        `Dias presentes: ${presentes}\n` +
        `Faltas: ${faltas}\n` +
        `Faltas justificadas: ${faltasJustificadas}\n` +
        `Férias: ${ferias}\n` +
        `Baixa médica: ${baixa}\n` +
        `Folgas: ${folgas}\n\n` +
        `Horas trabalhadas: ${formatarMinutos(totalMinutos)}\n` +
        `Dias registados: ${registosMes.length}`;

    alert(texto);
}


function mostrarCalendario() {
    const registos = carregarRegistos();

    if (registos.length === 0) {
        alert("Ainda não existem registos.");
        return;
    }

    const hoje = new Date();

    const anoAtual = hoje.getFullYear();

    const mesAtual =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const prefixo =
        `${anoAtual}-${mesAtual}`;

    const registosMes =
        registos
            .filter(
                registo =>
                    registo.data.startsWith(prefixo)
            )
            .sort(
                (a, b) =>
                    new Date(a.data) -
                    new Date(b.data)
            );

    if (registosMes.length === 0) {
        alert(
            "Não existem registos neste mês."
        );
        return;
    }

    let texto = "CALENDÁRIO DO MÊS\n\n";

    registosMes.forEach(registo => {
        texto +=
            `${formatarData(registo.data)} - ` +
            `${simboloSituacao(registo.situacao)} ` +
            `${registo.situacao}\n`;
    });

    alert(texto);
}


function simboloSituacao(situacao) {
    switch (situacao) {
        case "Presente":
            return "✅";

        case "Falta":
            return "❌";

        case "Falta justificada":
            return "📄";

        case "Férias":
            return "🏖️";

        case "Baixa médica":
            return "🏥";

        case "Folga":
            return "🏠";

        default:
            return "";
    }
}


function formatarData(data) {
    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function carregarUltimoHorario() {
    const horario =
        localStorage.getItem("ultimo_horario");

    if (
        horario === "08:00-17:00" ||
        horario === "07:00-15:00" ||
        horario === "08:00-17:30"
    ) {
        horarioSelect.value = horario;
    }

    aplicarHorarioSelecionado();
}


horarioSelect.addEventListener(
    "change",
    aplicarHorarioSelecionado
);

situacaoSelect.addEventListener(
    "change",
    atualizarSituacao
);

entradaInput.addEventListener(
    "change",
    calcularTotal
);

saidaAlmocoInput.addEventListener(
    "change",
    calcularTotal
);

retornoAlmocoInput.addEventListener(
    "change",
    calcularTotal
);

saidaInput.addEventListener(
    "change",
    calcularTotal
);

guardarButton.addEventListener(
    "click",
    guardarRegisto
);

historicoButton.addEventListener(
    "click",
    mostrarHistorico
);

calendarioButton.addEventListener(
    "click",
    mostrarCalendario
);

resumoButton.addEventListener(
    "click",
    mostrarResumoMensal
);


definirDataHoje();
carregarUltimoHorario();
atualizarSituacao();
calcularTotal();