import React, { PureComponent } from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Label, Tooltip, Area } from 'recharts';

export default class SingleAreaChart extends PureComponent {
    customTickFormat(tick, scientific) {
        if (scientific) {
            return tick.toExponential();
        }
        else {
            return tick;
        }
    }

    render() {
        var data = this.props.data;
        var y_label = this.props.y_label;
        var y_scale = this.props.y_scale === "log" ? "log" : "linear";
        return (
            <ResponsiveContainer width="100%" height="50%">
                <AreaChart data={data} margin={{top: 10, right: 10, left: 10, bottom: 10}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="Address" tick={false} label="Addresses"/>
                    <YAxis scale={y_scale} domain={['auto', 'auto']} tickFormatter={tick => {return this.customTickFormat(tick, y_scale === "log")}}>
                        <Label angle={270} position='left' style={{ textAnchor: 'middle' }}>
                            {y_label}
                        </Label>
                    </YAxis>
                    <Tooltip/>
                    <Area type="monotone" dataKey={y_label} stroke="#03254c" fill="#03254c"/>
                </AreaChart>
            </ResponsiveContainer>
        );
    }
}
