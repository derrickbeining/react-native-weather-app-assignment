import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import Card from './Card';
import createDateTimeString from '../lib/createDateTimeString';

export default class WeatherInFlorida extends PureComponent {
  constructor() {
    super();
    this.socket = null;
    this.state = {
      status: 'Loading',
      lastUpdated: '',
      temp: 0,
      humidity: 0,
    };
  }

  render() {
    const { status, lastUpdated, temp, humidity } = this.state;
    const { styles } = this.props;
    console.log('WEBSOCKET STATUS', status)

    return (
        <Card title="Weather in Florida" containerStyle={styles.section}>
          <Text style={[ styles.paragraph, this.getStatusStyle() ]}>
            Status: { status }
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

  componentDidMount() {
    if (this.props.openSocket) this.openNewSocket();
  }

  componentDidUpdate(prevProps) {
    if (this.shouldOpenNewSocket(prevProps)) return this.openNewSocket();
    if (this.shouldCloseSocket(prevProps)) return this.socket.close();
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
    this.setState({ status: 'Loading'});
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

    this.socket.onmessage = ({ data }) => {
      const { type, obs } = JSON.parse(data);
      const [ , , temp, humidity] = obs ? obs[0] : [];
      console.log('SOCKET MESSAGE: ', { type, obs });

      switch (type) {
        case 'connection_opened': return this.setState({ status: 'Connected'});
        case 'obs_air': return this.updateState({ temp, humidity });
      }
    }

    this.socket.onclose = evt => {
      console.log('SOCKET CLOSED - REASON:', evt.reason)
      this.setState({ status: 'Disconnected'})

    };
  }

  updateState({ temp, humidity }) {
    this.setState({
      lastUpdated: createDateTimeString(),
      temp,
      humidity
    })
  }

  getStatusStyle() {
    const idx = ['Connected', 'Loading', 'Disconnected'].indexOf(this.state.status);
    return {
      color: ['green', 'orange', 'red'][ idx ]
    }
  }
}


