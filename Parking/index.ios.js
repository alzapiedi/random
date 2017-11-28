import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';

import MapView from 'react-native-maps';

export default class Parking extends Component {
  render() {
    return (
        <MapView initialRegion={{
          latitude: 39.952457,
          longitude: -75.1636,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }} />
    );
  }
}

AppRegistry.registerComponent('Parking', () => Parking);
