import React, {Component} from 'react';
import {Avatar, Button, Checkbox, List, Spin} from "antd";
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Record satellite selected by the user,
            // which are going to be rendered in the map
            selected: [],
            isLoad: false
        }
    }

    onChange = e => {
        console.log(e.target);
        // Step 1: get dataInfo and checked status
        const { dataInfo, checked } = e.target;
        // Step 2: add/remove clicked satellite from the list
        const { selected } = this.state;
        const list = this.addOrRemove(dataInfo, checked, selected);
        // Step 3: update the selected array
        this.setState( {
            selected: list
        })
    }

    addOrRemove = (sat, status, list) => {
        // Case 1: satellite is selected (checked is true)
        // Case 1.1: satellite is NOT in the list. Add it to the list
        // Case 1.2: satellite is in the list. Do noting
        // Case 2: satellite is NOT selected (checked is false)
        // Case 2.1: satellite is NOT in the list. Do nothing
        // Case 2.2: satellite is in the list. Remove it
        const found = list.some(item => item.satid === sat.satid);
        if (status && !found) {
            // Case 1.1
            list = [...list, sat];
        } else if (!status && found) {
            // Case 2.2
            list = list.filter(item => item.satid !== sat.satid);
        }
        console.log(list);
        return list;
    }

    onShowSatMap = () => {
        this.props.onShowMap(this.state.selected);
    }

    render() {
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const {isLoad} = this.props;
        const {selected} = this.state;

        return (
            <div className="sat-list-box">
                <div className="btn-container">
                    <Button
                        className="sat-list-btn"
                        type="primary"
                        size="large"
                        disabled={ selected.length===0 }
                        onClick={this.onShowSatMap}
                    >
                        Track on the map
                    </Button>
                </div>
                <hr/>
                {isLoad ? (
                    <div className="spin-box">
                        <Spin tip="Loading..." size="large" />
                    </div>
                ) : (
                    <List
                        className="sat-list"
                        itemLayout="horizontal"
                        size="small"
                        dataSource={satList}
                        renderItem={item => (
                            <List.Item
                                actions={ [
                                    <Checkbox dataInfo={item} onChange={this.onChange} />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar size={50} src={satellite} />}
                                    title={<p>{item.satname}</p>}
                                    description={`Launch Date: ${item.launchDate}`}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default SatelliteList;