import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import './style.css';

export default function Quarto() {
    const socket = io('http://localhost:4000');

    interface EstadoInicial {
        luzOn: boolean,
        ventiladorOn: boolean,
        ventiladorVelocidade: number,
        cortinasAbertas: boolean
    }

    const [estadoInicial, setEstadoInicial] = useState<EstadoInicial>({
        luzOn: false,
        ventiladorOn: false,
        ventiladorVelocidade: 1,
        cortinasAbertas: false
    });

    // Conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('estadoInicialQuarto', (estado: EstadoInicial) => {
            setEstadoInicial(estado);
        });

        socket.on('acenderLuzQuarto', (novoEstado) => {
            setEstadoInicial((prevState) => ({
                ...prevState,
                luzOn: novoEstado.luzOn,
            }));
        });

        socket.on('ligarVentiladorQuarto', (novoEstado) => {
            setEstadoInicial((prevState) => ({
                ...prevState,
                ventiladorOn: novoEstado.ventiladorOn,
                ventiladorVelocidade: novoEstado.ventiladorVelocidade,
            }));
        });

        socket.on('abrirFecharCortinas', (novoEstado) => {
            setEstadoInicial((prevState) => ({
                ...prevState,
                cortinasAbertas: novoEstado.cortinasAbertas,
            }));
        });

        return () => {
            socket.off('estadoInicialQuarto');
            socket.off('acenderLuzQuarto');
            socket.off('ligarVentiladorQuarto');
            socket.off('abrirFecharCortinas');
        };
    }, []);

    const acenderLuz = () => {
        socket.emit('acenderLuzQuarto');
    }

    const ligarVentilador = () => {
        socket.emit('ligarVentiladorQuarto');
    }

    const ajustarVelocidadeVentilador = (novaVelocidade: number) => {
        socket.emit('ajustarVelocidadeVentilador', novaVelocidade);
        setEstadoInicial((prevState) => ({
            ...prevState,
            ventiladorVelocidade: novaVelocidade
        }));
    }

    const abrirFecharCortinas = () => {
        socket.emit('abrirFecharCortinas');
    }

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
                <div>
                    <label>Velocidade:</label>
                    <select onChange={(e) => ajustarVelocidadeVentilador(Number(e.target.value))} value={estadoInicial.ventiladorVelocidade}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <p>Velocidade atual: {estadoInicial.ventiladorVelocidade}</p> {/* Exibe a velocidade atual */}
            </div>

            <div className='cortinas'>
              <p>Cortinas</p>
              <button onClick={abrirFecharCortinas}>
                  {estadoInicial.cortinasAbertas ? 'Fechar Cortinas' : 'Abrir Cortinas'}
              </button>
              {estadoInicial.cortinasAbertas ? (
                  <img src="cortina-aberta.png" alt="Cortinas Abertas" style={{ width: '50px', height: 'auto' }} />
              ) : (
                  <img src="cortinas-fechada.png" alt="Cortinas Fechadas" style={{ width: '50px', height: 'auto' }} />
              )}
          </div>
        </div>
    )
}
