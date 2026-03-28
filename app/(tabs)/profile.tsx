import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { EDUCATION_OPTIONS } from "@/constants/data";
import { useLanguage } from "@/context/LanguageContext";
import { useProfile } from "@/context/ProfileContext";
import { useTheme } from "@/context/ThemeContext";
import { useDrawer } from "@/context/DrawerContext";
import { t, Lang } from "@/constants/i18n";

export default function ProfileScreen() {
  const { lang, setLang } = useLanguage();
  const { profile, setProfile } = useProfile();
  const { colors } = useTheme();
  const { toggleDrawer } = useDrawer();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone || "+993 ");
  const [education, setEducation] = useState(profile.education);
  const [showEduModal, setShowEduModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("", t("enterName", lang));
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await setProfile({ name: name.trim(), phone, education, isRegistered: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const selectedEdu = EDUCATION_OPTIONS.find((e) => e.value === education);
  const eduLabel = selectedEdu
    ? lang === "tm" ? selectedEdu.tm : selectedEdu.ru
    : t("selectEducation", lang);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingTop: topPadding + 10, paddingBottom: bottomPadding + 100 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuBtn} activeOpacity={0.7}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("myProfile", lang)}</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarBox}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Ionicons name="person" size={36} color="#FFFFFF" />
        </View>
        {profile.isRegistered && (
          <View style={[styles.verifiedBadge, { backgroundColor: colors.card }]}>
            <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          </View>
        )}
        {profile.name ? (
          <Text style={[styles.avatarName, { color: colors.text }]}>{profile.name}</Text>
        ) : null}
      </View>

      {/* Language switcher */}
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("language", lang)}</Text>
        <View style={styles.langRow}>
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
                {l === "tm" ? t("turkmen", lang) : t("russian", lang)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Registration form */}
      <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("register", lang)}</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t("name", lang)}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            placeholder={t("enterName", lang)}
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t("phone", lang)}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]}
            placeholder="+993 6X XXXXXX"
            placeholderTextColor={colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{t("education", lang)}</Text>
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={() => setShowEduModal(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.selectorText, { color: education ? colors.text : colors.textMuted }]}>
              {eduLabel}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: saved ? colors.success : colors.primary }]}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name={saved ? "checkmark-circle" : "save-outline"} size={20} color="#fff" />
          <Text style={styles.saveBtnText}>
            {saved ? t("profileSaved", lang) : t("save", lang)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Education picker modal */}
      <Modal
        visible={showEduModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEduModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t("education", lang)}</Text>
            <TouchableOpacity onPress={() => setShowEduModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          {EDUCATION_OPTIONS.map((edu) => (
            <TouchableOpacity
              key={edu.value}
              style={[
                styles.optionRow,
                {
                  backgroundColor: education === edu.value ? colors.primaryLight : colors.card,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => { setEducation(edu.value); setShowEduModal(false); }}
            >
              <Text style={[styles.optionText, { color: education === edu.value ? colors.primary : colors.text }]}>
                {lang === "tm" ? edu.tm : edu.ru}
              </Text>
              {education === edu.value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 18, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  menuBtn: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 26, fontFamily: "Inter_700Bold" },
  avatarBox: { alignItems: "center", gap: 10, marginBottom: 6, position: "relative" },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center" },
  verifiedBadge: { position: "absolute", bottom: 26, right: "36%", borderRadius: 12 },
  avatarName: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 4 },
  section: {
    borderRadius: 16,
    padding: 18,
    gap: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  langRow: { flexDirection: "row", gap: 10 },
  langBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: "center" },
  langText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  field: { gap: 6 },
  label: { fontSize: 12, fontFamily: "Inter_500Medium" },
  input: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
  },
  selector: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  selectorText: { fontSize: 15, fontFamily: "Inter_400Regular" },
  saveBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  modalContainer: { flex: 1, paddingTop: 20 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 15, fontFamily: "Inter_400Regular" },
});