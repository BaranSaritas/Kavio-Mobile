# 🎨 Kavio Mobile - Tema Sistemi Kullanım Kılavuzu

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Kurulum](#kurulum)
3. [Tema Yapısı](#tema-yapısı)
4. [Kullanım Örnekleri](#kullanım-örnekleri)
5. [API İşlemleri](#api-işlemleri)
6. [Connection & Contact İşlemleri](#connection--contact-işlemleri)

---

## 🎯 Genel Bakış

Kavio Mobile tema sistemi, uygulamanın görünümünü dinamik olarak değiştirmenizi sağlar. Temalar API'den çekilebilir veya yerel olarak kullanılabilir.

### Tema Özellikleri
- ✅ API'den dinamik tema çekme
- ✅ Yerel tema seçenekleri (9 farklı tema)
- ✅ AsyncStorage ile tema kaydetme
- ✅ Redux ile global tema yönetimi
- ✅ Custom hook ile kolay kullanım

---

## 🚀 Kurulum

### 1. Dosyaları Kopyalayın

Aşağıdaki dosyalar projenize eklenmiştir:

```
redux/slices/
  ├── ThemeSlice.ts        (Güncellenmiş)
  ├── ConnectionsSlice.ts  (Mevcut - Değişiklik yok)
  └── ContactsSlice.ts     (Güncellenmiş - deleteContact eklendi)

hooks/
  └── useTheme.ts          (Yeni)

components/
  ├── ConnectionCard.tsx   (Örnek)
  └── ContactCard.tsx      (Örnek)
```

### 2. Store'u Güncelleyin

`redux/store.ts` dosyanızda slice'ların import edildiğinden emin olun:

```typescript
import themeReducer from './slices/ThemeSlice';
import connectionsReducer from './slices/ConnectionsSlice';
import contactsReducer from './slices/ContactsSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    connections: connectionsReducer,
    contacts: contactsReducer,
    // ... diğer reducer'lar
  },
});
```

### 3. App Başlangıcında Tema Yükleme

Ana component'inizde (genellikle `App.tsx` veya `_layout.tsx`):

```typescript
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadStoredTheme } from './redux/slices/ThemeSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Uygulama başladığında kayıtlı temayı yükle
    dispatch(loadStoredTheme());
  }, []);

  return (
    // ... app content
  );
}
```

---

## 🎨 Tema Yapısı

### Tema Renkleri

Her tema aşağıdaki renk paletini içerir:

```typescript
interface Theme {
  primaryColor: string;                 // Ana renk
  backgroundColor: string;              // Arkaplan rengi
  headerBackgroundColor: string;        // Header arkaplanı
  textColor: string;                    // Metin rengi
  menuBackgroundColor: string;          // Menü arkaplanı
  activeMenuBackgroundColor: string;    // Aktif menü arkaplanı
  activeMenuColor: string;              // Aktif menü rengi
  titleBackground: string;              // Başlık arkaplanı
  submitButtonBackgroundColor: string;  // Gönder butonu rengi
  avatarBorderColor?: string;           // Avatar border rengi
  linkBackgroundColor: string;          // Link arkaplanı
  labelColor: string;                   // Label rengi
  jobColor: string;                     // İş unvanı rengi
  addCompanyButton?: string;            // Şirket ekle butonu
  selectedMenuItem?: string;            // Seçili menü öğesi
}
```

### Mevcut Temalar

1. **default** - Varsayılan koyu mavi tema
2. **forest** - Orman yeşili tema
3. **ocean** - Okyanus mavisi tema
4. **sunset** - Günbatımı turuncu tema
5. **lavender** - Lavanta mor tema
6. **desert** - Çöl kahverengi tema
7. **aurora** - Aurora tema
8. **coral** - Mercan tema
9. **mint** - Nane yeşili tema

---

## 💻 Kullanım Örnekleri

### 1. Temel Kullanım

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>
        Merhaba Dünya!
      </Text>
      <View style={[styles.card, { backgroundColor: theme.headerBackgroundColor }]}>
        <Text style={{ color: theme.labelColor }}>
          Bu bir kart
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
});
```

### 2. Button Component

```tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary' }) => {
  const theme = useTheme();

  const backgroundColor = variant === 'primary' 
    ? theme.submitButtonBackgroundColor 
    : theme.linkBackgroundColor;

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: theme.textColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 3. Screen Component

```tsx
import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const MyScreen = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <View style={[styles.header, { backgroundColor: theme.headerBackgroundColor }]}>
        {/* Header içeriği */}
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Sayfa içeriği */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
  },
});
```

---

## 🌐 API İşlemleri

### Tema Listesini Çekme

```tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllThemes } from '../redux/slices/ThemeSlice';

const ThemeSelector = () => {
  const dispatch = useDispatch();
  const { themes, isLoading } = useSelector((state) => state.theme);

  useEffect(() => {
    const controller = new AbortController();
    dispatch(getAllThemes({ signal: controller.signal }));

    return () => controller.abort();
  }, []);

  // ... render
};
```

### Tema Seçme ve Uygulama

```tsx
import { useDispatch } from 'react-redux';
import { getTheme } from '../redux/slices/ThemeSlice';

const ThemeSelector = () => {
  const dispatch = useDispatch();

  const handleSelectTheme = (themeId: number) => {
    const controller = new AbortController();
    dispatch(getTheme({ id: themeId, signal: controller.signal }));
  };

  return (
    // ... theme list
  );
};
```

### Yerel Tema Kullanma

```tsx
import { useDispatch } from 'react-redux';
import { setLocalTheme } from '../redux/slices/ThemeSlice';

const ThemeSelector = () => {
  const dispatch = useDispatch();

  const handleSelectLocalTheme = (themeName: string) => {
    // 'default', 'forest', 'ocean', vb.
    dispatch(setLocalTheme(themeName));
  };

  return (
    // ... theme list
  );
};
```

---

## 🔗 Connection & Contact İşlemleri

### Connection İşlemleri

#### Bağlantı Kabul Etme

```tsx
import { useDispatch } from 'react-redux';
import { acceptConnection } from '../redux/slices/ConnectionsSlice';

const handleAccept = (connectionId: number) => {
  dispatch(acceptConnection({ connectionId }));
};
```

#### Bağlantı Reddetme

```tsx
import { declineConnection } from '../redux/slices/ConnectionsSlice';

const handleDecline = (connectionId: number) => {
  dispatch(declineConnection({ connectionId }));
};
```

#### Kullanıcı Engelleme

```tsx
import { blockConnection } from '../redux/slices/ConnectionsSlice';

const handleBlock = (connectionId: number) => {
  dispatch(blockConnection({ connectionId }));
};
```

#### Bağlantı Silme

```tsx
import { deleteConnection } from '../redux/slices/ConnectionsSlice';

const handleDelete = (connectionId: number) => {
  dispatch(deleteConnection({ connectionId }));
};
```

### Contact İşlemleri

#### Contact Silme

```tsx
import { useDispatch } from 'react-redux';
import { deleteContact } from '../redux/slices/ContactsSlice';

const handleDeleteContact = (contactId: number) => {
  dispatch(deleteContact({ contactId }));
};
```

#### Örnek Kullanım (Tam Component)

```tsx
import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getConnections } from '../redux/slices/ConnectionsSlice';
import ConnectionCard from '../components/ConnectionCard';
import { useTheme } from '../hooks/useTheme';

const ConnectionsScreen = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { data, isLoading, actionLoading } = useSelector(
    (state) => state.connections
  );
  const cardId = 1; // Kullanıcının kart ID'si

  useEffect(() => {
    dispatch(getConnections({ cardId }));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ConnectionCard 
            connection={item}
            isReceived={true}
            actionLoading={actionLoading}
          />
        )}
      />
    </View>
  );
};
```

---

## 📝 Notlar

### AsyncStorage Kullanımı
- Tema tercihi AsyncStorage'da `theme` key'i ile saklanır
- Tam tema bilgisi `themeData` key'i ile saklanır
- Uygulama her açıldığında son seçilen tema otomatik yüklenir

### Redux State Yapısı

```typescript
// Theme State
{
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  themes: any[];
  themeDetail: ThemeDetail | null;
  currentTheme: Theme;
  themeName: string;
}

// Connections State
{
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: Connection[];
  actionLoading: boolean;
}

// Contacts State
{
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  message: string;
  data: Contact[];
  actionLoading: boolean;
}
```

### Best Practices

1. **Tema Hooks Kullanın**: `useTheme()` hook'unu her component'te selector yazmak yerine kullanın
2. **StyleSheet ile Birleştirin**: Statik stilleri StyleSheet'te, dinamik renkleri inline olarak kullanın
3. **Loading States**: API işlemlerinde loading state'leri kontrol edin
4. **Error Handling**: Hata durumlarında kullanıcıya bilgi verin
5. **Optimistic Updates**: State güncellemeleri anında UI'a yansıtılır

---

## 🎓 Daha Fazla Örnek

### Tam Sayfa Örneği

```tsx
import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  RefreshControl,
  SafeAreaView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { getContacts } from '../redux/slices/ContactsSlice';
import ContactCard from '../components/ContactCard';

const ContactsScreen = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { data, isLoading, actionLoading } = useSelector(
    (state) => state.contacts
  );
  const cardId = 1;

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    dispatch(getContacts({ cardId }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.headerBackgroundColor }]}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Kişilerim
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.labelColor }]}>
          {data.length} kişi
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ContactCard 
            contact={item}
            actionLoading={actionLoading}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadContacts}
            tintColor={theme.primaryColor}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.labelColor }]}>
              Henüz kişi bulunmuyor
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default ContactsScreen;
```

---

## 🐛 Sorun Giderme

### Tema Yüklenmiyor
- AsyncStorage'da kayıtlı tema var mı kontrol edin
- `loadStoredTheme()` dispatch edildiğinden emin olun
- Redux DevTools ile state'i kontrol edin

### Renkler Doğru Görünmüyor
- `useTheme()` hook'unun component içinde çağrıldığından emin olun
- Theme prop'larının doğru property isimlerini kullanın

### API Hataları
- Network bağlantısını kontrol edin
- API endpoint'lerinin doğru olduğundan emin olun
- Error state'lerini kontrol edin

---

## 📚 Referanslar

- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Güncelleme Tarihi**: 2024
**Versiyon**: 1.0.0
