import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

// Criar servidor HTTP
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // URL do Front-End React
        methods: ["GET", "POST"],
    }
});

// Estado inicial dos dispositivos
let dispositivosSala = {
    luzOn: false,
    tvOn: false,
    arOn: false,
    arTemp: 22,  // Temperatura padrão
    tvChannel: 0  // Canal padrão
};

let dispositivosCozinha = {
  luzOn: false,
  geladeiraTemperatura: 3,
  geladeiraAlerta: false,
  fogaoOn: false,
  fogaoPotencia: 1        
};

// Função para ajustar a temperatura da geladeira automaticamente
const ajustarTemperaturaGeladeiraAutomaticamente = () => {
  setInterval(() => {
      const temperaturaAtual = dispositivosCozinha.geladeiraTemperatura;

      if (temperaturaAtual > 3) {
          dispositivosCozinha.geladeiraTemperatura -= 1;
      } else if (temperaturaAtual < 2) {
          dispositivosCozinha.geladeiraTemperatura += 1;
      }

      if (dispositivosCozinha.geladeiraTemperatura > 5) {
          dispositivosCozinha.geladeiraAlerta = true;
      } else {
          dispositivosCozinha.geladeiraAlerta = false;
      }

      io.emit('geladeiraTemperatura', dispositivosCozinha.geladeiraTemperatura);
      io.emit('geladeiraAlerta', dispositivosCozinha.geladeiraAlerta);
  }, 5000);
};

let dispositivosQuarto = {
  luzOn: false,
  ventiladorOn: false,
  ventiladorVelocidade: 1,
  cortinasAbertas: false,
};

// Escuta os eventos de conexão do socket
io.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

    // Enviando o estado inicial dos dispositivos para o cliente
    socket.emit('estadoInicialSala', dispositivosSala);
    socket.emit('estadoInicialCozinha', dispositivosCozinha);
    socket.emit('estadoInicialQuarto', dispositivosQuarto);

    // Manipulando os eventos e mudanças do estado dos dispositivos da sala
    socket.on('acenderLuzSala', () => {
        dispositivosSala.luzOn = !dispositivosSala.luzOn;
        io.emit('acenderLuzSala', dispositivosSala);
    });

    socket.on('ligarTvSala', () => {
        dispositivosSala.tvOn = !dispositivosSala.tvOn;
        io.emit('ligarTvSala', dispositivosSala);
    });

    socket.on('ligarArSala', () => {
        dispositivosSala.arOn = !dispositivosSala.arOn;
        io.emit('ligarArSala', dispositivosSala);
    });

    socket.on('mudarCanalTv', (novoCanal) => {
        dispositivosSala.tvChannel = novoCanal;
        io.emit('ligarTvSala', dispositivosSala);
    });

    socket.on('ajustarTemperatura', (novaTemp) => {
        dispositivosSala.arTemp = novaTemp;
        io.emit('ligarArSala', dispositivosSala);
    });

    // Cozinha
    socket.on('acenderLuzCozinha', () => {
        dispositivosCozinha.luzOn = !dispositivosCozinha.luzOn;
        io.emit('acenderLuzCozinha', dispositivosCozinha);
    });

    socket.on('ajustarTemperaturaGeladeira', (novaTemperatura) => {
      dispositivosCozinha.geladeiraTemperatura = novaTemperatura;
      io.emit('geladeiraTemperatura', dispositivosCozinha.geladeiraTemperatura);

      if (novaTemperatura > 5) {
          dispositivosCozinha.geladeiraAlerta = true;
      } else {
          dispositivosCozinha.geladeiraAlerta = false;
      }
      io.emit('geladeiraAlerta', dispositivosCozinha.geladeiraAlerta);
    });
  
    socket.on('ligarFogaoCozinha', () => {
      dispositivosCozinha.fogaoOn = !dispositivosCozinha.fogaoOn; // Alterna o estado do fogão
      io.emit('ligarFogaoCozinha', dispositivosCozinha); // Emite o novo estado do fogão
    });

    // Atualiza a potência do fogão
    socket.on('ajustarPotenciaFogao', (novaPotencia) => {
        dispositivosCozinha.fogaoPotencia = novaPotencia;
        io.emit('atualizarPotenciaFogao', novaPotencia); // Emite a nova potência
    });

    // Manipulando os eventos e mudanças do estado dos dispositivos do quarto
    socket.on('acenderLuzQuarto', () => {
      dispositivosQuarto.luzOn = !dispositivosQuarto.luzOn;
      io.emit('acenderLuzQuarto', dispositivosQuarto);
    });

    socket.on('ligarVentiladorQuarto', () => {
        dispositivosQuarto.ventiladorOn = !dispositivosQuarto.ventiladorOn;
        io.emit('ligarVentiladorQuarto', dispositivosQuarto);
    });

    socket.on('ajustarVelocidadeVentilador', (novaVelocidade) => {
        dispositivosQuarto.ventiladorVelocidade = novaVelocidade;
        io.emit('ligarVentiladorQuarto', dispositivosQuarto);
    });

    socket.on('abrirFecharCortinas', () => {
        dispositivosQuarto.cortinasAbertas = !dispositivosQuarto.cortinasAbertas;
        io.emit('abrirFecharCortinas', dispositivosQuarto);
    });
});
ajustarTemperaturaGeladeiraAutomaticamente();
// Iniciar Servidor
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
