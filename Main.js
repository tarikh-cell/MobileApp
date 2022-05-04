import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, AppState, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as IntentLauncher from 'expo-intent-launcher';
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-native';

export default function Main(props) {
  const [dates, onChangeDates] = useState([]);
  const [times, onChangeTimes] = useState([]);
  const index = randomInteger(6);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'inactive') {
      console.log('the app is closed');
    }    
  }

  const titles = ["Make your points clear.", "Proofread and polish your report.",
    "A writer has to use formal language.", "Prepare in advance.",
    "Keep to the facts.", "Ensure the correct format."
    ];

  const messages = [
    "Write clearly and concisely.",
    "After finishing your work, check grammar and punctuation and shorten the sentences.",
    "It requires passive voice use, little to no personal pronouns, neutral verbs.",
    "Before starting to write the report, identify the audience and its purpose. Once you do that, collect and outline the information.",
    "Find credible sources and provide evidence and illustrative examples based on the information found.",
    "For the readers to clearly understand the report, a specific format should be followed."
  ];

  const axiosInstance = axios.create({ baseURL: '', timeout: 5000,
    headers: {Authorization: props.token ? 'JWT ' + props.token: null,
      'Content-Type': 'application/json', accept: 'application/json',
    }, });

  useEffect(() => {
    if (props.auth){    
      {console.log(props.token)}
      axiosInstance.get('https://django-psql-persistent-workspace.apps.kube.eecs.qmul.ac.uk/api/productivity/get/').then((res) => {onChangeDates(refactor(res.data)); onChangeTimes(refactor2(res.data));});
    }
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [])

  function refactor(dates){
    let d = [];
    for(let i = 0; i < dates.length; i++){
      d.push({ value: dates[i].duration, label: dates[i].date.toString()});
    }
    return d;
  }

  function refactor2(dates){
    let d = [];
    for(let i = 0; i < dates.length; i++){
      d.push({ value: dates[i].duration });
    }
    return d;
  }

  function randomInteger(max) {
    return Math.floor(Math.random() * max);
  }

  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-between', margin: 10}}>
          <Image source={ props.mode ? require('./assets/Logo.png') : require('./assets/WorkSpace.png')} resizeMode='contain' style={{width: 150, height: 50, margin: 20}} />
          <Text style={{fontSize: 15, margin: 40, color: props.mode ? "#000" : "#fff"}}>Hi, {props.name === null ? "User" : props.name }</Text>
        </View>
        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
          <TouchableOpacity onPress={() => props.setMode(!props.mode)} style={{borderWidth: 1, borderStyle: 'dashed', borderColor: 'lightblue', borderRadius : 1, alignItems: 'center', width: '50%', padding: 20}} >
            { props.mode ? <Ionicons name="moon-outline" size={45} color={props.mode ? "#000" : "#fff"} /> : <Ionicons name="sunny-outline" size={45} color={props.mode ? "#000" : "#fff"} /> } 
            <Text style={{color: props.mode ? "#000" : "#fff"}}>Dark Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {IntentLauncher.startActivityAsync("android.settings.AIRPLANE_MODE_SETTINGS")}} style={{borderWidth: 1, borderStyle: 'dashed', borderColor: 'lightblue', borderRadius : 1, alignItems: 'center', width: '50%', padding: 20}}>
            <Ionicons name="airplane-outline" size={45} color={props.mode ? "#000" : "#fff"} />
            <Text style={{color: props.mode ? "#000" : "#fff"}}>Airplane Mode</Text>
          </TouchableOpacity>
        </View>

        <View style={{alignSelf: 'center', marginVertical: 70, marginHorizontal: 30, alignItems: 'center'}}>
          <View style={{flexDirection: 'row', margin: 5, alignItems: 'center'}}>
            <Text style={{textAlign: 'center', fontSize: 20}}>Tips</Text>
            <Ionicons name="bulb" size={20} color="black" />
          </View>
          <Text style={{fontWeight: 'bold'}}>{titles[index]}</Text>
          <Text style={{textAlign: 'center'}}>{messages[index]}</Text>
        </View>

        <Text style={{fontSize: 15, color: props.mode ? "#000" : "#fff", alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Usage Statistics</Text>
        { props.token ? 
        <>
          <LineChart 
            areaChart
            isAnimated
            noOfSections={3}
            curved={true}
            animationDuration={1200}
            startFillColor="#0BA5A4"
            startOpacity={1}
            endOpacity={0.3}
            initialSpacing={4}
            adjustToWidth={true} 
            width={300} 
            maxValue={0} 
            data={times}
            spacing={30}
            thickness={2}
            hideRules
            yAxisColor={props.mode ? "#000" : "#fff"}
            dataPointsColor={props.mode ? "#000" : "#fff"}
            yAxisTextStyle={{color: props.mode ? "#000" : "#fff"}}
            verticalLinesColor="rgba(14,164,164,0.5)"
            xAxisColor={props.mode ? "#000" : "#fff"}
            color="#0BA5A4" />
        </> : 
        <>
          <Text style={{textAlign: 'center', paddingTop: 30, color: props.mode ? "#000" : "#fff"}}>Nothing here at the moment... </Text>
          <Link to="/Login"><Text style={{textDecorationLine: 'underline', color: 'blue', textAlign: 'center'}}>Login</Text></Link>  
          <Text style={{textAlign: 'center', color: props.mode ? "#000" : "#fff"}}> to view your files.</Text>
        </>}
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
});
