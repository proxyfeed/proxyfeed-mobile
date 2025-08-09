import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './src/screens/LoginScreen'
import FeedsScreen from './src/screens/FeedsScreen'

type RootStackParamList = {
  Login: undefined
  Feeds: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Feeds" component={FeedsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
