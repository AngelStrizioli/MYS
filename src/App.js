import "./App.css";
import "../node_modules/react-vis/dist/style.css";
import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineSeries,
  MarkSeries,
  FlexibleXYPlot,
  VerticalBarSeries,
} from "react-vis";
import * as math from "mathjs";
import FunctionsModal from "./FunctionsModal";

export default function App() {
  const [funcion, setFuncion] = useState("x^2");
  const [a, setA] = useState(-10);
  const [b, setB] = useState(10);
  const [n, setN] = useState(100);
  const [graficarMontecarlo, setGraficarMontecarlo]= useState(false);
  const [graficarRectangulo, setGraficarRectangulo]= useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [carga, setCarga] = useState(new Date());

  const funcionMontecarlo = (funcion, a, b, n) => {
    var arrayPuntos = [];
    const parser = math.parser();
    parser.evaluate("f(x)=" + funcion);
    var xRandom = 0;
    var yRandom = 0;
    var yReal = 0;
    var puntosDisparados = 0;
    var puntosPositivos = 0;
    var puntosNegativos = 0;
    var h = (b - a) / n;
    var maximo = math.max(parser.evaluate("f(" + a + ")"), 0);
    var minimo = math.min(parser.evaluate("f(" + a + ")"), 0);
    for (var i = a + h; i <= b; i = i + h) {
      var aux = parser.evaluate("f(" + i + ")");
      if (maximo < aux) {
        maximo = math.max(aux, 0);
      }
      if (aux < minimo) {
        minimo = math.min(aux, 0);
      }
    }

    const maxValue = maximo;
    const minValue = minimo;
    while (puntosDisparados < n) {
      xRandom = math.random(a, b);
      yRandom = math.random(minValue, maxValue);
      yReal = parser.evaluate("f(" + xRandom + ")");
      if (yRandom >= 0) {
        if (yReal >= yRandom) {
          puntosPositivos++;
          arrayPuntos.push({ x: xRandom, y: yRandom, color: "#4eb764", size: 1 });
        } else {
          arrayPuntos.push({ x: xRandom, y: yRandom, color: "#E91E21", size: 1 });
        }
      } else {
        if (yReal > yRandom) {
          arrayPuntos.push({ x: xRandom, y: yRandom, color: "#9900EF", size: 1 });
        } else {
          puntosNegativos++;
          arrayPuntos.push({ x: xRandom, y: yRandom, color: "#eb7734", size: 1 });
        }
      }
      puntosDisparados++;
    }

    const resultado = 
      ((puntosPositivos - puntosNegativos) / puntosDisparados) *
      (b - a) *
      (maxValue - minValue);
    localStorage.setItem("resultadoMontecarlo", Math.abs(resultado.toFixed(4)));
    return [arrayPuntos];
  };
  const graficarFuncion = (funcion, a, b) => {
    var arrayAux = [];
    const h = 0.01;
    const parser = math.parser();
    parser.evaluate("f(x)=" + funcion);
    for (var i = a; i <= b; i = i + h) {
      var aux = parser.evaluate("f(" + i + ")");
      arrayAux.push({ x: i, y: aux });
    }

    return arrayAux;
  };

  const funcionRectangulo = (funcion, a, b, n) => {
    var h = (b - a) / n;
    let arrayAux = []
    var resultado = 0
    const parser = math.parser();
    parser.evaluate("f(x)=" + funcion);
    for (var i = a; i <= b; i = i + h) {
      var aux = parser.evaluate("f(" + i + ")");
      resultado += parser.evaluate("f(" + i + ")");
      if(aux <= 0){
        arrayAux.push({ x: i, y: aux, color: '#E91E21'});
      } else {
        arrayAux.push({ x: i, y: aux, color: '#4eb764'});
      }
      
    }
    localStorage.setItem("resultadoRectangulo", Math.abs((resultado * h).toFixed(4)));
    return arrayAux;
}

  const onClick = () => {
    setFuncion(document.getElementById("tf-funcion").value);
    setA(parseFloat(document.getElementById("tf-a").value));
    setB(parseFloat(document.getElementById("tf-b").value));
    setN(parseFloat(document.getElementById("tf-n").value));
    const getValueMontecarlo = document.querySelector("#cbox1")
    const getValueRectangulo = document.querySelector("#cbox2")
    setGraficarMontecarlo(getValueMontecarlo.checked)
    setGraficarRectangulo(getValueRectangulo.checked)
    console.log('montecarlo: ', graficarMontecarlo)
    console.log('rectangulo: ', graficarRectangulo)
    setCarga(new Date());
  };
  function openModal() {
    setIsOpen(true);
  }
  
  return (
    <div style={{ width: window.innerWidth, height: window.innerHeight, backgroundColor: "#00C8FF" }}>
      <p
        style={{
          fontSize: 25,
          backgroundColor: "#00B2FF",
          padding: 20,
          color: '#fff',
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          margin: 0
        }}
        align="center"
      >
        METODOS DE INTEGRACION NUMERICA: MOTECARLO - RECTANGULOS
      </p>
      <div container style={{ backgroundColor: "#00C8FF", display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
        <div className={classes.paper}
          style={{
            marginBottom: 25,
            backgroundColor: '#00C8FF',
          }}
          item xs={8}>
          <FlexibleXYPlot
            width={800}
            height={480}
            style={{
              backgroundColor: "#FFFFFF",
              position: "center",
              marginTop: 20,
            }}
            dontCheckIfEmpty={true}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            <LineSeries
              style={{
                strokeWidth: "1px",
                color: "black",
              }}
              opacity={0.4}
              lineStyle={{ stroke: "black" }}
              data={graficarFuncion('0', a, b)}
              size={2}
            />
            <LineSeries
              className="linemark-series-example"
              style={{
                strokeWidth: "3px",
                color: "black",
              }}
              lineStyle={{ stroke: "black" }}
              data={graficarFuncion(funcion, a, b)}
              size={2}
            />
            {
              graficarMontecarlo &&
                <MarkSeries
                  className="mark-series-example"
                  sizeRange={[1, 3]}
                  strokeWidth={2}
                  data={funcionMontecarlo(funcion, a, b, n)[0]}
                  colorType="literal"
                />
            }
            {
              graficarRectangulo &&
                <VerticalBarSeries 
                  data={funcionRectangulo(funcion, a, b, n)}
                  colorType="literal"
                />
            }
          </FlexibleXYPlot>
        </div>
        <div>
          <div style={{ backgroundColor: "#fff", borderRadius: 10, height: 450, width: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '5%', marginLeft: '5%' }}>
            <label style={{ fontFamily: 'Montserrat' }}>
              Ingrese la función a graficar 
              <input
                id="tf-funcion"
                style={classes.textField}
                required
                defaultValue="x^2"
              />
            </label>
            <label style={{ fontFamily: 'Montserrat', marginTop: 5 }}>
              Cómo ingresar funciones{'  '}
              <button style={classes.question} onClick={openModal}>i</button> :
              <FunctionsModal setIsOpen={setIsOpen} modalIsOpen={modalIsOpen} />
            </label>
            <br />
            <label style={{ fontFamily: 'Montserrat' }}>
              Ingrese el valor de a:
              <input
                id="tf-a"
                style={classes.textField}
                required
                defaultValue="-10"
              />
            </label>
            <br />
            <label style={{ fontFamily: 'Montserrat' }}>
              Ingrese el valor de b:
              <input
                id="tf-b"
                style={classes.textField}
                required
                defaultValue="10"
              />
            </label>
            <br />
            <label style={{ fontFamily: 'Montserrat' }}>
              Ingrese el valor de N:
              <input
                id="tf-n"
                style={classes.textField}
                required
                defaultValue="100"
              />
            </label>
            <br />
            <label style={{ fontFamily: 'Montserrat' }}>
              <input type="checkbox" id="cbox1" value='graficar_montecarlo' /> Graficar Montecarlo
            </label>
            <label style={{ fontFamily: 'Montserrat' }}>
              <input type="checkbox" id="cbox2" value='graficar_rectangulo' /> Graficar Rectangulos
            </label>
            <br/>
            <button
              style={classes.button}
              onClick={onClick}
            >
              Graficar
            </button>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: 10, height: 110, width: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '5%', marginTop: '5%' }}>
            {localStorage.getItem("resultadoMontecarlo") !== null && graficarMontecarlo && (
              <p className={classes.textFieldResultado} style={{ fontFamily: 'Montserrat' }} align="center">
                El resultado por Montecarlo es: <p style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }} >{localStorage.getItem("resultadoMontecarlo")}</p>
              </p>
            )}
            {localStorage.getItem("resultadoRectangulo") !== null && graficarRectangulo && (
              <p className={classes.textFieldResultado} style={{ fontFamily: 'Montserrat' }} align="center">
                El resultado por Rectangulos es: <p style={{ fontFamily: 'Montserrat', fontWeight: 'bold' }} >{localStorage.getItem("resultadoRectangulo")}</p>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const classes = ({
  textField: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 350,
    borderRadius: 5,
    borderWidth: 0.5,
    height: 20,
    marginTop: 10,
    fontFamily: 'Montserrat'

  },
  textFieldResultado: {
    width: 250,
    marginTop: 50,
    fontSize: 18,
    color: 'red',
  },
  button: {
    marginTop: 10,
    color: "#FFF",
    backgroundColor: "#00B2FF",
    width: 150,
    height: 40,
    borderRadius: 5,
    borderColor: "#00B2FF",
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  question: {
    color: "#FFF",
    backgroundColor: "#00B2FF",
    width: 22,
    height: 22,
    borderRadius: 20,
    borderColor: "#00B2FF",
    fontSize: 12,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  }
});

