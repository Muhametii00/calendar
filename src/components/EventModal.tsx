import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/HomeScreenStyles';

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

  // Update errors from props
  useEffect(() => {
    setTitleError(validationErrors.title || '');
    setTimeError(validationErrors.time || '');
    setDescriptionError(validationErrors.description || '');
  }, [validationErrors]);

  // Reset errors when modal closes
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
    onEventDataChange({ ...eventData, time: text });
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
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Add New Event' : 'Edit Event'}
          </Text>
          <Text style={styles.modalDate}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <View>
            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="Event Title *"
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
              placeholder="Time (e.g., 10:00 AM) *"
              value={eventData.time}
              onChangeText={handleTimeChange}
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
