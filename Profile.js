import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, Alert, Image, Pressable, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axiosInstance from './axios';
import { Link, useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import privacynotice from './privacy';

export default function Profile(props) {
  let navigate = useNavigate();

  function logout() {
    // save('loggedIn', 'false');
    props.onChangeValue(false);
    props.setName(null);
    // const response = axiosInstance.post('user/logout/blacklist/', {
    //     refresh_token: getValueFor('refresh_token'),
    // });
    // console.log(response);
    navigate("/");
  }

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Pressable style={{ padding: 15, borderRadius: 35, alignSelf: 'flex-end' }} onPress={() => logout()} >
            <Text style={styles.logButton}>Logout</Text>
        </Pressable>
        <Image source={require('./assets/user.png')} style={{width: 200, height: 200, margin: 20}} />
        <Text style={{fontSize: 18, margin: 10, color: props.mode ? "#000" : "#fff"}}>Profile</Text>
        <Details type={"Your Name"} name={props.name} col={props.mode ? "#000" : "#fff"} />
        <Details type={"Your Email"} name={props.name + "@hotmail.com"} col={props.mode ? "#000" : "#fff"} />
        <Pressable onPress={() => Rate()}><Text style={{color: 'darkgreen', fontSize: 15, margin: 20}}>Give Feedback</Text></Pressable>
        <Notice />
      </View>
  );
}

function openStore() {
  return(Linking.openURL('https://play.google.com/store'));
}

function Rate() {
  return(
    Alert.alert(
      'Rate us',
      'Would you like to share your review with us? \n This will help and motivate us a lot.',
      [
        {text: 'Sure', onPress: () => openStore()},
        {
          text: 'No Thanks',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    )
  );
} 

function Notice() {
  const [open, setOpen] = useState(false);
  return(
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={open} >
        <View style={{alignItems: 'center', justifyContent: 'center', width: '100%', borderRadius: 10}}>
          <View style={{ alignItems: "center", justifyContent: 'center', backgroundColor: '#fff', width: '80%', height: '80%', borderRadius: 10 }}>
              <Text style={{alignItems: 'center', justifyContent: 'center', padding: 10, fontSize: 15, textAlign: 'center'}}>{privacynotice}</Text>
              <Pressable onPress={() => setOpen(!open)} style={{width: 150, height: 40, borderRadius: 35, backgroundColor: 'rgb(139,0,139)', justifyContent: 'center'}}>
                <Text style={{color: 'white', textAlign: 'center'}}>Hide Notice</Text>
              </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable onPress={() => setOpen(!open)} style={{width: 150, height: 40, borderRadius: 35, backgroundColor: 'rgb(139,0,139)', justifyContent: 'center', marginTop: 20}}>
          <Text style={{color: 'white', textAlign: 'center'}}>Privacy Notice</Text>
      </Pressable>
    </>
  );
}

function Details(props) {
  return(
    <>
      <Text style={{fontSize: 10, color: 'grey', alignSelf: 'flex-start', marginLeft: 45}}>{props.type}</Text>
      <Text style={{fontSize: 20, color: props.col, padding: 5, alignSelf: 'flex-start', marginLeft: 40}}>{props.name}</Text>
      <View style={styles.line} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center'
  },
  logButton: {
    marginTop: 30,
    color: 'red',
  },
  line: {
    width: '80%',
    borderTopWidth: 1,
    borderColor: 'lightgrey',
    marginBottom: 20,
  }
});
