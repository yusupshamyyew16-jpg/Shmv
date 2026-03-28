import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { useDrawer } from "@/context/DrawerContext";
import { useTheme } from "@/context/ThemeContext";
import { useProfile } from "@/context/ProfileContext";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/constants/i18n";

const WHATSAPP_NUMBER = "+99362000000";
const TELEGRAM_USERNAME = "isbazary_tm";

type DrawerItem = {
  icon: React.ReactNode;
  labelTm: string;
  labelRu: string;
  onPress: () => void;
  active?: boolean;
  accent?: string;
};

export default function AppDrawer() {
  const { isOpen, closeDrawer, translateX, overlayOpacity, DRAWER_WIDTH } = useDrawer();
  const { colors } = useTheme();
  const { profile } = useProfile();
  const { lang } = useLanguage();
  const insets = useSafeAreaInsets();

  if (!isOpen) return null;

  const navigate = (path: string) => {
    closeDrawer();
    setTimeout(() => router.push(path as any), 100);
  };

  const openWhatsApp = () => {
    closeDrawer();
    const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("", lang === "tm" ? "WhatsApp açylyp bilinmedi" : "Не удалось открыть WhatsApp")
    );
  };

  const openTelegram = () => {
    closeDrawer();
    const url = `https://t.me/${TELEGRAM_USERNAME}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("", lang === "tm" ? "Telegram açylyp bilinmedi" : "Не удалось открыть Telegram")
    );
  };

  const items: DrawerItem[] = [
    {
      icon: <Ionicons name="briefcase-outline" size={22} color={colors.primary} />,
      labelTm: "Iş gözleýärin",
      labelRu: "Ищу работу",
      onPress: () => navigate("/(tabs)/"),
    },
    {
      icon: <Ionicons name="add-circle-outline" size={22} color={colors.success} />,
      labelTm: "Iş berýärin",
      labelRu: "Даю работу",
      onPress: () => navigate("/(tabs)/post-job"),
      accent: colors.success,
    },
    {
      icon: <Feather name="tool" size={20} color={colors.accent} />,
      labelTm: "Ussa hyzmatlary",
      labelRu: "Мастера",
      onPress: () => navigate("/(tabs)/services"),
    },
    {
      icon: <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />,
      labelTm: "Sazlamalar",
      labelRu: "Настройки",
      onPress: () => navigate("/(tabs)/settings"),
    },
  ];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* Overlay */}
      <Animated.View
        style={[styles.overlay, { opacity: overlayOpacity, backgroundColor: colors.overlay }]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Drawer panel */}
      <Animated.View
        style={[
          styles.drawer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: colors.drawerBg,
            transform: [{ translateX }],
            paddingTop: topPad,
            paddingBottom: bottomPad + 16,
            borderRightColor: colors.border,
          },
        ]}
      >
        {/* Header / Profile */}
        <View style={[styles.profileSection, { borderBottomColor: colors.border }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
              {profile.isRegistered && profile.name ? profile.name : (lang === "tm" ? "Myhman" : "Гость")}
            </Text>
            <Text style={[styles.profileSub, { color: colors.textMuted }]} numberOfLines={1}>
              {profile.isRegistered && profile.phone ? profile.phone : (lang === "tm" ? "Hasaba alyňmadyk" : "Не зарегистрирован")}
            </Text>
          </View>
          <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <View style={styles.menuList}>
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.menuItem, { backgroundColor: colors.drawerItem }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.cardAlt }]}>
                {item.icon}
              </View>
              <Text style={[styles.menuLabel, { color: item.accent || colors.text }]}>
                {lang === "tm" ? item.labelTm : item.labelRu}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Contact us */}
        <Text style={[styles.contactTitle, { color: colors.textMuted }]}>
          {lang === "tm" ? "Biz bilen habarlaş" : "Связаться с нами"}
        </Text>

        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: "#25D366" + "22" }]}
          onPress={openWhatsApp}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="whatsapp" size={22} color="#25D366" />
          <Text style={[styles.contactBtnText, { color: "#25D366" }]}>WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: "#229ED9" + "22" }]}
          onPress={openTelegram}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="telegram" size={22} color="#229ED9" />
          <Text style={[styles.contactBtnText, { color: "#229ED9" }]}>Telegram</Text>
        </TouchableOpacity>

        {/* App version */}
        <Text style={[styles.version, { color: colors.textMuted }]}>Iş Bazary v1.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    borderRightWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  profileSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  closeBtn: { padding: 4 },
  menuList: { paddingTop: 10, paddingHorizontal: 12, gap: 2 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_600SemiBold" },
  divider: { height: 1, marginHorizontal: 20, marginVertical: 14 },
  contactTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
  },
  contactBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  version: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 16,
  },
});