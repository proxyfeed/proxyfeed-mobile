import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { FeedItem, getFeeds, refetchFeed, logout } from '../api/feeds'

type RootStackParamList = {
  Login: undefined
  Feeds: undefined
}

type Props = NativeStackScreenProps<RootStackParamList, 'Feeds'>

export default function FeedsScreen({ navigation }: Props) {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await getFeeds()
      setItems(data)
    } catch (e: any) {
      Alert.alert('Session expired', 'Please log in again.')
      navigation.replace('Login')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [navigation])

  useEffect(() => {
    load()
  }, [load])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            try {
              await logout()
            } catch {}
            navigation.replace('Login')
          }}
          style={{ paddingHorizontal: 8 }}
        >
          <Text style={{ color: '#2563eb', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      ),
      title: 'Feeds',
    })
  }, [navigation])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    load()
  }, [load])

  const handleFetchNow = useCallback(
    async (id: string) => {
      try {
        await refetchFeed(id)
        Alert.alert('Fetch started', 'Worker is updating the feed.')
        onRefresh()
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Failed to start refetch.')
      }
    },
    [onRefresh]
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading feeds…</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={items.length === 0 ? styles.center : undefined}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.slug || item.id}</Text>
          <Text style={styles.sub}>{item.publicUrl || '(no public URL yet)'}</Text>
          <View style={styles.row}>
            <Text style={styles.meta}>
              status: {item.fetchStatus || '-'} • fetched:{' '}
              {item.lastFetchedAt ? new Date(item.lastFetchedAt).toLocaleString() : '-'}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={() => handleFetchNow(item.id)}>
              <Text style={styles.btnText}>Fetch now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text>No feeds yet.</Text>}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    gap: 6,
  },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { color: '#374151' },
  row: { marginTop: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { color: '#6b7280', fontSize: 12 },
  btn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#2563eb', borderRadius: 8 },
  btnText: { color: 'white', fontWeight: '600' },
})
