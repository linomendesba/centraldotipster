const minutos = {
  EXPRESS: [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
    40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
    59,
  ],
  COPA: [
    1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
  ],
  EURO: [
    2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44, 47, 50, 53, 56, 59,
  ],
  PREMIER: [
    0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57,
  ],
  SUPER: [
    1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52, 55, 58,
  ],
};

let minutosSelecionados = [];
let mercadoSelecionado = "";
let moedasSelecionadas = [];
let textoPersonalizado = "";

function updateMinutos() {
  const liga = document.querySelector('input[name="liga"]:checked')?.value;
  const minutosDiv = document.getElementById("minutos");
  minutosDiv.innerHTML = "";
  minutosSelecionados = [];
  if (liga) {
    minutos[liga].forEach((minuto) => {
      minutosDiv.innerHTML += `<label><input type="checkbox" name="minuto" value="${minuto}" onclick="toggleMinuto(${minuto})"> ${minuto}</label>`;
    });
  }
}

function toggleMinuto(minuto) {
  const index = minutosSelecionados.indexOf(minuto.toString());
  if (index === -1) {
    minutosSelecionados.push(minuto.toString());
  } else {
    minutosSelecionados.splice(index, 1);
  }
  gerarTexto();
}

document.querySelectorAll('input[name="mercado"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    mercadoSelecionado = radio.value;
    gerarTexto();
  });
});

document.querySelectorAll('input[name="moeda"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const index = moedasSelecionadas.indexOf(checkbox.value);
    if (checkbox.checked && index === -1) {
      moedasSelecionadas.push(checkbox.value);
    } else if (!checkbox.checked && index !== -1) {
      moedasSelecionadas.splice(index, 1);
    }
    gerarTexto();
  });
});

function formatarMoedas() {
  let linhas = [];
  for (let i = 0; i < moedasSelecionadas.length; i += 2) {
    const moeda1 = moedasSelecionadas[i];
    const isChecked1 = document.querySelector(
      `#moedas input[value="${moeda1}"]`
    ).checked;
    const moedaFormatada1 = isChecked1 ? `${moeda1}✅` : moeda1;

    const moeda2 = moedasSelecionadas[i + 1];
    const isChecked2 = moeda2
      ? document.querySelector(`#moedas input[value="${moeda2}"]`).checked
      : false;
    const moedaFormatada2 = isChecked2 ? `${moeda2}✅` : moeda2;

    // Adicionar a linha formatada
    if (moeda2) {
      linhas.push(`${moedaFormatada1} / ${moedaFormatada2}`);
    } else {
      linhas.push(moedaFormatada1); // Se não houver segunda moeda, apenas adicionar a primeira
    }
  }
  return linhas.join("\n");
}

async function copiarTexto() {
  const output = document.getElementById("output");
  try {
    await navigator.clipboard.writeText(output.innerText);
  } catch (err) {
    console.error("Falha ao copiar o texto.", err);
  }
}

function limpar() {
  document
    .querySelectorAll('input[name="liga"]')
    .forEach((radio) => (radio.checked = false));
  document
    .querySelectorAll('input[name="minuto"]')
    .forEach((checkbox) => (checkbox.checked = false));
  document
    .querySelectorAll('input[name="mercado"]')
    .forEach((radio) => (radio.checked = false));
  document
    .querySelectorAll('input[name="moeda"]')
    .forEach((checkbox) => (checkbox.checked = false));
  document
    .querySelectorAll('#moedas input[type="checkbox"]')
    .forEach((checkbox) => (checkbox.checked = false));

  document.getElementById("minutos").innerHTML = "";
  document.getElementById("output").innerText = "";
  document.getElementById("minuto-green").value = "";
  document.getElementById("texto-personalizado").value = "";

  // Limpar a seleção da hora
  document
    .querySelectorAll('input[name="hora"]')
    .forEach((radio) => (radio.checked = false));

  // Limpar o campo de "Greens Seguidos"
  document.getElementById("quantidade-greens").value = 0;

  minutosSelecionados = [];
  mercadoSelecionado = "";
  moedasSelecionadas = [];
  textoPersonalizado = "";
}

function adicionarGreen() {
  const minutoGreen = document.getElementById("minuto-green").value;
  const horaSelecionada = document.querySelector(
    'input[name="hora"]:checked'
  )?.value;
  const quantidadeGreens = document
    .getElementById("quantidade-greens")
    .value.trim();

  if (minutoGreen && minutosSelecionados.length > 0) {
    const minutoGreenFormatado = `✅${minutoGreen}`;
    const minutosFormatados = minutosSelecionados.map((minuto) =>
      minuto === minutoGreen ? minutoGreenFormatado : minuto
    );

    let texto = `🏆${
      document.querySelector('input[name="liga"]:checked')?.value
    }`;
    if (horaSelecionada) {
      texto += `  ⏰${horaSelecionada}`;
    }

    texto += `\n➡️${minutosFormatados.join(
      " - "
    )}\n✍🏻 ${mercadoSelecionado}\n\n`;

    // Adiciona as moedas apenas se houver seleção de moedas
    const moedasFormatadas = formatarMoedas();
    if (moedasFormatadas) {
      texto += `💰Moedas:\n${moedasFormatadas}\n\n`;
    }

    texto += `${textoPersonalizado}`;
    texto += `\n\nGREEN 💰💰💰😎😜🤑\n${"✅".repeat(9)}\n${"✅".repeat(9)}`;

    // Verifica se um número válido foi digitado no campo 'quantidade-greens' e é maior que 0
    if (quantidadeGreens && !isNaN(quantidadeGreens) && quantidadeGreens > 0) {
      texto += `\n\n${quantidadeGreens} Greens Seguidos! 🚀`;
    }

    document.getElementById("output").innerText = texto;
  }
}

function adicionarRed() {
  // Captura o nome da liga
  const liga = document.querySelector('input[name="liga"]:checked')?.value;

  if (liga) {
    // Substitui todo o conteúdo anterior pelo "✖️" e o nome da liga
    let texto = `✖️${liga}`;
    document.getElementById("output").innerText = texto;
  }
}

function salvarTexto() {
  const texto1 = document.getElementById("texto-personalizado").value;
  localStorage.setItem("textoPersonalizado", texto1);
}

function carregarTexto() {
  const texto1 = localStorage.getItem("textoPersonalizado");
  if (texto1) {
    document.getElementById("texto-personalizado").value = texto1;
    gerarTexto();
  }
}

document.querySelectorAll('input[name="liga"]').forEach((radio) => {
  radio.addEventListener("change", updateMinutos);
});

updateMinutos();

const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("active"); // Adiciona ou remove a classe 'active'
});

const horas = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

let horasSelecionadas = [];

function updateHoras() {
  const horasDiv = document.getElementById("horas");
  horasDiv.innerHTML = "";
  horas.forEach((hora) => {
    horasDiv.innerHTML += `<label><input type="checkbox" name="hora" value="${hora}" onclick="toggleHora('${hora}')"> ${hora}</label>`;
  });
}

function toggleHora(hora) {
  const index = horasSelecionadas.indexOf(hora);
  if (index === -1) {
    horasSelecionadas.push(hora);
  } else {
    horasSelecionadas.splice(index, 1);
  }
  gerarTexto();
}

function gerarTexto() {
  const liga = document.querySelector('input[name="liga"]:checked')?.value;
  const horaSelecionada = document.querySelector(
    'input[name="hora"]:checked'
  )?.value;
  textoPersonalizado = document.getElementById("texto-personalizado").value;

  if (liga && minutosSelecionados.length > 0 && mercadoSelecionado) {
    // Adiciona a hora apenas se ela estiver selecionada
    let texto = `🏆${liga}`;
    if (horaSelecionada) {
      texto += `  ⏰${horaSelecionada}`;
    }

    texto += `\n➡️${minutosSelecionados.join(
      " - "
    )}\n✍🏻 ${mercadoSelecionado}\n\n`;

    // Adiciona as moedas apenas se houver seleção de moedas
    const moedasFormatadas = formatarMoedas();
    if (moedasFormatadas) {
      texto += `💰Moedas\n${moedasFormatadas}\n\n`;
    }

    texto += `${textoPersonalizado}`;

    document.getElementById("output").innerText = texto;
  } else {
    document.getElementById("output").innerText =
      "Por favor, selecione uma liga, os minutos, um mercado e as moedas.";
  }
}

window.onload = () => {
  updateHoras();
};
