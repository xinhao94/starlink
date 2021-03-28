import React, { Component } from 'react';
import axios from "axios";
import { WORLD_MAP_URL } from "../constants";
import { feature } from "topojson-client"
import { geoKavrayskiy7 } from "d3-geo-projection";
import { select as d3Select } from "d3-selection";
import { geoGraticule, geoPath } from "d3-geo";

const width = 960;
const height = 600;

class WorldMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            map: null
        }
        this.refMap = React.createRef();
    }

    componentDidMount() {
        axios.get(WORLD_MAP_URL)
            .then( res => {
                // console.log(res);
                // Get raw data from http response
                const { data } = res;
                // Draw the map
                const land = feature(data, data.objects.countries).features;
                this.generateMap(land);
            })
            .catch( err => {
                console.log("Error in fetching world map data: ", err);
            })
    }

    generateMap = land => {
        // Create map projection to receive geo data
        const projection = geoKavrayskiy7()
            .scale(170)
            .translate([width/2, height/2])
            .precision(.1);

        // Get latitude and longitude lines
        const graticule = geoGraticule();

        // Get canvas
        const canvas = d3Select(this.refMap.current)
            .attr("width", width)
            .attr("height", height);

        let context = canvas.node().getContext("2d");

        let path = geoPath().projection(projection).context(context);

        // data <=> map
        land.forEach( ele => {
            context.fillStyle = "#B3DDEF";
            context.strokeStyle = "#000";
            context.globalAlpha = 0.7;
            context.beginPath();
            path(ele);
            context.fill();
            context.stroke();

            context.strokeStyle = "rgba(220, 220, 220, 0.1)";
            context.beginPath();
            path(graticule());
            context.lineWidth = 0.1;
            context.stroke();

            context.beginPath();
            context.lineWidth = 0.5;
            path(graticule.outline());
            context.stroke();
        })
    }

    render() {
        return (
            <div className="map-box">
                <canvas className="map" ref={this.refMap} />
            </div>
        );
    }
}

export default WorldMap;