import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NavBar(props) {
  
  return (
      <View style={styles.container}>
        <NavSlot path="/" icon="home" col={props.mode} />
        <NavSlot path="/Notes" icon="filetext1" col={props.mode} />
        <NavSlot path="/Files" icon="folder1" col={props.mode} />
        { props.auth ? <NavSlot path="/Profile" icon="user" col={props.mode} /> : <NavSlot path="/Login" icon="login" col={props.mode} /> }      
      </View>
  );
}

function NavSlot(props) {
  const {path, icon, col, ...otherprops} = props;
  return (
    <Link to={path} underlayColor="#f0f4f7" style={{ textDecoration: 'none', padding: 15, borderRadius: 35 }}>
      <AntDesign name={icon} size={26} color={col ? "black" : "white"} /> 
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    bottom: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
});
