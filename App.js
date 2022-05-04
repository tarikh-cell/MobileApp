import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link, Routes } from "react-router-native";
import LogIn from './LogIn';
import Main from './Main';
import NavBar from './NavBar';
import Notes from './Notes';
import Files from './Files';
import Register from './Register';
import Profile from './Profile';

export default function App() {
  const [value, onChangeValue] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    //Runs only on the first render
  }, [value, dark]);

  return (
    <NativeRouter>
      <View style={{flex: 1, backgroundColor: dark ? '#fff' : "#000"}}>
        <Routes>
          <Route path="/" element={<Main mode={dark} auth={value} token={token} name={name} setMode={setDark} />} />
          <Route path="/Login" element={<LogIn mode={dark} auth={value} onChangeValue={onChangeValue} setToken={setToken} setName={setName} />}  />
          <Route path="/Notes" element={<Notes mode={dark} auth={value} token={token} id={userId} />} />
          <Route path="/Files" element={<Files mode={dark} auth={value} token={token} onChangeValue={setUserId} />} />
          <Route path="/Register" element={<Register mode={dark} />} />
          <Route path="/Profile" element={<Profile mode={dark} auth={value} name={name} onChangeValue={onChangeValue} setName={setName} />}  />
        </Routes>
        <NavBar mode={dark} auth={value} />
      </View>
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  container: {
  
  },
});
