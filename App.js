import { MAPS_API_KEY } from '@env'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, PermissionsAndroid, Dimensions, Image } from 'react-native';
import MapView, {Marker} from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';

import * as Location from "expo-location";

const { width, height } = Dimensions.get('screen')

const padding = { top: 50, right: 20, bottom: 50, left: 50 }

export default function App() {
  const [region, setRegion] = useState(null)
  const destination = {
    latitude: -22.92425,
    longitude: -47.06777
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permissão de localização não garantida!')
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
      )

    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(() => {
          console.log("Permissão concedida");
        })
    }
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        zoomEnabled={true}
        loadingEnabled={true}
        showsUserLocation={true}
        mapPadding={padding}
        showsMyLocationButton={true}
      >
        <MapViewDirections
          origin={region}
          destination={destination}
          apikey={MAPS_API_KEY}
          strokeWidth={3}
          strokeColor='purple'
          mode={"TRANSIT"}
          language={"pt-BR"}

        />
        <Marker coordinate={region} />
        <Marker coordinate={destination} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dimensao: {
    width: width,
    height: height,
  }
});

