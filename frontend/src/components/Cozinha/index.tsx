import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import './style.css';

export default function Cozinha() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean;
        fogaoOn: boolean;
        geladeiraTemperatura: number;
        geladeiraAlerta: boolean;
        fogaoPotencia: number;
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        fogaoOn: false,
        geladeiraTemperatura: 3,
        geladeiraAlerta: false,
        fogaoPotencia: 1,
    });

    const [estadoLuz, setEstadoLuz] = useState<{ luzOn: boolean }>({ luzOn: false });

    useEffect(() => {
        socket.on('estadoInicialCozinha', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
            setEstadoLuz({ luzOn: estadoInicial.luzOn });
        });

        socket.on('acenderLuzCozinha', (novoEstado) => {
            setEstadoLuz(novoEstado);
        });

        socket.on('ligarFogaoCozinha', (novoEstado) => {
            setEstadoInicial(prevState => ({ ...prevState, fogaoOn: novoEstado.fogaoOn }));
        });

        socket.on('geladeiraTemperatura', (temperatura) => {
            setEstadoInicial(prevState => ({ ...prevState, geladeiraTemperatura: temperatura }));
        });

        socket.on('geladeiraAlerta', (alerta) => {
            setEstadoInicial(prevState => ({ ...prevState, geladeiraAlerta: alerta }));
        });

        socket.on('atualizarPotenciaFogao', (potencia) => {
            setEstadoInicial(prevState => ({ ...prevState, fogaoPotencia: potencia }));
        });

        return () => {
            socket.off('estadoInicialCozinha');
            socket.off('acenderLuzCozinha');
            socket.off('ligarFogaoCozinha');
            socket.off('geladeiraTemperatura');
            socket.off('geladeiraAlerta');
            socket.off('atualizarPotenciaFogao');
        }
    }, []);

    const acenderLuz = useCallback(() => {
        socket.emit('acenderLuzCozinha');
    }, []);

    const ligarFogao = useCallback(() => {
        socket.emit('ligarFogaoCozinha');
    }, []);

    const ajustarTemperaturaGeladeira = useCallback((novaTemperatura: number) => {
        socket.emit('ajustarTemperaturaGeladeira', novaTemperatura);
    }, []);

    const ajustarPotenciaFogao = useCallback((novaPotencia: number) => {
        if (novaPotencia < 1 || novaPotencia > 5) return;
        socket.emit('ajustarPotenciaFogao', novaPotencia);
    }, []);

    return (
        <div className='cozinha'>
            <div className='luz'>
                <p>Cozinha - Luz</p>
                <button onClick={acenderLuz}>
                    {estadoLuz.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                </button>
                <i className={`fas fa-lightbulb status ${estadoLuz.luzOn ? 'on' : 'off'}`} />
            </div>

            <div className='fogao'>
                <p>Cozinha - Fogão</p>
                <button onClick={ligarFogao}>
                    {estadoInicial.fogaoOn ? 'Desligar Fogão' : 'Ligar Fogão'}
                </button>
                <i className={`fas fa-fire status ${estadoInicial.fogaoOn ? 'on' : 'off'}`} />
                <div>
                    <p>Potência do Fogão: {estadoInicial.fogaoPotencia} (1-5)</p>
                    <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        value={estadoInicial.fogaoPotencia} 
                        onChange={(e) => ajustarPotenciaFogao(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className='geladeira'>
                <p>Cozinha - Geladeira</p>
                <p>Temperatura: {estadoInicial.geladeiraTemperatura}°C</p>
                {estadoInicial.geladeiraAlerta && <p style={{ color: 'red' }}>Alerta: Temperatura Alta!</p>}
                <button onClick={() => ajustarTemperaturaGeladeira(estadoInicial.geladeiraTemperatura + 1)}>Aumentar Temperatura</button>
                <button onClick={() => ajustarTemperaturaGeladeira(estadoInicial.geladeiraTemperatura - 1)}>Diminuir Temperatura</button>
                <i className={`fas fa-refrigerator status ${estadoInicial.geladeiraAlerta ? 'alerta' : ''}`} />
            </div>
        </div>
    );
}
