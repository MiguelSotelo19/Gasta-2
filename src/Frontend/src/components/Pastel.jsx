import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Pastel extends Component {	
	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1", // "light1", "dark1", "dark2"
			title:{
				text: "Trip Expenses"
			},
			data: [{
				type: "pie",
				indexLabel: "{label}: {y}%",		
				startAngle: -90,
				dataPoints: this.props.datosCategorias
			}]
		}

		return (
		<div>
			<CanvasJSChart options = {options} 
			/>
		</div>
		);
	}
}

export default Pastel;                              