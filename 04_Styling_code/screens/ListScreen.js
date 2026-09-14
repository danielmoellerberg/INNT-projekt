import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';

import { PEOPLE } from '../data/const';
import PictureComponent from '../components/PictureComponent';
import ButtonComponent from '../components/ButtonComponent';

import { GlobalStyle, Colors } from '../styles/GlobalStyle';

export default function ListScreen() {
  return (
    <View style={GlobalStyle.container}>
        <View style={{flex: 1 , backgroundColor: Colors.primaryLight, borderRadius: 10, width: '100%'}}>
            <FlatList
                data={PEOPLE}
                renderItem={({item}) => {
                    return(
                        <View style={GlobalStyle.itemContainer}>
                            <View style={GlobalStyle.contactContainer}>
                                <View style={GlobalStyle.pictureContainer}>
                                    <PictureComponent source={item.Picture} size = {80}/>
                                </View>
                                <View style={GlobalStyle.infoContainer}>
                                    <View style= {GlobalStyle.textContainer}>
                                        <Text style={GlobalStyle.itemText}>{item.FullName}</Text>
                                    </View>
                                    <View style= {GlobalStyle.textContainer}> 
                                        <Text style={GlobalStyle.itemText}>{item.JobTitle}</Text>
                                    </View>
                                    <View style= {GlobalStyle.textContainer}>
                                        <Text style={GlobalStyle.itemText}>{item.Email}</Text>
                                    </View>
                                    <View style= {GlobalStyle.textContainer}>
                                        <Text style={GlobalStyle.itemText}>{item.OfficeLocation}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style= {GlobalStyle.buttonContainer}>
                                <ButtonComponent title = {"View"} width={100} height={40} type={'secondary'} />
                                <ButtonComponent title = {"Call"} width={100} height={40} type={'primary'}/>
                            </View>
                        </View>
                    )
                }}
            />
        </View>
      <StatusBar style="auto" />
    </View>
  );
}
