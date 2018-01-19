import React from 'react';
import { Platform } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

export default function withLocation (Component) {

  return class LocationHOC extends React.Component {
    state = {
      coords: null,
      lat: null,
      long: null,
      errorMessage: null,
    };

    componentWillMount() {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        this.setState({
          errorMessage: 'Location cannot be accessed on an Android emulator. Please use an Android device.',
        });
      } else {
        this.getLocationAsync();
      }
    }

    getLocationAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        this.setState({
          lat: coords.latitude,
          long: coords.longitude
        });
      }

      catch (err) {
        this.setState({ errorMessage: err.message })
      }
    };

    render() {
      return <Component
                lat={this.state.lat}
                long={this.state.long}
                errorMessage={this.state.errorMessage}
                {...this.props}
              />
    }
  }

}
