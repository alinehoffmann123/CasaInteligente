import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import './style.css';
import Luz from "./Luz";

export default function Sala() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
          luzOn: boolean
        , tvOn: boolean
        , arTemp: number
        , arOn: boolean
        , tvChannel: number // novo estado para canal da TV
    }

    interface EstadoTv {
          tvOn: boolean
        , tvChannel: number  // incluir canal no estado da TV
    }

    interface EstadoAr {
         arOn: boolean
        , arTemp: number  // incluir temperatura no estado do ar
    }

    const canais = ['Netflix', 'HBO', 'Discovery', 'ESPN'];  // lista de canais

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
          luzOn: false
        , tvOn: false
        , arTemp: 22
        , arOn: false
        , tvChannel: 0
    });

    const [estadoTv, setEstadoTv] = useState<EstadoTv>({
          tvOn: false
        , tvChannel: 0
    });

    const [estadoAr, setEstadoAr] = useState<EstadoAr>({
          arOn: false
        , arTemp: 22
    });

    // conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('estadoInicialSala', (estadoInicial: EstadoInicial) => {
            setEstadoInicial(estadoInicial);
        });
        socket.on('ligarTvSala', (novoEstado: EstadoTv) => {
            setEstadoTv(novoEstado);
        });
        socket.on('ligarArSala', (novoEstado: EstadoAr) => {
            setEstadoAr(novoEstado);
        });

        return () => {
            socket.off('estadoInicialSala');
            socket.off('ligarTvSala');
            socket.off('ligarArSala');
        }
    }, []);

    const ligarTv = () => {
        socket.emit('ligarTvSala');
    }

    const mudarCanal = () => {
        let proximoCanal = (estadoTv.tvChannel + 1) % canais.length;
        socket.emit('mudarCanalTv', proximoCanal);
    }

    const ligarAr = () => {
        socket.emit('ligarArSala');
    }

    
    const ajustarTemperatura = (event: React.ChangeEvent<HTMLInputElement>) => {
        const novaTemp = parseInt(event.target.value);
        setEstadoAr({ ...estadoAr, arTemp: novaTemp });
        // Envia nova temperatura para o backend se necessário
    };

    return (
        <div className='sala'>
            <Luz />
            <div className='tv'>
                <p>TV</p>
                <button onClick={ligarTv}>
                    {estadoTv.tvOn ? 'Desligar TV' : 'Ligar TV'}
                </button>
                {estadoTv.tvOn && (
                    <>
                        <p>Canal Atual: {canais[estadoTv.tvChannel]}</p>
                        <button onClick={mudarCanal}>Mudar Canal</button>
                    </>
                )}
                <i className={`fas fa-tv status ${estadoTv.tvOn ? 'on' : 'off'}`} />
            </div>
            <div className='ar'>
                <p>Ar Condicionado</p>
                <button onClick={ligarAr}>
                    {estadoAr.arOn ? 'Desligar Ar' : 'Ligar Ar'}
                </button>
                <i className={`fas fa-wind status ${estadoAr.arOn ? 'on' : 'off'}`} />
                <label>Temperatura: {estadoAr.arTemp}°C</label>
                <div className="ar-condicionado-temp">
                  <input type="number" min="18"  max="30" value={estadoAr.arTemp} onChange={ajustarTemperatura} disabled={!estadoAr.arOn}/>
                </div>
            </div>

        </div>
    );
}
