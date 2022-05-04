import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useNavigate } from 'react-router-native';
import axiosInstance from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
    const [email, onChangeEmail] = React.useState("");
    const [user, onChangeUser] = React.useState("");
    const [pass, onChangePass] = React.useState("");
    const [error, setError] = React.useState(false);
    let navigate = useNavigate();

    const storeData = async (value) => {
        try {
            const jAccess = JSON.stringify(value.data.access);
            await AsyncStorage.setItem('@access_token', jAccess);
            const jRefresh = JSON.stringify(value.data.refresh);
            await AsyncStorage.setItem('@refresh_token', jRefresh);
            const jLog = JSON.stringify(true);
            await AsyncStorage.setItem('@loggedIn', jLog);
            } catch (e) {
            // saving error
            }
        }

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('@access_token');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }

    async function handleClick(user, pass) {
        axiosInstance
            .post(`token/`, {
                user_name: user,
                password: pass,
            })
            .then((res) => {
                storeData(res);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + getData;
                console.log(res);
                
                navigate("/");
            }).catch((err) => {
              setError(true);
            });
      }
  
    return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={styles.form}>
            <Image source={require('./assets/user.png')} style={{width: 200, height: 200, margin: 20}} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="lightgrey" autoCorrect={false} onChangeText={onChangeEmail} value={email} />
            <TextInput style={styles.input} placeholder="Username" placeholderTextColor="lightgrey" autoCorrect={false} onChangeText={onChangeUser} value={user} />
            <TextInput style={styles.input} placeholder="Password" placeholderTextColor="lightgrey" secureTextEntry autoCorrect={false} onChangeText={onChangePass} value={pass} />
            { error ? <Text style={{color: 'red'}}>Invalid register details.</Text> : null}
            <Pressable style={styles.button} onPress={ (event) => {event.preventDefault(); handleClick(user, pass); }}><Text style={{textAlign: 'center'}}>Register</Text></Pressable>      
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
