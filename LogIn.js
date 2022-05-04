import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import axiosInstance from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogIn(props) {
    const [user, onChangeUser] = React.useState("");
    const [pass, onChangePass] = React.useState("");
    const [error, setError] = React.useState(false);
    let navigate = useNavigate();

    async function save(key, value) {
      await AsyncStorage.setItem(key, value);
    }
  
    async function getValueFor(key) {
      let result = await AsyncStorage.getItem(key);
      if (result) {
        return result;
      } else {
        return null;
      }
    }

    async function handleClick(user, pass) {
        axiosInstance
          .post(`token/`, {
              user_name: user,
              password: pass,
          })
          .then((res) => {
              save('access_token', res.data.access);
              save('refresh_token', res.data.refresh);
              save('loggedIn', 'true');
              props.onChangeValue(true);
              props.setName(user);
              props.setToken(res.data.access);
              axiosInstance.defaults.headers['Authorization'] =
                  'JWT ' + getValueFor('access_token');
              navigate("/Profile");
          }).catch((err) => {
            setError(true);
          });
      }
  
    return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.form}>
            <Image source={require('./assets/user.png')} style={{width: 200, height: 200, margin: 20}} />
            <TextInput style={styles.input} placeholder="Username" placeholderTextColor="lightgrey" autoCorrect={false} onChangeText={onChangeUser} value={user} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="lightgrey" secureTextEntry autoCorrect={false} onChangeText={onChangePass} value={pass} />
            <Pressable style={styles.button} onPress={ (event) => {event.preventDefault(); handleClick(user, pass); }}><Text style={{textAlign: 'center'}}>LogIn</Text></Pressable>
            { error ? <Text style={{color: 'red'}}>Invalid authentication details.</Text> : null}
            <Text style={{color: props.mode ? "#000" : "#fff"}}>Don't have an account?</Text> 
            <Link to="/Register"><Text style={{textDecorationLine: 'underline', color: 'blue'}}>Register</Text></Link>          
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        marginTop: 15,
        justifyContent: 'center',
      },
      form: {
        alignItems: 'center',
      }, 
      input: {
        fontSize: 15,
        borderWidth: 1,
        borderRadius: 35,
        borderColor: 'rgb(238,238,238)',
        width: 275,
        height: 50,
        margin: 10,
        paddingLeft: 10,
        backgroundColor: 'rgb(236,236,236)',
      }, 
      button: {
        margin: 20,
        backgroundColor: 'rgb(30,144,255)',
        borderRadius: 35,
        width: 100,
        height: 40,
        justifyContent: 'center'
      }
});
