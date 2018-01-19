import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

export default function MyCard (props) {
  return (
    <Card
      titleStyle={styles.title}
      {...props}
    >

      {props.children}

    </Card>
  );

}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
  }
});
