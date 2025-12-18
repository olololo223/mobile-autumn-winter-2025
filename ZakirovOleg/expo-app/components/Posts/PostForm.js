import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';

export function PostForm({
  title,
  submitLabel,
  draftLabel,
  cancelLabel = 'Отмена',
  loading,
  onSubmit,
  onSubmitDraft,
  onCancel,
  postTitle,
  postContent,
  onTitleChange,
  onContentChange,
}) {
  return (
    <View style={styles.createFormContainer}>
      <Text style={styles.createFormTitle}>{title}</Text>
      <TextInput
        style={styles.createFormInput}
        placeholder="Заголовок"
        value={postTitle}
        onChangeText={onTitleChange}
        maxLength={200}
      />
      <TextInput
        style={[styles.createFormInput, styles.createFormTextArea]}
        placeholder="Содержание"
        value={postContent}
        onChangeText={onContentChange}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
      <View style={styles.createFormButtons}>
        <TouchableOpacity
          style={[styles.createFormButton, styles.createFormButtonCancel]}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={[styles.createFormButtonText, { color: '#333' }]}>
            {cancelLabel}
          </Text>
        </TouchableOpacity>
        {onSubmitDraft && (
          <TouchableOpacity
            style={[styles.createFormButton, styles.createFormButtonDraft]}
            onPress={onSubmitDraft}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.createFormButtonText, { color: '#fff' }]}>
                {draftLabel || 'Черновик'}
              </Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.createFormButton, styles.createFormButtonSubmit]}
          onPress={onSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.createFormButtonText, { color: '#fff' }]}>
              {submitLabel}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}


