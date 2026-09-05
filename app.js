const dataInput = document.getElementById("data");
const situacaoSelect = document.getElementById("situacao");
const horarioSelect = document.getElementById("horario");
const entradaInput = document.getElementById("entrada");
const saidaAlmocoInput = document.getElementById("saidaAlmoco");
const retornoAlmocoInput = document.getElementById("retornoAlmoco");
const saidaInput = document.getElementById("saida");
const areaHorario = document.getElementById("areaHorario");
const almoco = document.getElementById("almoco");
const intervalo15 = document.getElementById("intervalo15");
const totalHoras = document.getElementById("totalHoras");
const observacaoInput = document.getElementById("observacao");

const guardarButton = document.getElementById("guardar");
const cancelarEdicaoButton = document.getElementById("cancelarEdicao");

const historicoButton = document.getElementById("historico");
const calendarioButton = document.getElementById("calendario");
const resumoButton = document.getElementById("resumo");

const telaPrincipal = document.getElementById("telaPrincipal");
const telaHistorico = document.getElementById("telaHistorico");
const telaCalendario = document.getElementById("telaCalendario");
const telaResumo = document.getElementById("telaResumo");

const voltarHistorico = document.getElementById("voltarHistorico");
const voltarCalendario = document.getElementById("voltarCalendario");
const voltarResumo = document.getElementById("voltarResumo");

const listaHistorico = document.getElementById("listaHistorico");

const mesAnteriorButton = document.getElementById("mesAnterior");
const mesSeguinteButton = document.getElementById("mesSeguinte");
const tituloMes = document.getElementById("tituloMes");
const gradeCalendario = document.getElementById("gradeCalendario");

const resumoMesAnterior = document.getElementById("resumoMesAnterior");
const resumoMesSeguinte = document.getElementById("resumoMesSeguinte");
const tituloResumoMes = document.getElementById("tituloResumoMes");
const conteudoResumo = document.getElementById("conteudoResumo");

let dataOriginalEdicao = null;

let calendarioAno = new Date().getFullYear();
let calendarioMes = new Date().getMonth();

let resumoAno = new Date().getFullYear();
let resumoMes = new Date().getMonth();


/* =====================================================
   DATA
===================================================== */

function definirDataHoje() {

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    dataInput.value =
        `${ano}-${mes}-${dia}`;
}


/* =====================================================
   HORAS
===================================================== */

function horarioParaMinutos(horario) {

    if (
        !horario ||
        !horario.includes(":")
    ) {
        return null;
    }

    const partes =
        horario.split(":");

    const hora =
        Number(partes[0]);

    const minuto =
        Number(partes[1]);

    if (
        Number.isNaN(hora) ||
        Number.isNaN(minuto)
    ) {
        return null;
    }

    return hora * 60 + minuto;
}


function formatarMinutos(total) {

    total =
        Number(total) || 0;

    const horas =
        Math.floor(total / 60);

    const minutos =
        total % 60;

    return `${horas}h ${minutos}min`;
}


function calcularTotal() {

    const horarioDia =
        horarioSelect.value;

    const entrada =
        horarioParaMinutos(
            entradaInput.value
        );

    const saida =
        horarioParaMinutos(
            saidaInput.value
        );

    if (
        entrada === null ||
        saida === null
    ) {

        totalHoras.textContent =
            "0h 0min";

        return 0;
    }

    let total = 0;


    /* 07:00 - 15:00
       O intervalo de 15 minutos é pago,
       por isso NÃO é descontado.
    */

    if (
        horarioDia ===
        "07:00-15:00"
    ) {

        total =
            saida - entrada;

    } else {

        const saidaAlmoco =
            horarioParaMinutos(
                saidaAlmocoInput.value
            );

        const retornoAlmoco =
            horarioParaMinutos(
                retornoAlmocoInput.value
            );

        if (
            saidaAlmoco === null ||
            retornoAlmoco === null
        ) {

            totalHoras.textContent =
                "0h 0min";

            return 0;
        }

        const primeiraParte =
            saidaAlmoco - entrada;

        const segundaParte =
            saida - retornoAlmoco;

        if (
            primeiraParte < 0 ||
            segundaParte < 0
        ) {

            totalHoras.textContent =
                "0h 0min";

            return 0;
        }

        total =
            primeiraParte +
            segundaParte;
    }


    if (total < 0) {
        total = 0;
    }

    totalHoras.textContent =
        formatarMinutos(total);

    return total;
}


/* =====================================================
   HORÁRIOS PREDEFINIDOS
===================================================== */

function aplicarHorarioSelecionado() {

    const horario =
        horarioSelect.value;

    localStorage.setItem(
        "ultimo_horario",
        horario
    );


    if (
        horario ===
        "07:00-15:00"
    ) {

        entradaInput.value =
            "07:00";

        saidaInput.value =
            "15:00";

        saidaAlmocoInput.value =
            "";

        retornoAlmocoInput.value =
            "";

        almoco.style.display =
            "none";

        intervalo15.style.display =
            "block";

    }

    else if (
        horario ===
        "08:00-17:30"
    ) {

        entradaInput.value =
            "08:00";

        saidaAlmocoInput.value =
            "13:00";

        retornoAlmocoInput.value =
            "14:30";

        saidaInput.value =
            "17:30";

        almoco.style.display =
            "block";

        intervalo15.style.display =
            "none";

    }

    else {

        entradaInput.value =
            "08:00";

        saidaAlmocoInput.value =
            "13:00";

        retornoAlmocoInput.value =
            "14:00";

        saidaInput.value =
            "17:00";

        almoco.style.display =
            "block";

        intervalo15.style.display =
            "none";
    }

    calcularTotal();
}


function carregarUltimoHorario() {

    const horario =
        localStorage.getItem(
            "ultimo_horario"
        );

    if (
        horario === "08:00-17:00" ||
        horario === "07:00-15:00" ||
        horario === "08:00-17:30"
    ) {

        horarioSelect.value =
            horario;

    } else {

        horarioSelect.value =
            "08:00-17:00";
    }

    aplicarHorarioSelecionado();
}


/* =====================================================
   SITUAÇÃO
===================================================== */

function atualizarSituacao() {

    if (
        situacaoSelect.value ===
        "Presente"
    ) {

        areaHorario.style.display =
            "block";

    } else {

        areaHorario.style.display =
            "none";
    }
}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function carregarRegistos() {

    const texto =
        localStorage.getItem(
            "registos_sopro_magnetico"
        );

    if (!texto) {
        return [];
    }

    try {

        const registos =
            JSON.parse(texto);

        if (
            Array.isArray(registos)
        ) {

            return registos;
        }

        return [];

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


/* =====================================================
   GUARDAR REGISTO
===================================================== */

function guardarRegisto() {

    if (!dataInput.value) {

        alert(
            "Escolha uma data."
        );

        return;
    }


    const situacao =
        situacaoSelect.value;

    let totalMinutos = 0;


    if (
        situacao ===
        "Presente"
    ) {

        totalMinutos =
            calcularTotal();
    }


    const registo = {

        data:
            dataInput.value,

        situacao:
            situacao,

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

        observacao:
            observacaoInput.value.trim(),

        totalMinutos:
            totalMinutos
    };


    let registos =
        carregarRegistos();


    /* Se estiver a editar e mudar a data,
       remove o registo da data antiga.
    */

    if (
        dataOriginalEdicao &&
        dataOriginalEdicao !== registo.data
    ) {

        registos =
            registos.filter(
                item =>
                    item.data !==
                    dataOriginalEdicao
            );
    }


    const indice =
        registos.findIndex(
            item =>
                item.data ===
                registo.data
        );


    if (indice >= 0) {

        registos[indice] =
            registo;

    } else {

        registos.push(
            registo
        );
    }


    guardarRegistos(
        registos
    );


    finalizarEdicao();


    alert(
        "Registo guardado com sucesso."
    );
}


/* =====================================================
   CANCELAR / FINALIZAR EDIÇÃO
===================================================== */

function finalizarEdicao() {

    dataOriginalEdicao =
        null;

    guardarButton.textContent =
        "GUARDAR REGISTO";

    cancelarEdicaoButton
        .classList
        .add("escondido");

    observacaoInput.value =
        "";

    definirDataHoje();

    situacaoSelect.value =
        "Presente";

    carregarUltimoHorario();

    atualizarSituacao();

    calcularTotal();
}


/* =====================================================
   EDITAR
===================================================== */

function editarRegisto(data) {

    const registos =
        carregarRegistos();

    const registo =
        registos.find(
            item =>
                item.data === data
        );

    if (!registo) {
        return;
    }


    dataOriginalEdicao =
        registo.data;

    dataInput.value =
        registo.data;

    situacaoSelect.value =
        registo.situacao;

    observacaoInput.value =
        registo.observacao || "";


    if (
        registo.situacao ===
        "Presente"
    ) {

        horarioSelect.value =
            registo.horarioDia ||
            "08:00-17:00";

        entradaInput.value =
            registo.entrada || "";

        saidaAlmocoInput.value =
            registo.saidaAlmoco || "";

        retornoAlmocoInput.value =
            registo.retornoAlmoco || "";

        saidaInput.value =
            registo.saida || "";


        if (
            horarioSelect.value ===
            "07:00-15:00"
        ) {

            almoco.style.display =
                "none";

            intervalo15.style.display =
                "block";

        } else {

            almoco.style.display =
                "block";

            intervalo15.style.display =
                "none";
        }
    }


    atualizarSituacao();

    calcularTotal();

    guardarButton.textContent =
        "GUARDAR ALTERAÇÕES";

    cancelarEdicaoButton
        .classList
        .remove("escondido");

    mostrarTela(
        "principal"
    );

    window.scrollTo(
        0,
        0
    );
}


/* =====================================================
   APAGAR
===================================================== */

function apagarRegisto(data) {

    const confirmar =
        confirm(
            "Tem a certeza que deseja apagar este registo?"
        );

    if (!confirmar) {
        return;
    }


    let registos =
        carregarRegistos();

    registos =
        registos.filter(
            item =>
                item.data !== data
        );

    guardarRegistos(
        registos
    );

    renderizarHistorico();
}


/* =====================================================
   SITUAÇÕES
===================================================== */

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


function abreviacaoSituacao(situacao) {

    switch (situacao) {

        case "Presente":
            return "P";

        case "Falta":
            return "F";

        case "Falta justificada":
            return "FJ";

        case "Férias":
            return "FE";

        case "Baixa médica":
            return "BM";

        case "Folga":
            return "FO";

        default:
            return "";
    }
}


/* =====================================================
   FORMATAÇÃO
===================================================== */

function formatarData(data) {

    const partes =
        data.split("-");

    if (
        partes.length !== 3
    ) {

        return data;
    }

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );
}


function escaparHtml(texto) {

    return String(texto)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =====================================================
   MUDAR DE ECRÃ
===================================================== */

function mostrarTela(tela) {

    telaPrincipal
        .classList
        .add("escondido");

    telaHistorico
        .classList
        .add("escondido");

    telaCalendario
        .classList
        .add("escondido");

    telaResumo
        .classList
        .add("escondido");


    if (
        tela === "principal"
    ) {

        telaPrincipal
            .classList
            .remove("escondido");
    }


    if (
        tela === "historico"
    ) {

        telaHistorico
            .classList
            .remove("escondido");
    }


    if (
        tela === "calendario"
    ) {

        telaCalendario
            .classList
            .remove("escondido");
    }


    if (
        tela === "resumo"
    ) {

        telaResumo
            .classList
            .remove("escondido");
    }
}


/* =====================================================
   HISTÓRICO
===================================================== */

function renderizarHistorico() {

    const registos =
        carregarRegistos();

    listaHistorico.innerHTML =
        "";


    if (
        registos.length === 0
    ) {

        listaHistorico.innerHTML =
            `
            <div class="mensagem-vazia">
                Ainda não existem registos.
            </div>
            `;

        return;
    }


    const ordenados =
        [...registos].sort(
            (a, b) =>
                b.data.localeCompare(
                    a.data
                )
        );


    ordenados.forEach(
        registo => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "registo-card";


            let detalhes = "";


            if (
                registo.situacao ===
                "Presente"
            ) {

                detalhes +=
                    `
                    <div>
                        <strong>Horário:</strong>
                        ${registo.horarioDia || "-"}
                    </div>

                    <div>
                        <strong>Entrada:</strong>
                        ${registo.entrada || "-"}
                    </div>
                    `;


                if (
                    registo.horarioDia ===
                    "07:00-15:00"
                ) {

                    detalhes +=
                        `
                        <div>
                            <strong>Intervalo:</strong>
                            15 min
                        </div>
                        `;

                } else {

                    detalhes +=
                        `
                        <div>
                            <strong>Almoço:</strong>
                            ${registo.saidaAlmoco || "-"}
                            -
                            ${registo.retornoAlmoco || "-"}
                        </div>
                        `;
                }


                detalhes +=
                    `
                    <div>
                        <strong>Saída:</strong>
                        ${registo.saida || "-"}
                    </div>

                    <div>
                        <strong>Total:</strong>
                        ${formatarMinutos(
                            registo.totalMinutos
                        )}
                    </div>
                    `;
            }


            let observacao = "";


            if (
                registo.observacao
            ) {

                observacao =
                    `
                    <div class="registo-observacao">

                        <strong>
                            Observação:
                        </strong>

                        <br>

                        ${escaparHtml(
                            registo.observacao
                        )}

                    </div>
                    `;
            }


            card.innerHTML =
                `
                <div class="registo-topo">

                    <div class="registo-data">
                        ${formatarData(
                            registo.data
                        )}
                    </div>

                    <div class="registo-situacao">

                        ${simboloSituacao(
                            registo.situacao
                        )}

                        ${registo.situacao}

                    </div>

                </div>


                <div class="registo-detalhes">

                    ${detalhes}

                </div>


                ${observacao}


                <div class="acoes-registo">

                    <button
                        class="botao-editar"
                        data-editar="${registo.data}"
                    >
                        EDITAR
                    </button>

                    <button
                        class="botao-apagar"
                        data-apagar="${registo.data}"
                    >
                        APAGAR
                    </button>

                </div>
                `;


            listaHistorico.appendChild(
                card
            );
        }
    );


    document
        .querySelectorAll(
            "[data-editar]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarRegisto(
                            botao.dataset.editar
                        );
                    }
                );
            }
        );


    document
        .querySelectorAll(
            "[data-apagar]"
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        apagarRegisto(
                            botao.dataset.apagar
                        );
                    }
                );
            }
        );
}


function abrirHistorico() {

    renderizarHistorico();

    mostrarTela(
        "historico"
    );

    window.scrollTo(
        0,
        0
    );
}


/* =====================================================
   CALENDÁRIO
===================================================== */

function nomeMes(
    ano,
    mes
) {

    const data =
        new Date(
            ano,
            mes,
            1
        );

    return data.toLocaleDateString(
        "pt-PT",
        {
            month: "long",
            year: "numeric"
        }
    );
}


function criarDataIso(
    ano,
    mes,
    dia
) {

    const mesTexto =
        String(
            mes + 1
        ).padStart(
            2,
            "0"
        );

    const diaTexto =
        String(dia).padStart(
            2,
            "0"
        );

    return (
        `${ano}-` +
        `${mesTexto}-` +
        `${diaTexto}`
    );
}


function renderizarCalendario() {

    tituloMes.textContent =
        nomeMes(
            calendarioAno,
            calendarioMes
        );


    gradeCalendario.innerHTML =
        "";


    const primeiroDia =
        new Date(
            calendarioAno,
            calendarioMes,
            1
        );


    let diaSemana =
        primeiroDia.getDay();


    /*
       JavaScript:
       Domingo = 0

       Nosso calendário:
       Segunda = primeira coluna
    */

    diaSemana =
        diaSemana === 0
            ? 6
            : diaSemana - 1;


    const totalDias =
        new Date(
            calendarioAno,
            calendarioMes + 1,
            0
        ).getDate();


    for (
        let i = 0;
        i < diaSemana;
        i++
    ) {

        const vazio =
            document.createElement(
                "div"
            );

        vazio.className =
            "dia-calendario dia-vazio";

        gradeCalendario.appendChild(
            vazio
        );
    }


    const registos =
        carregarRegistos();


    for (
        let dia = 1;
        dia <= totalDias;
        dia++
    ) {

        const dataIso =
            criarDataIso(
                calendarioAno,
                calendarioMes,
                dia
            );


        const registo =
            registos.find(
                item =>
                    item.data ===
                    dataIso
            );


        const celula =
            document.createElement(
                "button"
            );

        celula.type =
            "button";

        celula.className =
            "dia-calendario";


        let marca = "";


        if (registo) {

            marca =
                `
                <div class="marca-dia">

                    ${abreviacaoSituacao(
                        registo.situacao
                    )}

                </div>
                `;
        }


        celula.innerHTML =
            `
            <div class="numero-dia">
                ${dia}
            </div>

            ${marca}
            `;


        celula.addEventListener(
            "click",
            () => {

                if (registo) {

                    editarRegisto(
                        dataIso
                    );

                } else {

                    dataOriginalEdicao =
                        null;

                    dataInput.value =
                        dataIso;

                    situacaoSelect.value =
                        "Presente";

                    observacaoInput.value =
                        "";

                    carregarUltimoHorario();

                    atualizarSituacao();

                    guardarButton.textContent =
                        "GUARDAR REGISTO";

                    cancelarEdicaoButton
                        .classList
                        .add("escondido");

                    mostrarTela(
                        "principal"
                    );

                    window.scrollTo(
                        0,
                        0
                    );
                }
            }
        );


        gradeCalendario.appendChild(
            celula
        );
    }
}


function abrirCalendario() {

    renderizarCalendario();

    mostrarTela(
        "calendario"
    );

    window.scrollTo(
        0,
        0
    );
}


/* =====================================================
   RESUMO MENSAL
===================================================== */

function renderizarResumo() {

    tituloResumoMes.textContent =
        nomeMes(
            resumoAno,
            resumoMes
        );


    const prefixo =
        `${resumoAno}-` +
        `${String(
            resumoMes + 1
        ).padStart(
            2,
            "0"
        )}`;


    const registosMes =
        carregarRegistos()
            .filter(
                registo =>
                    registo.data.startsWith(
                        prefixo
                    )
            );


    let presentes = 0;
    let faltas = 0;
    let faltasJustificadas = 0;
    let ferias = 0;
    let baixa = 0;
    let folgas = 0;
    let totalMinutos = 0;


    registosMes.forEach(
        registo => {

            switch (
                registo.situacao
            ) {

                case "Presente":

                    presentes++;

                    totalMinutos +=
                        Number(
                            registo.totalMinutos
                        ) || 0;

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
        }
    );


    conteudoResumo.innerHTML =
        `
        <div class="resumo-linha">

            <span>
                Dias presentes
            </span>

            <strong>
                ${presentes}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Faltas
            </span>

            <strong>
                ${faltas}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Faltas justificadas
            </span>

            <strong>
                ${faltasJustificadas}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Férias
            </span>

            <strong>
                ${ferias}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Baixa médica
            </span>

            <strong>
                ${baixa}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Folgas
            </span>

            <strong>
                ${folgas}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Horas trabalhadas
            </span>

            <strong>
                ${formatarMinutos(
                    totalMinutos
                )}
            </strong>

        </div>


        <div class="resumo-linha">

            <span>
                Dias registados
            </span>

            <strong>
                ${registosMes.length}
            </strong>

        </div>
        `;
}


function abrirResumo() {

    renderizarResumo();

    mostrarTela(
        "resumo"
    );

    window.scrollTo(
        0,
        0
    );
}


/* =====================================================
   EVENTOS
===================================================== */

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


cancelarEdicaoButton.addEventListener(
    "click",
    finalizarEdicao
);


historicoButton.addEventListener(
    "click",
    abrirHistorico
);


calendarioButton.addEventListener(
    "click",
    abrirCalendario
);


resumoButton.addEventListener(
    "click",
    abrirResumo
);


voltarHistorico.addEventListener(
    "click",
    () => {

        mostrarTela(
            "principal"
        );
    }
);


voltarCalendario.addEventListener(
    "click",
    () => {

        mostrarTela(
            "principal"
        );
    }
);


voltarResumo.addEventListener(
    "click",
    () => {

        mostrarTela(
            "principal"
        );
    }
);


/* =====================================================
   MÊS ANTERIOR / SEGUINTE
===================================================== */

mesAnteriorButton.addEventListener(
    "click",
    () => {

        calendarioMes--;

        if (
            calendarioMes < 0
        ) {

            calendarioMes = 11;
            calendarioAno--;
        }

        renderizarCalendario();
    }
);


mesSeguinteButton.addEventListener(
    "click",
    () => {

        calendarioMes++;

        if (
            calendarioMes > 11
        ) {

            calendarioMes = 0;
            calendarioAno++;
        }

        renderizarCalendario();
    }
);


resumoMesAnterior.addEventListener(
    "click",
    () => {

        resumoMes--;

        if (
            resumoMes < 0
        ) {

            resumoMes = 11;
            resumoAno--;
        }

        renderizarResumo();
    }
);


resumoMesSeguinte.addEventListener(
    "click",
    () => {

        resumoMes++;

        if (
            resumoMes > 11
        ) {

            resumoMes = 0;
            resumoAno++;
        }

        renderizarResumo();
    }
);


/* =====================================================
   INICIAR APP
===================================================== */

definirDataHoje();

carregarUltimoHorario();

atualizarSituacao();

calcularTotal();

mostrarTela(
    "principal"
);