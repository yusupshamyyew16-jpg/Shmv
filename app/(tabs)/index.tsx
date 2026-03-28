import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";

import { SAMPLE_LISTINGS, JOB_CATEGORIES, Listing } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";
import { t } from "@/constants/i18n";
import ListingCard from "@/components/ListingCard";
import FilterBar from "@/components/FilterBar";

export default function JobsScreen() {
  const { lang } = useLanguage();
  const { colors } = useTheme();
  const { toggleDrawer } = useDrawer();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const jobs = useMemo(() => SAMPLE_LISTINGS.filter((l) => l.type === "job"), []);

  const filtered = useMemo(() => {
    return jobs.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch = !q || l.title.toLowerCase().includes(q) || l.titleRu.toLowerCase().includes(q);
      const matchCat = !selectedCategory || l.categoryId === selectedCategory;
      const matchRegion = !selectedRegion || l.region === selectedRegion;
      const matchDistrict = !selectedDistrict || l.district === selectedDistrict;
      return matchSearch && matchCat && matchRegion && matchDistrict;
    });
  }, [jobs, search, selectedCategory, selectedRegion, selectedDistrict]);

  const handlePress = (item: Listing) => {
    Haptics.selectionAsync();
    router.push({ pathname: "/listing/[id]", params: { id: item.id } });
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuBtn} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t("jobs", lang)}</Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {filtered.length} {lang === "tm" ? "yglan" : "объявлений"}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={17} color={colors.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t("search", lang)}
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={17} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[styles.catChip, { backgroundColor: !selectedCategory ? colors.primary : colors.card, borderColor: !selectedCategory ? colors.primary : colors.border }]}
          onPress={() => setSelectedCategory("")}
          activeOpacity={0.8}
        >
          <Text style={[styles.catText, { color: !selectedCategory ? "#fff" : colors.textSecondary }]}>
            {t("all", lang)}
          </Text>
        </TouchableOpacity>
        {JOB_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(active ? "" : cat.id);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={cat.icon as any} size={13} color={active ? "#fff" : colors.textSecondary} />
              <Text style={[styles.catText, { color: active ? "#fff" : colors.textSecondary }]}>
                {lang === "tm" ? cat.tm : cat.ru}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FilterBar
        selectedRegion={selectedRegion}
        selectedDistrict={selectedDistrict}
        onRegionChange={setSelectedRegion}
        onDistrictChange={setSelectedDistrict}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => handlePress(item)} />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 100 + (Platform.OS === "web" ? 34 : insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="briefcase-outline" size={44} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>{t("noResults", lang)}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 12,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitles: { flex: 1, flexDirection: "row", alignItems: "baseline", gap: 8 },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 2,
    paddingHorizontal: 13,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  categoriesScroll: { flexGrow: 0 },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  catText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  list: { paddingTop: 4 },
  emptyBox: { alignItems: "center", paddingTop: 70, gap: 10 },
  emptyText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});