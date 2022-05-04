import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, TextInput, KeyboardAvoidingView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { useLocation } from 'react-router-native';
import { Link, useNavigate } from 'react-router-native';

export default function Notes(props) {
  let navigate = useNavigate();
  const {state} = useLocation();
  const [text, onChangeText] = useState(state ? state.text : null);
  const [title, setTitle] = useState(state ? state.title : null);

  const apiUrl = 'https://django-psql-persistent-workspace.apps.kube.eecs.qmul.ac.uk/api/';
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    headers: {Authorization: props.token ? 'JWT ' + props.token: null,
      'Content-Type': 'application/json',
      accept: 'application/json',
    }, });

  function download(){
    if (state !== null){
      axiosInstance
        .put(`edit/`+ props.id +`/`, { title: title, description: text, author: props.id,
        })
        .then((res) => {
            console.log(res);
        });
    } else {
      axiosInstance
        .post(`create/`, { title: title, description: text, author: props.id,
        })
        .then((res) => {
            console.log(res);
        });
      }
      navigate("/Files");
  }

  return (
      <View style={styles.container}>
          <StatusBar style="auto" />
          <View style={{flexDirection: 'row', paddingTop: 30, justifyContent: 'space-between', borderBottomWidth: 1, borderColor: 'lightgrey'}}>
            <TextInput style={[styles.header, {color: props.mode ? "#000" : "#fff"}]} placeholder="Title" placeholderTextColor="lightgrey" onChangeText={setTitle} value={title} />
            <TouchableOpacity style={{padding: 4, color: props.mode ? "#000" : "#fff"}} onPress={() => download()}>
              {props.auth ? <Entypo name="download" size={20} color="blue" /> : null}
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior='height'>
            <TextInput style={{height: '100%', textAlignVertical: 'top', marginTop:20, color: props.mode ? "#000" : "#fff"}} multiline={true}  placeholder="Username" placeholderTextColor="lightgrey" autoCorrect={false} onChangeText={onChangeText} value={text} />
          </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 120
  },
  header: {
    fontSize: 20,
    padding: 5
  }
});
