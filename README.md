# 🏠 Casa Inteligente - Simulação com Programação Orientada a Eventos

## Descrição do Projeto
Este projeto simula uma **casa inteligente**, onde os dispositivos de diferentes cômodos podem ser controlados remotamente através de uma interface web. A comunicação em tempo real é feita utilizando **WebSocket**, permitindo que múltiplos clientes controlem os dispositivos e vejam as atualizações de estado instantaneamente.

---

## 🎯 Objetivos do Projeto

### Objetivo Geral
Desenvolver uma aplicação que simule o controle remoto de dispositivos conectados em uma casa, utilizando conceitos de **Programação Orientada a Eventos** com **comunicação em tempo real**.

### Objetivos Específicos
- Integrar **Node.js** com **React** para simular eventos em tempo real.
- Aplicar **Socket.io** para a comunicação entre **frontend** e **backend**.
- Sincronizar o estado dos dispositivos entre diferentes clientes em tempo real.

---

## 🏠 Cômodos e Dispositivos

### 1. Sala de Estar
- **Luzes Inteligentes**: Ligar/desligar.  
  **Estado**: Ligado/Desligado.
- **Televisão**: Ligar/desligar e mudar de canal.  
  **Estado**: Ligado/Desligado, Canal.
- **Ar-Condicionado**: Ligar/desligar e ajustar a temperatura.  
  **Estado**: Ligado/Desligado, Temperatura (18°C a 30°C).

### 2. Cozinha
- **Luzes Inteligentes**: Ligar/desligar.  
  **Estado**: Ligado/Desligado.
- **Geladeira Inteligente**: Monitora a temperatura e alerta se estiver acima de 5°C.  
  **Estado**: Temperatura Interna, Alerta.
- **Fogão Elétrico**: Ligar/desligar e ajustar potência.  
  **Estado**: Ligado/Desligado, Potência (1 a 5).

### 3. Quarto
- **Luzes Inteligentes**: Ligar/desligar.  
  **Estado**: Ligado/Desligado.
- **Ventilador Inteligente**: Ligar/desligar e ajustar a velocidade.  
  **Estado**: Ligado/Desligado, Velocidade (1 a 3).
- **Cortinas Automáticas**: Abrir/fechar.  
  **Estado**: Aberto/Fechado.

---

## 🔄 Comportamentos Esperados
- **Luzes Inteligentes**: O estado deve ser sincronizado entre todos os clientes conectados.
- **Ar-Condicionado e Ventilador**: As mudanças de temperatura e velocidade devem ser visíveis em tempo real.
- **Televisão**: Controle de ligar/desligar e mudança de canais com feedback imediato na interface.
- **Geladeira**: Monitora e exibe alertas de temperatura elevada.
- **Fogão Elétrico**: Ajuste de potência com reflexo instantâneo para todos os clientes.
- **Cortinas Automáticas**: Sincronização do estado de aberto/fechado em tempo real.

---

## 🛠️ Passo a Passo: Como Executar o Projeto

### 1. Instalação do Ambiente e Dependências

#### Backend (Node.js)

1. Verifique se o **Node.js** está instalado:
  - node -v

2. Instale o TypeScript globalmente:
  - npm install -g typescript

3. Crie uma pasta chamada smart-home-backend e dentro dela, execute:
  - npm init -y

4. Instale as dependências necessárias:
  - npm install express socket.io cors typescript ts-node-dev @types/node @types/express @types/socket.io

5. Crie o arquivo tsconfig.json com o seguinte conteúdo:
  - {
      "compilerOptions": {
        "target": "ES6",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./src",
        "strict": true,
        "esModuleInterop": true
      }  
    }

6. Crie a pasta src e o arquivo index.ts dentro da pasta backend/src.

#### Frontend (React)

1. Crie uma pasta chamada frontend.

2. Dentro da pasta, crie um novo projeto React com TypeScript:
  - npx create-react-app frontend --template typescript

3. Navegue até a pasta frontend e instale o socket.io-client:
  - npm install socket.io-client

4. Instale as definições de tipo para o socket.io-client:
  - npm install @types/socket.io-client --save-dev

### 2. Configuração do Nodemon no Backend

1. Instale o nodemon no backend:
  - npm install nodemon

2. Crie um arquivo nodemon.json na raiz do projeto com a seguinte configuração:
  - {
      "watch": ["src"],
      "ext": "ts",
      "exec": "ts-node src/index.ts"
    }

### 3. Executando o Projeto

1. Para rodar o servidor, na pasta Backend e o Frontend, execute:
  - npm start


### Agora o frontend e backend estarão funcionando e conectados através do WebSocket.

---

💻 Desenvolvido por: Aline Fernanda Hoffmann