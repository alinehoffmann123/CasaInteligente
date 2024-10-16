import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Sala() {
    const socket = io('http://localhost:4000');

    interface EstadoLuz {
        luzOn: boolean
    }

    const [estadoLuz, setEstadoLuz] = useState<EstadoLuz>({
        luzOn: false
    });

    // Conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('acenderLuzSala', (novoEstado: EstadoLuz) => {
            setEstadoLuz(novoEstado);
        });

        return () => {
            socket.off('acenderLuzSala');
        }
    }, []);

    // Função para alterar o estado do dispositivo
    const acenderLuz = () => {
        socket.emit('acenderLuzSala');
    }

    return (
        <div className='luz'>
            <p>Sala de Estar - Luz</p>
            <button onClick={acenderLuz}>
                {estadoLuz.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
            </button>
            <i className={`fas fa-lightbulb status ${estadoLuz.luzOn ? 'on' : 'off'}`} />
        </div>
    )
}
