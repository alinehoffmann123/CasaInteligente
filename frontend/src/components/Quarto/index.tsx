import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import './style.css';

export default function Quarto() {
    // Conecta ao servidor Socket.io
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean;
        ventiladorOn: boolean;
        ventiladorVelocidade: number;
        cortinasAbertas: boolean;
    }

    // Estado inicial do quarto
    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
          luzOn: false
        , ventiladorOn: false
        , ventiladorVelocidade: 1
        , cortinasAbertas: false
    });

    useEffect(() => {
        // Escuta eventos do servidor para atualizar o estado do quarto
        socket.on('estadoInicialQuarto', (estado: EstadoInicial) => {
            setEstadoInicial(estado);
        });

        socket.on('acenderLuzQuarto', (novoEstado) => {
            // Atualiza o estado da luz
            setEstadoInicial((prevState) => ({
                ...prevState,
                luzOn: novoEstado.luzOn,
            }));
        });

        socket.on('ligarVentiladorQuarto', (novoEstado) => {
            // Atualiza o estado do ventilador e sua velocidade
            setEstadoInicial((prevState) => ({
                ...prevState,
                ventiladorOn: novoEstado.ventiladorOn,
                ventiladorVelocidade: novoEstado.ventiladorVelocidade,
            }));
        });

        socket.on('abrirFecharCortinas', (novoEstado) => {
            // Atualiza o estado das cortinas
            setEstadoInicial((prevState) => ({
                ...prevState,
                cortinasAbertas: novoEstado.cortinasAbertas,
            }));
        });

        // Limpa os listeners ao desmontar o componente
        return () => {
            socket.off('estadoInicialQuarto');
            socket.off('acenderLuzQuarto');
            socket.off('ligarVentiladorQuarto');
            socket.off('abrirFecharCortinas');
        };
    }, []);

    // Função para acender a luz
    const acenderLuz = () => {
        socket.emit('acenderLuzQuarto');
    };

    // Função para ligar o ventilador
    const ligarVentilador = () => {
        const novoEstadoVentilador = !estadoInicial.ventiladorOn;

        if (!novoEstadoVentilador) {
            // Se o ventilador for desligado, redefine a velocidade para 1
            setEstadoInicial((prevState) => ({
                ...prevState,
                ventiladorOn: false,
                ventiladorVelocidade: 1,
            }));
            socket.emit('ajustarVelocidadeVentilador', 1);
        }

        socket.emit('ligarVentiladorQuarto');
    };

    // Função para ajustar a velocidade do ventilador
    const ajustarVelocidadeVentilador = (novaVelocidade: number) => {
        socket.emit('ajustarVelocidadeVentilador', novaVelocidade);
        setEstadoInicial((prevState) => ({
            ...prevState,
            ventiladorVelocidade: novaVelocidade,
        }));
    };

    // Função para abrir ou fechar as cortinas
    const abrirFecharCortinas = () => {
        socket.emit('abrirFecharCortinas');
    };

    return (
        <div className='quarto'>
            <div className='luz'>
                <p>Quarto - Luz</p>
                <button onClick={acenderLuz}>
                    {estadoInicial.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                </button>
                <i className={`fas fa-lightbulb status ${estadoInicial.luzOn ? 'on' : 'off'}`} />
            </div>

            <div className='ventilador'>
                <p>Ventilador</p>
                <button onClick={ligarVentilador}>
                    {estadoInicial.ventiladorOn ? 'Desligar Ventilador' : 'Ligar Ventilador'}
                </button>
                <i className={`fas fa-fan status ${estadoInicial.ventiladorOn ? 'on' : 'off'}`} />
                <label>Velocidade:</label>
                <div className="input-ventilador">
                    <select onChange={(e) => ajustarVelocidadeVentilador(Number(e.target.value))} value={estadoInicial.ventiladorVelocidade} disabled={!estadoInicial.ventiladorOn}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <p>Velocidade atual: {estadoInicial.ventiladorVelocidade}</p>
            </div>

            <div className='cortinas'>
                <p>Cortinas</p>
                <button onClick={abrirFecharCortinas}>
                    {estadoInicial.cortinasAbertas ? 'Fechar Cortinas' : 'Abrir Cortinas'}
                </button>
                {estadoInicial.cortinasAbertas ? (
                    <img className="style-cortina" src="cortina-aberta.png" alt="Cortinas Abertas" style={{ width: '60px', height: 'auto' }} />
                ) : (
                    <img className="style-cortina" src="cortinas-fechada.png" alt="Cortinas Fechadas" style={{ width: '60px', height: 'auto' }} />
                )}
            </div>
        </div>
    );
}
