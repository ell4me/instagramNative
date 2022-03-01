import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Posts} from "./Posts/Posts";
import {Search} from "./Search";
import {Profile} from "./Profile/Profile";
import {Ionicons as Icon} from '@expo/vector-icons';
import {Icons} from "../../../constants";

const AddPhoto = () => <></>
const Tab = createBottomTabNavigator<TabParams>();
export const NavigatorTabs = () => {
    return (
        <Tab.Navigator  screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let iconName = '' as Icons
                switch (route.name) {
                    case "Posts":
                        iconName = focused ? 'home-sharp' : 'home-outline';
                        break
                    case "Search":
                        iconName = focused ? 'search' : 'search-outline';
                        break
                    case "AddPhoto":
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                        break
                    case "Profile":
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                        break
                    default: return
                }
                return <Icon name={iconName} size={29} color={'#262626'} />
            },
            tabBarStyle: {
                borderColor: 'rgba(0,0,0, .05)',
                borderTopWidth: 1,
                height: 85,
                shadowOpacity: 0,
                backgroundColor: '#fff',
            },
            tabBarShowLabel: false,
            headerShown: false
        })}
        >
            <Tab.Screen name={'Posts'} component={Posts}/>
            <Tab.Screen name={'Search'} component={Search}/>
            <Tab.Screen name={'AddPhoto'} component={AddPhoto} listeners={({navigation}) => ({
                tabPress: e => {
                    e.preventDefault()
                    navigation.navigate('Add')
                }
            })}/>
            <Tab.Screen name={'Profile'} component={Profile}/>
        </Tab.Navigator>
    );
};

export type TabParams = {
    AddPhoto: undefined
    Posts: undefined
    Profile: {id?: string} | undefined
    Search: undefined
}
