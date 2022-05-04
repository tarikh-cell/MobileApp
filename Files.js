// Imports
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import axios from 'axios';
import { EvilIcons } from '@expo/vector-icons';

// Files class
export default function Files(props) {
  // Variables
  const [ data, setData ] = useState(null);
  let navigate = useNavigate();

  const apiUrl = 'https://django-psql-persistent-workspace.apps.kube.eecs.qmul.ac.uk/api/';
  const getUrl = 'https://django-psql-persistent-workspace.apps.kube.eecs.qmul.ac.uk/api/user/use/';
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    headers: {Authorization: props.token ? 'JWT ' + props.token: null,
      'Content-Type': 'application/json',
      accept: 'application/json',
    }, });

  useEffect(() => {
    //Runs only on the first render
    const loadUserList = async () => {
      if (props.auth){
        axiosInstance.get(apiUrl).then((res) => setData(res.data));
        axiosInstance.get(getUrl).then((res) => props.onChangeValue(res.data.ID));
      }
    }
    loadUserList();
  }, []);

  function go(id, title, text) {
    navigate("/Notes", { state: { id: id, title: title, text: text } });
  }
  
  function deleteData(post) {
    axiosInstance
        .delete(`delete/` + post)
        .catch(function (error) {
            if (error.response) {
                console.log(error.response)
            }
    });
  }

  function ListItem(props){
    const { id, title, text, col } = props;
    const [hover, setHover] = useState( false );

    return(
      <View style={{width: '25%', justifyContent: 'center', margin: 10}}>
        <Pressable style={{paddingLeft: 60, marginBottom: -10}} onPress={(event) => {event.preventDefault(); deleteData(id);}}>
            <EvilIcons name="trash" size={35} color="red" />
          </Pressable>
        <TouchableOpacity style={{width: '95%'}} onPress={(event) => {event.preventDefault(); go(id, title, text);}}  >
          <Image source={require('./assets/word.png')} style={{width: 80, height: 80, margin: 5}} />
        </TouchableOpacity>
        <Text style={[styles.text, {color: col}]}>{title}</Text>
      </View>
    );
  }

  // View
  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={{textAlign: 'center', width: '100%', fontWeight: '300', fontSize: 30, marginTop: 30, color: props.mode ? "#000" : "#fff"}}>My Files</Text> 
        { data !== null ? 
        <ScrollView style={{width: '100%'}}>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
          {data.map((values, index) => (
              <ListItem key={index} id={values['id']} title={values['title']} text={values['description']} col={props.mode ? "#000" : "#fff"} />
            ))}
            </View>
        </ScrollView>
        :
        <>
          <Text style={{textAlign: 'center', paddingTop: 200, color: props.mode ? "#000" : "#fff"}}>Nothing here at the moment... </Text>
          <Link to="/Login"><Text style={{textDecorationLine: 'underline', color: 'blue', textAlign: 'center'}}>Login</Text></Link>  
          <Text style={{textAlign: 'center', color: props.mode ? "#000" : "#fff"}}> to view your files.</Text>
        </>  }
      </View>
  );
}

//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },
  header: {
      // backgroundColor: '#fff',
      fontSize: 20,
      height: '10%',
      padding: 10,
      marginTop: 10,
  },
  text: {
    fontWeight: '900',
    fontSize: 16,
    textAlign: 'center'
  }
});
