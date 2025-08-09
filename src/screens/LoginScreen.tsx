import React, { useState } from 'react'
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { loginRequest } from '../api/client'
import { hasSessionCookie } from '../lib/cookies'

type RootStackParamList = {
  Login: undefined
  Feeds: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState(
    ''
  )
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Fill in all fields')
      return
    }
    setLoading(true)
    try {
      const data = await loginRequest(email.trim(), password)
      if (!data.ok) {
        const reason = data.reason || 'Unknown error'
        Alert.alert('Login failed', reason)
        setLoading(false)
        return
      }

      const ok = await hasSessionCookie()
      if (!ok) {
        Alert.alert('Session cookie not set', 'Make sure EXPO_PUBLIC_API uses https://proxyfeed.io')
        setLoading(false)
        return
      }

      navigation.replace('Feeds')
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8 }}>Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="username"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Log in" onPress={onSubmit} />
      )}
    </View>
  )
}
