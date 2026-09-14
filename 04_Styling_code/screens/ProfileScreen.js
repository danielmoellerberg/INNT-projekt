import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';

import TextInputComponent from '../components/TextInputComponent';

import PictureComponent from '../components/PictureComponent';

import { GlobalStyle } from '../styles/GlobalStyle';

export default function ProfileScreen() {
  return (
    <View style={GlobalStyle.container}>
        <View style = {GlobalStyle.myProfilePictureContainer}>
            <PictureComponent source = {require('../assets/BlankProfilePicture.png')} size = {100} />
        </View>
        <View style = {GlobalStyle.profileInfoContainer}>
            <TextInputComponent label = {"Full Name"} hint = {"John Doe"} defaultV={"Student Name"}/>
            <TextInputComponent label = {"Job Title"} hint = {"Manager"} defaultV={"Student"}/>
            <TextInputComponent label = {"E-Mail"} hint = {"JD@company.com"} defaultV={"student@student.cbs.dk"}/>
            <TextInputComponent label = {"Office Location"} hint = {"New York"} defaultV={"Copenhagen"}/>
        </View>
        <View style = {GlobalStyle.saveButtonContainer}>
            <ButtonComponent title = {"Save"} width={100} height={50} type={'primary'}/>
        </View>
      <StatusBar style="auto" />
    </View>
  );
}
