import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'; // 0.18.5

import "@expo/vector-icons"; // 6.2.2

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