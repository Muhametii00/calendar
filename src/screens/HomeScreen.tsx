import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { Header, Calendar, Event, EventModal } from '../components';
import { styles } from '../styles/HomeScreenStyles';
import { useAuth } from '../context/AuthContext';
import { saveEvent } from '../utils/eventsService';
import { eventSchema, getValidationErrors } from '../utils/validation';
import {
  formatDate,
  getDefaultEventData,
  prepareEventData,
} from '../utils/helpers';
import * as yup from 'yup';

export default function HomeScreen() {
  const { user, selectedDate, setSelectedDate } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventData, setEventData] = useState(getDefaultEventData());
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      await eventSchema.validate(eventData, { abortEarly: false });
      setValidationErrors({});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const event = prepareEventData(eventData);
      await saveEvent(user.uid, selectedDate, event);
      resetModal();
      setShowAddModal(false);
      Alert.alert('Success', 'Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Failed to add event. Please try again.');
    }
  };

  const resetModal = () => {
    setEventData(getDefaultEventData());
    setValidationErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetModal();
  };

  return (
    <View style={styles.container}>
      <Header title="Calendar" subtitle={formatDate(selectedDate)} />
      <ScrollView>
        <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </ScrollView>

      <EventModal
        visible={showAddModal}
        mode="add"
        selectedDate={selectedDate}
        eventData={eventData}
        onClose={handleCloseAddModal}
        onSave={handleAddEvent}
        onEventDataChange={setEventData}
        validationErrors={validationErrors}
      />
    </View>
  );
}
