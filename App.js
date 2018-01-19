import React, { Component } from 'react';
import { AppState, View, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements'; // 0.19.0
import WeatherInFlorida from './components/WeatherInFlorida';
import WeatherAtLocation from './components/WeatherAtLocation';

import "@expo/vector-icons"; // 6.2.2

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      activityStatus: AppState.currentState
    };
    console.log('APP STATE', AppState.currentState);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.updateActivityStatus);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.updateActivityStatus);
  }

  updateActivityStatus = activityStatus => {
    console.log('APP STATE', activityStatus);
    this.setState({ activityStatus })
  }

  isAppActive() {
    return this.state.activityStatus !== null &&
           this.state.activityStatus !== 'background';
  }

  render() {

    return (
      <View style={styles.container}>

        <Header
          centerComponent={{ text: 'Drakontas Weather App', style: styles.header }}
          statusBarProps={{ barStyle: 'light-content' }}
        />
        <WeatherInFlorida styles={styles} openSocket={this.isAppActive()} />

        <WeatherAtLocation styles={styles} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: '#ecf0f1',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,

  },

  error: {
    color: 'red'
  },

  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },

  section: {
    flex: 1,
  },

  paragraph: {
    margin: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
});
