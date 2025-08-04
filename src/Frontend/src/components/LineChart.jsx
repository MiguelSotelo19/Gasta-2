import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
//var CanvasJSReact = require('@canvasjs/react-charts');
 
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class LineChart extends Component {
    render() {
        const options = {
            theme: "light2",
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Pagos realizados por usuario"
            },
            axisX: {
                valueFormatString: "MMM",
                interval: 1,
                intervalType: "month"
            },
            axisY: {
                title: "Cantidad aportada",
                prefix: "$ "
            },
            toolTip: {
                shared: true
            },
            legend: {
                dockInsidePlotArea: true,
                horizontalAlign: "middle"
            },
            data: this.props.LineData
        };
        return (
            <div>
                <CanvasJSChart options={options} />
            </div >
        );
    }
}
export default LineChart; 