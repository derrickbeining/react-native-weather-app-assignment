import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import Card from './Card';
import createDateTimeString from '../lib/createDateTimeString';

export default class WeatherInFlorida extends PureComponent {
  constructor() {
    super();
    this.socket = null;
    this.state = {
      connectionStatus: 'Loading',
      lastUpdated: '',
      temp: 0,
      humidity: 0,
    };
  }

  componentDidMount() {
    if (this.props.openSocket) this.openNewSocket();
  }

  componentDidUpdate(prevProps) {
    if (this.shouldOpenNewSocket(prevProps)) return this.openNewSocket();
    if (this.shouldCloseSocket(prevProps)) return this.closeSocket();
  }

  componentWillUnmount() {
    if (this.socket) this.socket.close();
  }

  shouldOpenNewSocket(prevProps) {
    return this.props.openSocket !== prevProps.openSocket &&
           this.props.openSocket === true;
  }

  shouldCloseSocket(prevProps) {
    return this.props.openSocket !== prevProps.openSocket &&
           this.props.openSocket === false;
  }

  openNewSocket() {
    this.setState({ connectionStatus: 'Loading'});
    this.socket = new window.WebSocket(
      'ws://ws.weatherflow.com/swd/data?api_key=20c70eae-e62f-4d3b-b3a4-8586e90f3ac8'
    );
    this.socket.onopen = () => {
      this.socket.send(JSON.stringify({
        type: 'listen_start',
        device_id: 1110,
        id: 2098388936
      }))
    }

    this.socket.onmessage = evt => {
      console.log(evt.data);
      const data = JSON.parse(evt.data);
      switch (data.type) {
        case 'connection_opened': return this.setState({ connectionStatus: 'Connected'});
        case 'obs_air': return this.updateWithNewData(data);
      }
    }

    this.socket.onclose = evt => {
      console.log('closed_reason', evt.reason)
      this.setState({ connectionStatus: 'Disconnected'})

    };
  }

  closeSocket() {
    this.socket.close();
  }

  updateWithNewData(data) {
    const [ , , temp, humidity] = data.obs[0];

    this.setState({
      lastUpdated: createDateTimeString(),
      temp,
      humidity
    })
  }

  getStatusStyle() {
    const idx = ['Connected', 'Loading', 'Disconnected'].indexOf(this.state.connectionStatus);
    return {
      color: ['green', 'orange', 'red'][ idx ]
    }
  }

  render() {
    const { connectionStatus, lastUpdated, temp, humidity } = this.state;
    const { styles } = this.props;
    console.log('CONNECTION STATUS', connectionStatus)

    return (
        <Card title="Weather in Florida" containerStyle={{ flex: 1 }}>
          <Text style={[ styles.paragraph, this.getStatusStyle() ]}>
            Status: { connectionStatus }
          </Text>
          <Text style={styles.paragraph}>
            Last updated: { lastUpdated }
          </Text>
          <Text style={styles.paragraph}>
            Temp: { temp }°C
          </Text>
          <Text style={styles.paragraph}>
            Humidity: { humidity }%
          </Text>
        </Card>
    );
  }
}


