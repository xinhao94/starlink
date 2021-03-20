import React, {Component} from 'react';
import { Form } from "antd";

class SatSettingForm extends Component {
    const

    render() {
        return (
            <Form>
                <Form.Item label="Longitude(degrees)">
                    {}
                </Form.Item>
            </Form>

        );
    }
}

const SatSetting = Form.create()(SatSettingForm);

export default SatSetting;