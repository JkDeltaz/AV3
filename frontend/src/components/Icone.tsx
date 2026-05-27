import '../App.css'


function Icone({icone}: {icone: "Codigo" | "Militar" | "Comercial" | "Modelo" | "Capacidade" | "Alcance" | "Hidraulico" | "Aerodinamico" | "Eletrico"}) {
    const imgSource = `/${icone}.png`;
    return (
          <img src={imgSource} alt={icone} 
          className=''
          />
    )
}

export default Icone