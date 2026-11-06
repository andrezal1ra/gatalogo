import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Linking, Pressable, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breed, breedImage, fetchBreeds } from './src/api';

const palette = { bg: '#FFF9F5', ink: '#302A35', muted: '#857E88', pink: '#FCE0E7', accent: '#D95580', white: '#FFFFFF', line: '#F0E7E8' };
const scoreLabels: [keyof Breed, string][] = [['affection_level', 'Carinho'], ['adaptability', 'Adaptação'], ['energy_level', 'Energia'], ['intelligence', 'Inteligência'], ['child_friendly', 'Com crianças']];

function Photo({ breed, style }: { breed: Breed; style?: object }) {
  const [failed, setFailed] = useState(false);
  const uri = breedImage(breed);
  useEffect(() => setFailed(false), [uri]);
  if (!uri || failed) return <View style={[styles.photo, styles.photoFallback, style]}><Text style={{ fontSize: 46 }}>🐈</Text></View>;
  return <Image source={{ uri }} style={[styles.photo, style]} resizeMode="cover" onError={() => setFailed(true)} />;
}

export default function App() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [origin, setOrigin] = useState('Todos');
  const [selected, setSelected] = useState<Breed | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError('');
    try { setBreeds(await fetchBreeds()); }
    catch { setError('Não foi possível carregar os gatinhos. Verifique sua conexão e tente novamente.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const origins = useMemo(() => ['Todos', ...Array.from(new Set(breeds.map(b => b.origin).filter(Boolean))).sort()], [breeds]);
  const filtered = useMemo(() => breeds.filter(b => (origin === 'Todos' || b.origin === origin) && `${b.name} ${b.origin} ${b.temperament}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [breeds, origin, query]);

  if (selected) return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.bg} />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <View style={styles.detailTop}><Pressable onPress={() => setSelected(null)} style={styles.back}><Ionicons name="arrow-back" size={23} color={palette.ink}/></Pressable><Text style={styles.detailTopText}>Conheça a raça</Text><Text style={{ fontSize: 23 }}>🐾</Text></View>
        <Photo breed={selected} style={styles.heroPhoto}/>
        <View style={styles.detailBody}>
          <Text style={styles.detailTitle}>{selected.name}</Text>
          <View style={styles.originPill}><Ionicons name="location-outline" size={15} color={palette.accent}/><Text style={styles.originText}>{selected.origin || 'Origem desconhecida'}</Text></View>
          <Text style={styles.sectionTitle}>Sobre a raça</Text><Text style={styles.paragraph}>{selected.description || 'Descrição indisponível.'}</Text>
          <Text style={styles.sectionTitle}>Temperamento</Text><Text style={styles.paragraph}>{selected.temperament || 'Não informado'}</Text>
          <View style={styles.lifeBox}><Ionicons name="heart-outline" size={22} color={palette.accent}/><View><Text style={styles.lifeLabel}>Expectativa de vida</Text><Text style={styles.lifeValue}>{selected.life_span || 'Não informada'} anos</Text></View></View>
          <Text style={styles.sectionTitle}>Características</Text>
          {scoreLabels.map(([key, label]) => typeof selected[key] === 'number' ? <View key={key} style={styles.scoreRow}><Text style={styles.scoreLabel}>{label}</Text><View style={styles.dots}>{[1,2,3,4,5].map(i => <View key={i} style={[styles.dot, i <= (selected[key] as number) && styles.dotOn]}/>)}</View></View> : null)}
          {selected.wikipedia_url ? <Pressable style={styles.wikiButton} onPress={() => Linking.openURL(selected.wikipedia_url!)}><Text style={styles.wikiText}>Saiba mais na Wikipédia</Text><Ionicons name="open-outline" size={17} color={palette.white}/></Pressable> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={palette.bg} />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={palette.accent}/>}
        ListHeaderComponent={<>
          <View style={styles.header}><View><Text style={styles.eyebrow}>SEU UNIVERSO FELINO</Text><Text style={styles.brand}>Gatálogo <Text style={{ color: palette.accent }}>♥</Text></Text></View><View style={styles.paw}><Text style={{ fontSize: 27 }}>🐱</Text></View></View>
          <View style={styles.banner}><View style={{ flex: 1 }}><Text style={styles.bannerTitle}>Apaixone-se por cada gatinho!</Text><Text style={styles.bannerText}>Descubra raças, histórias e curiosidades.</Text></View><Text style={{ fontSize: 65 }}>🐈</Text></View>
          <View style={styles.search}><Ionicons name="search-outline" size={21} color={palette.muted}/><TextInput style={styles.searchInput} placeholder="Busque uma raça..." placeholderTextColor="#A7A0A7" value={query} onChangeText={setQuery} autoCorrect={false}/>{query ? <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={20} color={palette.muted}/></Pressable> : null}</View>
          <Text style={styles.filterTitle}>Filtrar por origem</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }} contentContainerStyle={{ gap: 8 }}>{origins.map(o => <Pressable key={o} onPress={() => setOrigin(o)} style={[styles.chip, origin === o && styles.chipActive]}><Text style={[styles.chipText, origin === o && styles.chipTextActive]}>{o}</Text></Pressable>)}</ScrollView>
          <View style={styles.results}><Text style={styles.resultsTitle}>Explore as raças</Text><Text style={styles.count}>{filtered.length} raças</Text></View>
          {loading && <View style={styles.center}><ActivityIndicator size="large" color={palette.accent}/><Text style={styles.help}>Carregando gatinhos...</Text></View>}
          {!!error && <View style={styles.center}><Text style={styles.help}>{error}</Text><Pressable onPress={() => void load()} style={styles.retry}><Text style={styles.retryText}>Tentar novamente</Text></Pressable></View>}
          {!loading && !error && filtered.length === 0 && <View style={styles.center}><Text style={{ fontSize: 35 }}>🐾</Text><Text style={styles.help}>Nenhuma raça encontrada.</Text></View>}
        </>}
        renderItem={({ item }) => <Pressable onPress={() => setSelected(item)} style={styles.card}><Photo breed={item} style={styles.cardPhoto}/><View style={styles.cardContent}><Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text><Text style={styles.cardOrigin} numberOfLines={1}>📍 {item.origin || 'Desconhecida'}</Text><View style={styles.cardFooter}><Text style={styles.cardMore}>Ver detalhes</Text><Ionicons name="arrow-forward" size={16} color={palette.accent}/></View></View></Pressable>}
        ListFooterComponent={<Text style={styles.footer}>Feito com ♥ e TheCatAPI</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg, paddingTop: 0 }, list: { paddingHorizontal: 18, paddingTop: 22, paddingBottom: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, eyebrow: { color: palette.accent, fontWeight: '800', fontSize: 10, letterSpacing: 2 }, brand: { color: palette.ink, fontSize: 31, fontWeight: '900', marginTop: 3 }, paw: { backgroundColor: palette.pink, borderRadius: 18, padding: 13 },
  banner: { backgroundColor: '#F9DFE6', borderRadius: 24, padding: 19, flexDirection: 'row', alignItems: 'center', marginBottom: 23, minHeight: 142 }, bannerTitle: { fontSize: 21, fontWeight: '900', color: palette.ink, lineHeight: 27 }, bannerText: { color: '#7E6570', fontSize: 12, lineHeight: 18, marginTop: 9 },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: palette.white, borderRadius: 16, paddingHorizontal: 15, height: 54, marginBottom: 22, borderWidth: 1, borderColor: palette.line }, searchInput: { flex: 1, paddingHorizontal: 11, color: palette.ink, fontSize: 14 }, filterTitle: { fontSize: 14, fontWeight: '800', marginBottom: 12, color: palette.ink },
  chip: { paddingHorizontal: 17, paddingVertical: 10, borderRadius: 30, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line }, chipActive: { backgroundColor: palette.accent, borderColor: palette.accent }, chipText: { color: palette.muted, fontWeight: '700', fontSize: 12 }, chipTextActive: { color: palette.white },
  results: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }, resultsTitle: { fontSize: 20, fontWeight: '900', color: palette.ink }, count: { color: palette.muted, fontSize: 12 }, columns: { gap: 12, marginBottom: 12 },
  card: { flex: 1, minWidth: 0, backgroundColor: palette.white, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: palette.line }, photo: { backgroundColor: palette.pink }, photoFallback: { alignItems: 'center', justifyContent: 'center' }, cardPhoto: { width: '100%', height: 150 }, cardContent: { padding: 12 }, cardTitle: { fontSize: 15, fontWeight: '900', color: palette.ink }, cardOrigin: { fontSize: 11, color: palette.muted, marginTop: 5 }, cardFooter: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, cardMore: { color: palette.accent, fontSize: 11, fontWeight: '800' },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 35, gap: 12 }, help: { textAlign: 'center', color: palette.muted, lineHeight: 21 }, retry: { backgroundColor: palette.accent, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 }, retryText: { color: palette.white, fontWeight: '800' }, footer: { textAlign: 'center', marginTop: 18, color: palette.muted, fontSize: 11 },
  detailTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 15 }, back: { backgroundColor: palette.white, padding: 10, borderRadius: 14 }, detailTopText: { fontWeight: '900', fontSize: 16, color: palette.ink }, heroPhoto: { width: '100%', height: 290 }, detailBody: { paddingHorizontal: 23, paddingTop: 24 }, detailTitle: { fontSize: 32, fontWeight: '900', color: palette.ink }, originPill: { flexDirection: 'row', gap: 6, alignItems: 'center', alignSelf: 'flex-start', backgroundColor: palette.pink, borderRadius: 25, paddingVertical: 8, paddingHorizontal: 12, marginTop: 12 }, originText: { color: palette.accent, fontWeight: '800', fontSize: 12 }, sectionTitle: { fontSize: 18, fontWeight: '900', color: palette.ink, marginTop: 27, marginBottom: 9 }, paragraph: { color: '#706974', fontSize: 14, lineHeight: 23 }, lifeBox: { marginTop: 25, flexDirection: 'row', gap: 13, alignItems: 'center', padding: 18, backgroundColor: palette.pink, borderRadius: 17 }, lifeLabel: { color: '#7E6570', fontSize: 12 }, lifeValue: { color: palette.ink, fontSize: 17, fontWeight: '900', marginTop: 3 }, scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 9 }, scoreLabel: { color: palette.ink, fontSize: 14 }, dots: { flexDirection: 'row', gap: 6 }, dot: { width: 13, height: 13, borderRadius: 7, backgroundColor: '#EDE3E7' }, dotOn: { backgroundColor: palette.accent }, wikiButton: { marginTop: 28, backgroundColor: palette.accent, borderRadius: 15, padding: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 }, wikiText: { color: palette.white, fontWeight: '800' }
});
