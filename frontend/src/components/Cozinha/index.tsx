import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import './style.css';

// Função principal do componente 'Cozinha', responsável por gerenciar o estado dos dispositivos na cozinha.
export default function Cozinha() {
    const socket = io('http://localhost:4000');

    // Interface que define o estado inicial da cozinha, incluindo luz, fogão, temperatura e alertas da geladeira.
    interface EstadoInicial {
        luzOn: boolean;
        fogaoOn: boolean;
        geladeiraTemperatura: number;
        geladeiraAlerta: boolean;
        fogaoPotencia: number;
    }

    // Hook de estado para armazenar os dados do estado inicial da cozinha.
    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
          luzOn: false 
        , fogaoOn: false
        , geladeiraTemperatura: 3 
        , geladeiraAlerta: false  
        , fogaoPotencia: 1  
    });

    // Hook de estado separado para controlar o estado da luz.
    const [estadoLuz, setEstadoLuz] = useState<{ luzOn: boolean }>({ luzOn: false });

    // useEffect para escutar eventos do WebSocket e atualizar os estados conforme as mensagens recebidas.
    useEffect(() => {
        // Escuta o evento 'estadoInicialCozinha' e atualiza os estados quando a cozinha é inicializada.
        socket.on('estadoInicialCozinha', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
            setEstadoLuz({ luzOn: estadoInicial.luzOn });
        });

        // Atualiza o estado da luz quando o evento 'acenderLuzCozinha' é recebido.
        socket.on('acenderLuzCozinha', (novoEstado) => {
            setEstadoLuz(novoEstado);
        });

        // Atualiza o estado do fogão quando o evento 'ligarFogaoCozinha' é recebido.
        socket.on('ligarFogaoCozinha', (novoEstado) => {
            setEstadoInicial(prevState => ({ ...prevState, fogaoOn: novoEstado.fogaoOn }));
        });

        // Atualiza a temperatura da geladeira quando o evento correspondente é recebido.
        socket.on('geladeiraTemperatura', (temperatura) => {
            setEstadoInicial(prevState => ({ ...prevState, geladeiraTemperatura: temperatura }));
        });

        // Atualiza o alerta da geladeira quando o evento 'geladeiraAlerta' é recebido.
        socket.on('geladeiraAlerta', (alerta) => {
            setEstadoInicial(prevState => ({ ...prevState, geladeiraAlerta: alerta }));
        });

        // Atualiza a potência do fogão quando o evento correspondente é recebido.
        socket.on('atualizarPotenciaFogao', (potencia) => {
            setEstadoInicial(prevState => ({ ...prevState, fogaoPotencia: potencia }));
        });

        // Limpa os event listeners quando o componente é desmontado para evitar memory leaks.
        return () => {
            socket.off('estadoInicialCozinha');
            socket.off('acenderLuzCozinha');
            socket.off('ligarFogaoCozinha');
            socket.off('geladeiraTemperatura');
            socket.off('geladeiraAlerta');
            socket.off('atualizarPotenciaFogao');
        }
    }, []);

    // Funções com useCallback para emitir eventos para o servidor ao interagir com a interface.
    const acenderLuz = useCallback(() => {
        socket.emit('acenderLuzCozinha');
    }, []);

    const ligarFogao = useCallback(() => {
        socket.emit('ligarFogaoCozinha');
    }, []);

    // Ajusta a temperatura da geladeira emitindo um evento para o servidor.
    const ajustarTemperaturaGeladeira = useCallback((novaTemperatura: number) => {
        socket.emit('ajustarTemperaturaGeladeira', novaTemperatura);
    }, []);

    // Ajusta a potência do fogão dentro do limite de 1 a 5, e emite o evento para o servidor.
    const ajustarPotenciaFogao = useCallback((novaPotencia: number) => {
        if (novaPotencia < 1 || novaPotencia > 5) return;  // Verifica se a nova potência está dentro do intervalo permitido.
        socket.emit('ajustarPotenciaFogao', novaPotencia);
    }, []);

    return (
        <div className='cozinha'>
            {/* Seção para controlar a luz da cozinha */}
            <div className='luz'>
                <p>Cozinha - Luz</p>
                <button onClick={acenderLuz}>
                    {estadoLuz.luzOn ? 'Desligar Luz' : 'Ligar Luz'} 
                </button>
                <i className={`fas fa-lightbulb status ${estadoLuz.luzOn ? 'on' : 'off'}`} />
            </div>

            {/* Seção para controlar o fogão */}
            <div className='fogao'>
                <p>Fogão</p>
                <button onClick={ligarFogao}>
                    {estadoInicial.fogaoOn ? 'Desligar Fogão' : 'Ligar Fogão'}  
                </button>
                <i className={`fas fa-fire status ${estadoInicial.fogaoOn ? 'on' : 'off'}`} />  
                <div>
                    <p>Potência do Fogão: {estadoInicial.fogaoPotencia}</p>
                    <div className="input-potencia">
                        <input type="number" min="1" max="5" value={estadoInicial.fogaoPotencia} onChange={(e) => ajustarPotenciaFogao(Number(e.target.value))} disabled={!estadoInicial.fogaoOn}/>
                    </div>
                </div>
            </div>

            {/* Seção para monitorar a geladeira */}
            <div className='geladeira'>
                <p>Geladeira</p>
                <p>Temperatura: {estadoInicial.geladeiraTemperatura}°C</p>
                {estadoInicial.geladeiraAlerta && <p style={{ color: 'red' }}>Alerta: Temperatura Alta!</p>}
                <i className={`fas fa-refrigerator status ${estadoInicial.geladeiraAlerta ? 'alerta' : ''}`} />
            </div>
        </div>
    );
}
