import React from 'react';
import { Platform } from 'react-native';
import { Constants, Location, Permissions } from 'expo';

export default function withLocation (Component) {

  return class LocationHOC extends React.Component {
    state = {
      coords: null,
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
        this.setState({ coords });
      }

      catch (err) {
        this.setState({ errorMessage: err.message })
      }
    };

    render() {
      return <Component location={this.state} {...this.props} />
    }
  }

}
