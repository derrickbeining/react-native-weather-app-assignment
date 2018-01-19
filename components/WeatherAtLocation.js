import React, { PureComponent } from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';
import Card from './Card';
import withGeoCoords from './HOCs/withGeoCoords';
import createDateTimeString from '../lib/createDateTimeString';
import { WEATHER_API_KEY } from '../keys';

const WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/weather';

class WeatherAtLocation extends PureComponent {
  constructor() {
    super();
    this.state = {
      updated: '',
      temp: 0,
      humidity: 0,
    };
  }

  render() {
    const { updated, temp, humidity } = this.state;
    const { styles, errorMessage } = this.props;

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


          { errorMessage && (
            <Text style={[ styles.paragraph, styles.error ]}>
              Error: { errorMessage }
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

  componentDidMount() {
    this.loadSavedState();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('COMPONENT DID UPDATE',
                'NEW PROPS', this.props !== prevProps,
                'NEW STATE', this.state !== prevState
    );
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
    const { lat } = this.props;
    return lat && lat !== prevProps.lat;
  }

  loadWeatherDataToState = () => {
    const { lat, long } = this.props;
    return this.fetchWeatherByCoords(lat, long)
      .then(({ temp, humidity }) => this.updateState({ temp, humidity }))
  }

  fetchWeatherByCoords(lat, long) {
    return fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${long}&units=metric&APPID=${WEATHER_API_KEY}`
    )
      .then(response => response.json())
      .then(({ main }) => ({
        temp: main.temp,
        humidity: main.humidity
      }))
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

  loadSavedState() {
    return AsyncStorage.getItem('lastState')
      .then(stateString => stateString ? JSON.parse(stateString) : false)
      .then(state => state ? this.setState(state) : false)
      .catch(err => console.error('ERROR LOADING STATE:', err));
  }
}

export default withGeoCoords(WeatherAtLocation);
