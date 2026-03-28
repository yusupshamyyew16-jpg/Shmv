import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useDrawer } from "@/context/DrawerContext";
import { t, Lang } from "@/constants/i18n";

const WHATSAPP_NUMBER = "+99362000000";
const TELEGRAM_USERNAME = "isbazary_tm";

export default function SettingsScreen() {
  const { colors, dark, toggleDark } = useTheme();
  const { lang, setLang } = useLanguage();
  const { toggleDrawer } = useDrawer();
  const insets = useSafeAreaInsets();

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleToggleDark = () => {
    Haptics.selectionAsync();
    toggleDark();
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("", lang === "tm" ? "WhatsApp açylyp bilinmedi" : "Не удалось открыть WhatsApp")
    );
  };

  const openTelegram = () => {
    const url = `https://t.me/${TELEGRAM_USERNAME}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("", lang === "tm" ? "Telegram açylyp bilinmedi" : "Не удалось открыть Telegram")
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPadding + 10, paddingBottom: bottomPadding + 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuBtn} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("settings", lang)}</Text>
      </View>

      {/* Appearance section */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("appearance", lang)}</Text>
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        {/* Dark mode toggle */}
        <View style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
          <View style={[styles.iconBox, { backgroundColor: dark ? "#2C2C2C" : "#1A1A1A22" }]}>
            <Ionicons name={dark ? "moon" : "moon-outline"} size={20} color={dark ? "#A78BFA" : colors.textSecondary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t("darkMode", lang)}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>
              {dark
                ? (lang === "tm" ? "Açyk" : "Включён")
                : (lang === "tm" ? "Ýapyk" : "Выключен")}
            </Text>
          </View>
          <Switch
            value={dark}
            onValueChange={handleToggleDark}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={dark ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>

        {/* Language */}
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="language-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t("language", lang)}</Text>
          </View>
          <View style={styles.langToggle}>
            {(["tm", "ru"] as Lang[]).map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langBtn,
                  {
                    backgroundColor: lang === l ? colors.primary : colors.inputBg,
                    borderColor: lang === l ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => { Haptics.selectionAsync(); setLang(l); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.langText, { color: lang === l ? "#fff" : colors.textSecondary }]}>
                  {l === "tm" ? "TM" : "RU"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Contact section */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("contactUs", lang)}</Text>
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <TouchableOpacity
          style={[styles.contactRow, { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
          onPress={openWhatsApp}
          activeOpacity={0.8}
        >
          <View style={[styles.iconBox, { backgroundColor: "#25D36622" }]}>
            <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>WhatsApp</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>{WHATSAPP_NUMBER}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactRow} onPress={openTelegram} activeOpacity={0.8}>
          <View style={[styles.iconBox, { backgroundColor: "#229ED922" }]}>
            <MaterialCommunityIcons name="telegram" size={22} color="#229ED9" />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Telegram</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>@{TELEGRAM_USERNAME}</Text>
          </View>
          <Ionicons name="open-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* App info */}
      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t("appInfo", lang)}</Text>
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>{t("version", lang)}</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>1.0.0</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>
        © 2026 Iş Bazary{"\n"}
        {lang === "tm" ? "Türkmenistanyň iş bazary" : "Рынок труда Туркменистана"}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 18, marginBottom: 20 },
  menuBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 6,
  },
  section: {
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rowSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  langToggle: { flexDirection: "row", gap: 6 },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  langText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 10,
    lineHeight: 18,
  },
});