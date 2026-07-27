import React, { useMemo, useState } from 'react'
import { View, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { useTheme, Text } from '@vyve/ui-native'
import LinearGradient from 'react-native-linear-gradient'
import RestaurantIcon from '../../assets/icons/restaurant.svg'

const categories = [
  { id: '1', title: 'Kahve' },
  { id: '2', title: 'Soğuk' },
  { id: '3', title: 'Tatlı' },
  { id: '4', title: 'Atıştırmalık' },
]

const initialProducts = [
  // ☕ KAHVE
  {
    id: 'coffee-1',
    title: 'Espresso',
    desc: 'Yoğun aromalı tek shot espresso.',
    price: 110,
    count: 0,
    image: 'https://picsum.photos/200/200?espresso',
    categoryId: '1',
  },
  {
    id: 'coffee-2',
    title: 'Double Espresso',
    desc: 'Çift shot güçlü espresso.',
    price: 135,
    count: 0,
    image: 'https://picsum.photos/200/200?doubleespresso',
    categoryId: '1',
  },
  {
    id: 'coffee-3',
    title: 'Americano',
    desc: 'Espresso ve sıcak su dengesi.',
    price: 125,
    count: 0,
    image: 'https://picsum.photos/200/200?americano',
    categoryId: '1',
  },
  {
    id: 'coffee-4',
    title: 'Cappuccino',
    desc: 'Süt köpüğü ile klasik İtalyan kahvesi.',
    price: 145,
    count: 0,
    image: 'https://picsum.photos/200/200?cappuccino',
    categoryId: '1',
  },
  {
    id: 'coffee-5',
    title: 'Latte',
    desc: 'Yumuşak içimli sütlü espresso.',
    price: 150,
    count: 0,
    image: 'https://picsum.photos/200/200?latte',
    categoryId: '1',
  },
  {
    id: 'coffee-6',
    title: 'Flat White',
    desc: 'İnce süt dokulu yoğun kahve.',
    price: 155,
    count: 0,
    image: 'https://picsum.photos/200/200?flatwhite',
    categoryId: '1',
  },
  {
    id: 'coffee-7',
    title: 'Mocha',
    desc: 'Çikolata ve espresso birleşimi.',
    price: 165,
    count: 0,
    image: 'https://picsum.photos/200/200?mocha',
    categoryId: '1',
  },
  {
    id: 'coffee-8',
    title: 'Macchiato',
    desc: 'Espresso üzerine az süt köpüğü.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?macchiato',
    categoryId: '1',
  },
  {
    id: 'coffee-9',
    title: 'Türk Kahvesi',
    desc: 'Geleneksel ince köpüklü kahve.',
    price: 95,
    count: 0,
    image: 'https://picsum.photos/200/200?turkkahvesi',
    categoryId: '1',
  },
  {
    id: 'coffee-10',
    title: 'Sütlü Türk Kahvesi',
    desc: 'Klasik kahvenin sütlü yorumu.',
    price: 105,
    count: 0,
    image: 'https://picsum.photos/200/200?sutluturk',
    categoryId: '1',
  },
  {
    id: 'coffee-11',
    title: 'Cold Brew',
    desc: '12 saat demleme soğuk kahve.',
    price: 160,
    count: 0,
    image: 'https://picsum.photos/200/200?coldbrew',
    categoryId: '1',
  },
  {
    id: 'coffee-12',
    title: 'V60 Filtre Kahve',
    desc: 'El demleme filtre kahve.',
    price: 140,
    count: 0,
    image: 'https://picsum.photos/200/200?v60',
    categoryId: '1',
  },
  {
    id: 'coffee-13',
    title: 'Chemex',
    desc: 'Temiz ve aromatik filtre kahve.',
    price: 150,
    count: 0,
    image: 'https://picsum.photos/200/200?chemex',
    categoryId: '1',
  },
  {
    id: 'coffee-14',
    title: 'Irish Coffee',
    desc: 'Kahve ve aromatik karışım (alkolsüz versiyon).',
    price: 175,
    count: 0,
    image: 'https://picsum.photos/200/200?irishcoffee',
    categoryId: '1',
  },
  {
    id: 'coffee-15',
    title: 'Hazelnut Latte',
    desc: 'Fındık aromalı latte.',
    price: 165,
    count: 0,
    image: 'https://picsum.photos/200/200?hazelnutlatte',
    categoryId: '1',
  },
  {
    id: 'coffee-16',
    title: 'Caramel Macchiato',
    desc: 'Karamel dokunuşlu sütlü kahve.',
    price: 170,
    count: 0,
    image: 'https://picsum.photos/200/200?caramelmacchiato',
    categoryId: '1',
  },

  // 🧊 SOĞUK
  {
    id: 'cold-1',
    title: 'Ice Latte',
    desc: 'Soğuk süt ve espresso.',
    price: 160,
    count: 0,
    image: 'https://picsum.photos/200/200?icelatte',
    categoryId: '2',
  },
  {
    id: 'cold-2',
    title: 'Ice Americano',
    desc: 'Buzlu klasik Americano.',
    price: 140,
    count: 0,
    image: 'https://picsum.photos/200/200?iceamericano',
    categoryId: '2',
  },
  {
    id: 'cold-3',
    title: 'Limonata',
    desc: 'Taze sıkım ferah limonata.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?limonata',
    categoryId: '2',
  },
  {
    id: 'cold-4',
    title: 'Çilekli Smoothie',
    desc: 'Taze çilekli yoğun smoothie.',
    price: 180,
    count: 0,
    image: 'https://picsum.photos/200/200?strawberrysmoothie',
    categoryId: '2',
  },
  {
    id: 'cold-5',
    title: 'Mango Smoothie',
    desc: 'Tropikal mango lezzeti.',
    price: 185,
    count: 0,
    image: 'https://picsum.photos/200/200?mango',
    categoryId: '2',
  },
  {
    id: 'cold-6',
    title: 'Ice Mocha',
    desc: 'Çikolatalı buzlu kahve.',
    price: 175,
    count: 0,
    image: 'https://picsum.photos/200/200?icemocha',
    categoryId: '2',
  },
  {
    id: 'cold-7',
    title: 'Iced Tea',
    desc: 'Soğuk demlenmiş çay.',
    price: 110,
    count: 0,
    image: 'https://picsum.photos/200/200?icedtea',
    categoryId: '2',
  },
  {
    id: 'cold-8',
    title: 'Şeftali Ice Tea',
    desc: 'Şeftali aromalı buzlu çay.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?peachtea',
    categoryId: '2',
  },
  {
    id: 'cold-9',
    title: 'Cold Brew Tonic',
    desc: 'Tonik ve cold brew karışımı.',
    price: 190,
    count: 0,
    image: 'https://picsum.photos/200/200?tonic',
    categoryId: '2',
  },
  {
    id: 'cold-10',
    title: 'Milkshake Vanilya',
    desc: 'Klasik vanilyalı milkshake.',
    price: 170,
    count: 0,
    image: 'https://picsum.photos/200/200?milkshake',
    categoryId: '2',
  },
  {
    id: 'cold-11',
    title: 'Frappe',
    desc: 'Köpüklü soğuk kahve.',
    price: 160,
    count: 0,
    image: 'https://picsum.photos/200/200?frappe',
    categoryId: '2',
  },
  {
    id: 'cold-12',
    title: 'Energy Drink',
    desc: 'Kafein destekli enerji içeceği.',
    price: 130,
    count: 0,
    image: 'https://picsum.photos/200/200?energy',
    categoryId: '2',
  },
  {
    id: 'cold-13',
    title: 'Kola',
    desc: 'Soğuk gazlı içecek.',
    price: 95,
    count: 0,
    image: 'https://picsum.photos/200/200?cola',
    categoryId: '2',
  },
  {
    id: 'cold-14',
    title: 'Soda',
    desc: 'Doğal maden suyu.',
    price: 70,
    count: 0,
    image: 'https://picsum.photos/200/200?soda',
    categoryId: '2',
  },
  {
    id: 'cold-15',
    title: 'Meyveli Soda',
    desc: 'Limon aromalı soda.',
    price: 85,
    count: 0,
    image: 'https://picsum.photos/200/200?fruit',
    categoryId: '2',
  },
  {
    id: 'cold-16',
    title: 'Ayran',
    desc: 'Geleneksel soğuk içecek.',
    price: 80,
    count: 0,
    image: 'https://picsum.photos/200/200?ayran',
    categoryId: '2',
  },
  // 🍰 TATLI
  {
    id: 'dessert-1',
    title: 'San Sebastian Cheesecake',
    desc: 'Yanık üst dokulu, kremsi cheesecake.',
    price: 240,
    count: 0,
    image: 'https://picsum.photos/200/200?cheesecake',
    categoryId: '3',
  },
  {
    id: 'dessert-2',
    title: 'Tiramisu',
    desc: 'İtalyan klasik kahveli tatlı.',
    price: 220,
    count: 0,
    image: 'https://picsum.photos/200/200?tiramisu',
    categoryId: '3',
  },
  {
    id: 'dessert-3',
    title: 'Brownie',
    desc: 'Yoğun çikolatalı sıcak brownie.',
    price: 180,
    count: 0,
    image: 'https://picsum.photos/200/200?brownie',
    categoryId: '3',
  },
  {
    id: 'dessert-4',
    title: 'Cookie',
    desc: 'Çikolata parçacıklı taze kurabiye.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?cookie',
    categoryId: '3',
  },
  {
    id: 'dessert-5',
    title: 'Waffle',
    desc: 'Meyve ve çikolata soslu waffle.',
    price: 260,
    count: 0,
    image: 'https://picsum.photos/200/200?waffle',
    categoryId: '3',
  },
  {
    id: 'dessert-6',
    title: 'Profiterol',
    desc: 'Çikolata soslu mini toplar.',
    price: 210,
    count: 0,
    image: 'https://picsum.photos/200/200?profiterol',
    categoryId: '3',
  },
  {
    id: 'dessert-7',
    title: 'Sufle',
    desc: 'Akışkan çikolatalı sıcak sufle.',
    price: 230,
    count: 0,
    image: 'https://picsum.photos/200/200?sufle',
    categoryId: '3',
  },
  {
    id: 'dessert-8',
    title: 'Magnolia',
    desc: 'Bisküvi ve muzlu sütlü tatlı.',
    price: 200,
    count: 0,
    image: 'https://picsum.photos/200/200?magnolia',
    categoryId: '3',
  },
  {
    id: 'dessert-9',
    title: 'Ekler',
    desc: 'Kremalı klasik ekler.',
    price: 150,
    count: 0,
    image: 'https://picsum.photos/200/200?ekler',
    categoryId: '3',
  },
  {
    id: 'dessert-10',
    title: 'Pasta Dilimi',
    desc: 'Günlük taze pasta.',
    price: 190,
    count: 0,
    image: 'https://picsum.photos/200/200?cake',
    categoryId: '3',
  },
  {
    id: 'dessert-11',
    title: 'Dondurma (3 top)',
    desc: 'Vanilya, çikolata, çilek.',
    price: 160,
    count: 0,
    image: 'https://picsum.photos/200/200?icecream',
    categoryId: '3',
  },
  {
    id: 'dessert-12',
    title: 'Kazandibi',
    desc: 'Karamelize sütlü tatlı.',
    price: 170,
    count: 0,
    image: 'https://picsum.photos/200/200?kazandibi',
    categoryId: '3',
  },
  {
    id: 'dessert-13',
    title: 'Fırın Sütlaç',
    desc: 'Geleneksel sütlü tatlı.',
    price: 160,
    count: 0,
    image: 'https://picsum.photos/200/200?sutlac',
    categoryId: '3',
  },
  {
    id: 'dessert-14',
    title: 'Cheesecake Berry',
    desc: 'Orman meyveli cheesecake.',
    price: 250,
    count: 0,
    image: 'https://picsum.photos/200/200?berrycheesecake',
    categoryId: '3',
  },
  {
    id: 'dessert-15',
    title: 'Baklava',
    desc: 'Antep fıstıklı klasik baklava.',
    price: 280,
    count: 0,
    image: 'https://picsum.photos/200/200?baklava',
    categoryId: '3',
  },
  {
    id: 'dessert-16',
    title: 'Trileçe',
    desc: 'Süt şerbetli hafif tatlı.',
    price: 210,
    count: 0,
    image: 'https://picsum.photos/200/200?trilece',
    categoryId: '3',
  },
  // 🥐 ATIŞTIRMALIK
  {
    id: 'snack-1',
    title: 'Tost',
    desc: 'Kaşarlı klasik tost.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?tost',
    categoryId: '4',
  },
  {
    id: 'snack-2',
    title: 'Kaşarlı Sandviç',
    desc: 'Taze ekmek arası kaşar.',
    price: 130,
    count: 0,
    image: 'https://picsum.photos/200/200?sandwich',
    categoryId: '4',
  },
  {
    id: 'snack-3',
    title: 'Patates Kızartması',
    desc: 'Çıtır golden fries.',
    price: 110,
    count: 0,
    image: 'https://picsum.photos/200/200?fries',
    categoryId: '4',
  },
  {
    id: 'snack-4',
    title: 'Soğan Halkası',
    desc: 'Altın çıtır halka soğan.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?onion',
    categoryId: '4',
  },
  {
    id: 'snack-5',
    title: 'Nugget',
    desc: '6’lı tavuk nugget.',
    price: 140,
    count: 0,
    image: 'https://picsum.photos/200/200?nugget',
    categoryId: '4',
  },
  {
    id: 'snack-6',
    title: 'Chicken Wrap',
    desc: 'Tavuklu dürüm.',
    price: 180,
    count: 0,
    image: 'https://picsum.photos/200/200?wrap',
    categoryId: '4',
  },
  {
    id: 'snack-7',
    title: 'Club Sandwich',
    desc: 'Katmanlı tavuklu sandviç.',
    price: 200,
    count: 0,
    image: 'https://picsum.photos/200/200?club',
    categoryId: '4',
  },
  {
    id: 'snack-8',
    title: 'Mini Pizza',
    desc: 'Tek kişilik pizza.',
    price: 190,
    count: 0,
    image: 'https://picsum.photos/200/200?pizza',
    categoryId: '4',
  },
  {
    id: 'snack-9',
    title: 'Burger',
    desc: 'Cheeseburger klasik.',
    price: 210,
    count: 0,
    image: 'https://picsum.photos/200/200?burger',
    categoryId: '4',
  },
  {
    id: 'snack-10',
    title: 'Cheese Burger',
    desc: 'Double peynirli burger.',
    price: 230,
    count: 0,
    image: 'https://picsum.photos/200/200?cheeseburger',
    categoryId: '4',
  },
  {
    id: 'snack-11',
    title: 'Sosisli',
    desc: 'Ketçaplı klasik sosisli.',
    price: 130,
    count: 0,
    image: 'https://picsum.photos/200/200?hotdog',
    categoryId: '4',
  },
  {
    id: 'snack-12',
    title: 'Karışık Tost',
    desc: 'Sucuk & kaşar tost.',
    price: 150,
    count: 0,
    image: 'https://picsum.photos/200/200?mix',
    categoryId: '4',
  },
  {
    id: 'snack-13',
    title: 'Humus Tabağı',
    desc: 'Zeytinyağlı humus.',
    price: 140,
    count: 0,
    image: 'https://picsum.photos/200/200?humus',
    categoryId: '4',
  },
  {
    id: 'snack-14',
    title: 'Sigara Böreği',
    desc: 'Çıtır peynirli börek.',
    price: 120,
    count: 0,
    image: 'https://picsum.photos/200/200?borek',
    categoryId: '4',
  },
  {
    id: 'snack-15',
    title: 'Meyve Tabağı',
    desc: 'Mevsim meyveleri.',
    price: 170,
    count: 0,
    image: 'https://picsum.photos/200/200?fruitplate',
    categoryId: '4',
  },
  {
    id: 'snack-16',
    title: 'Kahvaltı Tabağı',
    desc: 'Mini kahvaltı seti.',
    price: 250,
    count: 0,
    image: 'https://picsum.photos/200/200?breakfast',
    categoryId: '4',
  },
]

const CompanyMenuScreen = () => {
  const { theme } = useTheme()

  const [products, setProducts] = useState(initialProducts)
  const [activeCategory, setActiveCategory] = useState('1')

  const increase = (id: string) => {
    setProducts((prev) => prev.map((i) => (i.id === id ? { ...i, count: i.count + 1 } : i)))
  }

  const decrease = (id: string) => {
    setProducts((prev) =>
      prev.map((i) => (i.id === id ? { ...i, count: Math.max(0, i.count - 1) } : i)),
    )
  }

  const filteredProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === activeCategory)
  }, [products, activeCategory])

  const cartSummary = useMemo(() => {
    const selected = products.filter((i) => i.count > 0)
    return {
      totalCount: selected.reduce((a, i) => a + i.count, 0),
      totalPrice: selected.reduce((a, i) => a + i.count * i.price, 0),
    }
  }, [products])

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Image
        source={require('../../assets/images/bg.png')}
        style={{
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}
      />

      <View style={{ flex: 1 }}>
        {/* CATEGORIES */}
        <ScrollView
          horizontal
          
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, padding: 16 }}
        >
          {categories.map((item) => {
            const isActive = item.id === activeCategory

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveCategory(item.id)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  borderRadius: 12,
                  height: 50,
                  marginBottom: 16,
                  // height: 800,
                  borderWidth: 1,
                  borderColor: isActive ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.08)',
                  backgroundColor: isActive ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <Text variant="body1">{item.title}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* INFO CARD */}
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 18,
            borderRadius: 18,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            borderWidth: 1,
            borderColor: 'rgba(168,85,247,0.2)',
            backgroundColor: 'rgba(20,16,30,0.95)',
            overflow: 'hidden',
          }}
        >
          {/* Gradient FIX */}
          <LinearGradient
            colors={['rgba(168,85,247,0.15)', 'transparent']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />

          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(168,85,247,0.12)',
            }}
          >
            <RestaurantIcon width={24} height={24} color="#C084FC" />
          </View>

          <View style={{ flex: 1 }}>
            <Text variant="h6">Kasaya gitmeden sipariş ver</Text>
            <Text variant="body2" style={{ opacity: 0.8, marginTop: 4 }}>
              Masandan kolayca siparişini oluştur.
            </Text>
          </View>
        </View>

        {/* PRODUCTS */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 300 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredProducts.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderRadius: 18,
                marginBottom: 14,
                backgroundColor: 'rgba(255,255,255,0.03)',
                gap: 14,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 16,
                }}
              />

              <View style={{ flex: 1 }}>
                <Text variant="h6">{item.title}</Text>

                <Text variant="body2" style={{ opacity: 0.75, marginTop: 4 }}>
                  {item.desc}
                </Text>

                <Text variant="h5" style={{ marginTop: 8, color: '#A855F7' }}>
                  {item.price} TL
                </Text>
              </View>

              {item.count === 0 ? (
                <TouchableOpacity
                  onPress={() => increase(item.id)}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(168,85,247,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text variant="h4">+</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    width: 130,
                    height: 58,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: 'rgba(168,85,247,0.35)',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => decrease(item.id)}>
                    <Text variant="h5">−</Text>
                  </TouchableOpacity>

                  <Text variant="body1">{item.count}</Text>

                  <TouchableOpacity onPress={() => increase(item.id)}>
                    <Text variant="h5">+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* CART */}
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 20,
          borderRadius: 22,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(20,16,30,0.98)',
          borderWidth: 1,
          borderColor: 'rgba(168,85,247,0.2)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 54,
              height: 54,
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(168,85,247,0.12)',
            }}
          >
            <Text variant="h5">🛍️</Text>
          </View>

          <View>
            <Text variant="body2">Sepet • {cartSummary.totalCount} ürün</Text>

            <Text variant="h4" style={{ color: '#A855F7' }}>
              {cartSummary.totalPrice} TL
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            paddingHorizontal: 24,
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: '#A855F7',
          }}
        >
          <Text variant="h6">Siparişi Tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CompanyMenuScreen
