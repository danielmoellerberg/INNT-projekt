import { StyleSheet } from "react-native";

// Farvepalet (lavet med coolors.co) - indigo/violet som brand-farve
export const Colors = {
    primary: '#5E60CE',
    primaryDark: '#3A0CA3',
    primaryLight: '#EDEDFB',
    accent: '#64DFDF',
    surface: '#FFFFFF',
    textDark: '#22223B',
    textMuted: '#6B7280',
    border: '#E5E7EB',
};

export const GlobalStyle = StyleSheet.create({
    // Container
    container: {
        flex: 1,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ListScreen
    itemContainer:{
        backgroundColor: Colors.surface,
        margin: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.textDark,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
        flex: 1,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 3,
    },
    infoContainer: {
        flex:2,

    },
    pictureContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 16,
    },
    itemText: {
        fontSize: 12,
        fontFamily: 'Segoe UI',
        fontWeight: '600',
        color: Colors.textDark,
    },
    buttonContainer: {
        flexDirection: 'row',
        flex:2,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%',

    },

    // ProfileScreen
    myProfilePictureContainer: {
        flex: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfoContainer: {
        flex: 6,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        width: '100%'
    },
    saveButtonContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },


    // ButtonComponent
    primaryBtn: {
        pressedColor: Colors.primaryDark,
        defaultColor: Colors.primary,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.primaryDark,
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryBtnText: {
        color: Colors.surface,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
    },
    secondaryBtn: {
        pressedColor: Colors.primaryLight,
        defaultColor: Colors.surface,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.textDark,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    secondaryBtnText: {
        color: Colors.primary,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
    },

    // TextInputComponent
    inpLabel: {
        fontSize: 14,
        fontFamily: 'Segoe UI',
        fontWeight: 'normal',
        color: Colors.textMuted,
        marginBottom: 5,
    },
    textInput: {
        height: 50,
        width: 300,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        borderRadius: 10,
        paddingLeft: 16,
        borderWidth: 1,
    },

    // PictureComponent
    picture: {
        borderColor: Colors.primaryLight,
        borderWidth: 3,
    },

});
