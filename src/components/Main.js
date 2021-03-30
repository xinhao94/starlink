import React, {Component} from 'react';
import { Row, Col } from 'antd'
import axios from 'axios';
import SatSetting from "./SatSetting"
import SatelliteList from "./SatelliteList";
import WorldMap from "./WorldMap";
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            satInfo: null,
            setting: null,
            satList: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = setting => {
        // Fetch satellite setting data
        this.setState({
            isLoading: true,
            setting: setting,
        })
        this.fetchSatellite(setting);
    };

    fetchSatellite = setting => {
        // Get settings
        const { latitude, longitude, elevation, altitude } = setting;
        // Prepare the option for HTTP request
        const url = `api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        // Update loading flag
        this.setState({
            isLoadingList: true
        })

        // Get HTTP response using axios
        axios.get(url)
            .then(response => {
                console.log("HTTP response: ", response.data);
                this.setState( {
                    satInfo: response.data,
                    isLoadingList: false
                });
            })
            .catch( error => {
                console.log("Error in fetching satellite data: ", error);
            });
    };

    showMap = selected => {
        this.setState(preState => ({
            ...preState,
            isLoadingMap: true,
            satList: [...selected]
        }));
    };

    render() {
        const {isLoadingList, satInfo, setting, satList} = this.state;
        return (
            <Row className="main">
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList
                        satInfo={satInfo}
                        isLoad={isLoadingList}
                        onShowMap = {this.showMap} />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap observeData={setting} satData={satList}/>
                </Col>
            </Row>
        );
    }
}

export default Main;