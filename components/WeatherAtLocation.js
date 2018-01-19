import React, { Component } from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';
import Card from './Card';
import withLocation from './HOCs/withLocation';
import createDateTimeString from '../lib/createDateTimeString';
import { WEATHER_API_KEY } from '../keys';

const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';

class WeatherAtLocation extends Component {
  constructor() {
    super();
    this.state = {
      updated: '',
      temp: 0,
      humidity: 0,
    };
  }

  componentDidMount() {
    this.loadLastState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.shouldFetchWeather(prevProps)) {
      this.loadWeatherDataToState();
    }
    if (this.shouldStoreState(prevState)) {
      this.storeState();
    }
  }

  shouldStoreState(prevState) {
    return this.state !== prevState;
  }

  shouldFetchWeather(prevProps) {
    const { coords } = this.props.location;
    return coords && coords !== prevProps.location.coords;
  }

  loadWeatherDataToState = () => {
    const { coords } = this.props.location;
    return this.fetchWeatherByCoords(coords.latitude, coords.longitude)
      .then(data => this.updateState(data))
  }

  fetchWeatherByCoords(lat, long) {
    return fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${long}&units=metric&APPID=${WEATHER_API_KEY}`
    )
      .then(response => response.json())
      .then(data => data.main)
      .catch(err => console.error('ERROR FETCHING WEATHER:', err));
  }

  updateState({ temp, humidity }) {
    this.setState({
      updated: createDateTimeString(),
      temp,
      humidity
    });
  }

  storeState() {
    return AsyncStorage.setItem(
      'lastState',
      JSON.stringify(this.state)
    )
    .catch(err => console.error('ERROR SAVING STATE:', err));
  }

  loadLastState() {
    return AsyncStorage.getItem('lastState')
      .then(stateString => stateString ? JSON.parse(stateString) : false)
      .then(state => state ? this.setState(state) : false)
      .catch(err => console.error('ERROR LOADING STATE:', err));
  }

  render() {
    const { updated, temp, humidity } = this.state;
    const { styles, location } = this.props;
    return (
        <Card
          title="Weather at your location"
          containerStyle={styles.section}
          wrapperStyle={styles.sectionInner}
        >

          <Text style={styles.paragraph}>
            Last updated: { updated }
          </Text>
          <Text style={styles.paragraph}>
            Temp: { temp }°C
          </Text>
          <Text style={styles.paragraph}>
            Humidity: { humidity }%
          </Text>


          { location.errorMessage && (
            <Text style={[ styles.paragraph, styles.error ]}>
              Error: { location.errorMessage }
            </Text>
          )}

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Button
              onPress={this.loadWeatherDataToState}
              style={{ alignSelf: 'flex-end' }}
              title='Refresh'
            />
          </View>

        </Card>
    );
  }
}

export default withLocation(WeatherAtLocation);
