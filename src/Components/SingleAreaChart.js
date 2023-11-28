import React, { PureComponent } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Area } from 'recharts';

export default class SingleAreaChart extends PureComponent {
    customTickFormat(tick, scientific, percent) {
        if (scientific) {
            return tick.toExponential();
        }
        else if (percent) {
            return tick + "%";
        }
        else {
            return tick;
        }
    }

    render() {
        var y_scale = this.props.y_scale === "log" ? "log" : "linear";
        return (
            <ResponsiveContainer width="100%" height="50%">
                <AreaChart data={this.props.data} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="Address" tick={false} label="Addresses"/>
                    <YAxis scale={y_scale} domain={['auto', 'auto']} tickFormatter={tick => { return this.customTickFormat(tick, y_scale === "log", this.props.y_percent)}}>
                        <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                            {this.props.y_label}
                        </Label>
                    </YAxis>
                    <Tooltip/>
                    <Area type="monotone" dataKey={this.props.y_label} stroke="#03254c" fill="#03254c"/>
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}
