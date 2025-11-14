import Toast from 'react-native-toast-message';

export default function handleErrors(error: any) {
  const status = error?.response?.status;

  switch (status) {
    case 401:
      Toast.show({
        type: 'error',
        text1: 'Oturum Süresi Doldu',
        text2: 'Lütfen tekrar giriş yapın 🔒',
      });
      break;

    case 403:
      Toast.show({
        type: 'error',
        text1: 'Yetkisiz',
        text2: 'Bu işlemi yapmaya yetkiniz yok ⛔',
      });
      break;

    case 500:
      Toast.show({
        type: 'error',
        text1: 'Sunucu Hatası',
        text2: 'Lütfen daha sonra deneyin 💥',
      });
      break;

    default:
      // Ağ hatası (örn. fetch failed)
      if (!error.response) {
        Toast.show({
          type: 'error',
          text1: 'Bağlantı Hatası',
          text2: 'Sunucuya ulaşılamadı 📡',
        });
      }
      break;
  }
}
