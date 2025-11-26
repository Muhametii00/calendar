import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/HomeScreenStyles';
import { formatDate } from '../utils/helpers';

interface EventFormData {
  title: string;
  time: string;
  description: string;
  color: string;
}

interface EventModalProps {
  visible: boolean;
  mode: 'add' | 'edit';
  selectedDate: Date;
  eventData: EventFormData;
  onClose: () => void;
  onSave: () => void;
  onEventDataChange: (data: EventFormData) => void;
  validationErrors?: Record<string, string>;
}

export default function EventModal({
  visible,
  mode,
  selectedDate,
  eventData,
  onClose,
  onSave,
  onEventDataChange,
  validationErrors = {},
}: EventModalProps) {
  const [titleError, setTitleError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  useEffect(() => {
    setTitleError(validationErrors.title || '');
    setTimeError(validationErrors.time || '');
    setDescriptionError(validationErrors.description || '');
  }, [validationErrors]);

  useEffect(() => {
    if (!visible) {
      setTitleError('');
      setTimeError('');
      setDescriptionError('');
    }
  }, [visible]);

  const handleTitleChange = (text: string) => {
    onEventDataChange({ ...eventData, title: text });
    if (titleError) {
      setTitleError('');
    }
  };

  const handleTimeChange = (text: string) => {
    const isTyping = text.length > eventData.time.length;

    let formatted = text.replace(/[^\d:]/g, '').slice(0, 5);

    if (isTyping && formatted.length === 2 && !formatted.includes(':')) {
      formatted = formatted + ':';
    }

    const parts = formatted.split(':');
    if (parts.length === 2) {
      const hours = parts[0].slice(0, 2);
      const minutes = parts[1].slice(0, 2);

      const hourNum = hours.length === 2 ? parseInt(hours, 10) : null;
      const validHours = hourNum !== null && hourNum > 23 ? '23' : hours;

      const minNum = minutes.length === 2 ? parseInt(minutes, 10) : null;
      const validMinutes = minNum !== null && minNum > 59 ? '59' : minutes;

      formatted = validHours + ':' + validMinutes;
    } else if (parts.length === 1 && parts[0].length === 2 && isTyping) {
      formatted = parts[0] + ':';
    }

    onEventDataChange({ ...eventData, time: formatted });
    if (timeError) {
      setTimeError('');
    }
  };

  const handleDescriptionChange = (text: string) => {
    onEventDataChange({ ...eventData, description: text });
    if (descriptionError) {
      setDescriptionError('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Add New Event' : 'Edit Event'}
          </Text>
          <Text style={styles.modalDate}>{formatDate(selectedDate)}</Text>

          <View>
            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="Event Title *"
              placeholderTextColor="#999"
              value={eventData.title}
              onChangeText={handleTitleChange}
            />
            {titleError ? (
              <Text style={styles.errorText}>{titleError}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, timeError && styles.inputError]}
              placeholder="Time (e.g., 21:00) *"
              placeholderTextColor="#999"
              value={eventData.time}
              onChangeText={handleTimeChange}
              keyboardType="numeric"
              maxLength={5}
            />
            {timeError ? (
              <Text style={styles.errorText}>{timeError}</Text>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                descriptionError && styles.inputError,
              ]}
              placeholder="Description (optional)"
              placeholderTextColor="#999"
              value={eventData.description}
              onChangeText={handleDescriptionChange}
              multiline
              numberOfLines={3}
            />
            {descriptionError ? (
              <Text style={styles.errorText}>{descriptionError}</Text>
            ) : null}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>
                {mode === 'add' ? 'Save' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
